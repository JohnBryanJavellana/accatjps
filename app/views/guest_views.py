from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from django.contrib.auth.hashers import make_password
import json
from django.db import transaction
from app.models import *
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

@csrf_exempt
@transaction.atomic
def login_user(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        type = request.POST.get("type")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)

        if user.check_password(password):
            if not user.is_active:
                return JsonResponse({
                    "success": False, 
                    "message": "Email not verified. Please check your inbox."
                }, status=403)
            
            if user.account_status in ["ON-HOLD", "DECLINED"]:
                status_display = user.account_status.title() 
                
                return JsonResponse({
                    "success": False, 
                    "message": f"Access denied. Your account is currently {status_display}. Please contact the administrator for assistance."
                }, status=403)
            
            if user.role != "ADMINISTRATOR" and user.role != type:
                return JsonResponse({
                    "success": False, 
                    "message": f"Credentials doesn't match to any {type} account."
                }, status=403)

            refresh = RefreshToken.for_user(user)
            History.objects.create(user=user, action="Logged in account")
            
            return JsonResponse({
                "success": True,
                "message": "Login successful",
                "role": user.role,
                "token": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=200)
        
        return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)

@csrf_exempt  
@transaction.atomic
def register_user(request):
    if request.method == "POST":
        try:
            fname = request.POST.get("fname")
            mname = request.POST.get("mname")
            lname = request.POST.get("lname")
            suffix = request.POST.get("suffix")
            email = request.POST.get("email")
            role = request.POST.get("role")
            password = request.POST.get("password")
            businessName = request.POST.get("businessName")
            country = request.POST.get("country")
            business_type = request.POST.get("business_type")
            phoneNumber = request.POST.get("phoneNumber")
            confirm_password = request.POST.get("password_confirmation")

            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"message": "Email already registered"}, status=400)

            if password != confirm_password:
                return JsonResponse({"message": "Password not match. Please try again."}, status=400)
            
            user = CustomUser.objects.create(
                first_name=fname,
                last_name=lname,
                middle_name=mname,
                suffix=suffix,
                role=role,
                username=email,
                email=email,
                contact_number = phoneNumber or None,
                password=make_password(password),
                is_active=False
            )

            if role == "EMPLOYER":
                permit = request.FILES.get('permit_document')
                bir = request.FILES.get('bir_document')
                sec = request.FILES.get('sec_document')

                if not all([permit, bir, sec]):
                    return JsonResponse({'message': 'All documents are required'}, status=400)

                EmployerAccount.objects.create(
                    user=user,
                    business_name=businessName,
                    country=country,
                    business_type=business_type,
                    business_permit=permit,
                    bir_2303=bir,
                    sec_dti_reg=sec
                )

            if role == "ALUMNI":
                languages_list = request.POST.getlist('language[]')
                skills_list = request.POST.getlist('skill[]')
                certificates_json = request.POST.get('certificates')
                course = request.POST.get('course')
                courseHighlights = request.POST.get('courseHighlights')
                yearGraduated = request.POST.get('yearGraduated')
                appearance = request.POST.get('general_appearance')
                speaking = request.POST.get('manner_of_speaking')
                physical = request.POST.get('physical_condition')
                alertness = request.POST.get('mental_alertness')
                confidence = request.POST.get('self_confidence')
                ideas = request.POST.get('ability_to_present_ideas')
                communication = request.POST.get('communication_skills')
                performance = request.POST.get('student_performance_rating')
    
                for lang_item in languages_list:
                    if lang_item:
                        AlumniLanguagesProfile.objects.create(
                            user=user,
                            language=lang_item
                        )

                for skill_item in skills_list:
                    if skill_item:
                        AlumniSkillsProfile.objects.create(
                            user=user,
                            skill=skill_item
                        )

                AlumniEducationalProfile.objects.create(
                    user=user,
                    course=EducationCourse.objects.get(id=course),
                    course_highlights=courseHighlights,
                    year_graduated=yearGraduated
                )

                AlumniScaleProfile.objects.create(
                    user=user,
                    general_appearance=int(appearance) if appearance else 0,
                    manner_of_speaking=int(speaking) if speaking else 0,
                    physical_condition=int(physical) if physical else 0,
                    mental_alertness=int(alertness) if alertness else 0,
                    self_confidence=int(confidence) if confidence else 0,
                    ability_to_present_ideas=int(ideas) if ideas else 0,
                    communication_skills=int(communication) if communication else 0,
                    student_performance_rating=int(performance) if performance else 0
                )
                
                if certificates_json:
                    certificates_data = json.loads(certificates_json)
                    
                    for item in certificates_data:
                        AlumniCertificationsProfile.objects.create(
                            user=user,
                            certificate=item.get('certificate'),
                            certificate_description=item.get('certificate_description'),
                            expiry_date=item.get('expiry_date')
                        )

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            verify_url = f"https://www.accatjps.online/verify/{uid}/{token}/"

            send_mail(
                subject="Verify your Email",
                message=f"Hi {fname}, please click the link to verify your account: {verify_url}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )

            return JsonResponse({
                "success": True,
                "message": "Registration successful. Please check your email to verify your account."
            }, status=201)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=400)

@csrf_exempt   
@transaction.atomic
def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = CustomUser.objects.get(pk=uid)
        
        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save(update_fields=['is_active']) 
            user.refresh_from_db()
            
            return JsonResponse({
                "success": True, 
                "message": "Account activated! You can now login."
            }, status=200)
        else:
            return JsonResponse({
                "success": False, 
                "message": "The verification link is invalid or has expired."
            }, status=400)

    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist) as e:
        return JsonResponse({"success": False, "message": "User not found."}, status=404)
    
@csrf_exempt
@transaction.atomic
def request_password_reset(request):
    if request.method == "POST":
        email = request.POST.get("email")
        user = CustomUser.objects.filter(email=email).first()

        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"https://www.accatjps.online/password-reset-confirm/{uid}/{token}/"

            send_mail(
                subject="Password Reset Request",
                message=f"Click the link to reset your password: {reset_url}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )
        
            return JsonResponse({"success": True, "message": "If an account exists with this email, a reset link has been sent."}, status=200)
        return JsonResponse({"success": False, "message": "Email not found."}, status=404)

@csrf_exempt
@transaction.atomic
def confirm_password_reset(request, uidb64, token):
    if request.method == "POST":
        try:
            confirm_password = request.POST.get("confirm_password")
            new_password = request.POST.get("password")
            
            if new_password == confirm_password:
                uid = urlsafe_base64_decode(uidb64).decode()
                user = CustomUser.objects.get(pk=uid)

                if default_token_generator.check_token(user, token):
                    user.set_password(new_password)
                    user.save()
                    return JsonResponse({"success": True, "message": "Password reset successful!"})
                else:
                    return JsonResponse({"success": False, "message": "Invalid or expired token."}, status=400)
            else:
                return JsonResponse({"success": False, "message": "Password not match. Please try again."}, status=400)
        except Exception as e:
            return JsonResponse({"message": "Invalid request."}, status=400)