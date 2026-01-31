from django.http import JsonResponse
from django.forms.models import model_to_dict
from rest_framework.response import Response # type: ignore
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.permissions import IsAuthenticated, AllowAny # type: ignore

import os
from app.models import *
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.conf import settings
from django.db import transaction
from app.utils import *
from django.db.models import Exists, OuterRef, Q

import joblib
import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
MODEL_PATH = os.path.join(settings.BASE_DIR, "id3_model.pkl")
id3_model = joblib.load(MODEL_PATH)

@api_view(['GET'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def get_current_user(request):
    try:
        user = request.user
        user_data = serialize_user_full_profile(user, id3_model=id3_model)
        return JsonResponse({ 'user_info': user_data }, status=200)
        
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)
    
@api_view(['GET'])
@transaction.atomic
@permission_classes([AllowAny])
def get_courses(request):
    try:
        all_courses = EducationCourse.objects.all()
        data = serialize_course(all_courses)
        
        return JsonResponse({ 'courses': data }, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    try:
        limit = request.data.get('limit')
        user = request.user
        
        viewer_exists = NotificationViewer.objects.filter(
            user=user, 
            notification=OuterRef('pk')
        )

        base_query = Notification.objects.select_related('from_user', 'to_user').annotate(
            user_has_read=Exists(viewer_exists)
        ).exclude(from_user=user)

        if user.role == CustomUser.Role.ALUMNI:
            scale = user.alumniscaleprofile_set.first()
            is_ai_employable = False
            if scale:
                prediction = generate_prediction(profile=scale, id3_model=id3_model)
                is_ai_employable = prediction.get('is_employable', False)

            if is_ai_employable:
                notifications = base_query.filter(
                    Q(type=Notification.Type.JOB_POST, to_user=None) | Q(to_user=user)
                )
            else:
                notifications = base_query.filter(to_user=user).exclude(type=Notification.Type.JOB_POST)

        elif user.role == CustomUser.Role.EMPLOYER:
            notifications = base_query.filter(Q(type=Notification.Type.JOB_POST, from_user=user) | Q(to_user=user))
        elif user.role == CustomUser.Role.ADMINISTRATOR:
            notifications = base_query.filter(Q(type=Notification.Type.JOB_POST))
        else:
            notifications = base_query.none()

        notifications = notifications.order_by('-created_at')
        if limit:
            notifications = notifications[:int(limit)]

        serialized_data = []
        for n in notifications:
            data = serialize_notifications(n, request)
            data['is_read'] = n.user_has_read
            serialized_data.append(data)

        return JsonResponse({'notifications': serialized_data}, status=200)

    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def update_notification(request):
    try:
        notification_id = request.data.get('notificationId') 
        
        if not notification_id:
            return JsonResponse({"message": "ID missing"}, status=400)

        notification = Notification.objects.get(id=notification_id)
        NotificationViewer.objects.get_or_create(
            user=request.user,
            notification=notification
        )

        return JsonResponse({'message': 'Notification marked as read!'}, status=200)
    except Notification.DoesNotExist:
        return JsonResponse({"message": "Notification not found"}, status=404)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def get_job_chats(request):
    try:
        job_id = request.POST.get('job_id')

        base_query = Q(from_sender=request.user) | Q(to_sender=request.user)
        chats_queryset = JobChat.objects.filter(
            base_query,
            job_id=job_id
        )

        chats_queryset = chats_queryset.select_related('from_sender', 'to_sender', 'job__job').order_by('created_at')
        job_chats = [serialize_job_chat(chat, request) for chat in chats_queryset]
        
        return JsonResponse({ 'chats': job_chats }, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@transaction.atomic
@permission_classes([IsAuthenticated])
def submit_job_chat(request):
    try:
        message = request.POST.get('message')
        job_id = request.POST.get('job_id')
        from_sender_id = request.POST.get('from_sender_id')
        to_sender_id = request.POST.get('to_sender_id')

        if not message or not job_id:
            return JsonResponse({'success': False, "message": "No data added."}, status=422)
        
        JobChat.objects.create(
            job=AlumniJob.objects.get(id=job_id),
            from_sender = CustomUser.objects.get(id=from_sender_id),
            to_sender = CustomUser.objects.get(id=to_sender_id),
            message=message
        )

        Notification.objects.create(
            from_user=CustomUser.objects.get(id=from_sender_id),
            to_user=CustomUser.objects.get(id=to_sender_id),
            type=Notification.Type.CHAT,
            message=f"{request.user.get_full_name()} submitted a chat: {message}"
        )

        return JsonResponse({'success': True, 'message': "Chat Added." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def get_announcements_outside(request):
    try:
        can_message = request.data.get('can_message')

        all_announcements = Announcement.objects.filter(
            can_message=can_message
        ).select_related('user').order_by('-created_at')
        
        data = [serialize_announcement(a) for a in all_announcements]
        
        return JsonResponse({ 'announcements': data }, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)

@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def update_user_profile_info(request):
    try:
        fname = request.POST.get("fname")
        mname = request.POST.get("mname")
        lname = request.POST.get("lname")
        suffix = request.POST.get("suffix")
        email = request.POST.get("email")
        bio = request.POST.get("bio")
        contact = request.POST.get("contact")
        address = request.POST.get("address")
        gender = request.POST.get("gender")
        birthday = request.POST.get("birthday")
        
        user = request.user
        reloggin = False

        if CustomUser.objects.filter(email=email).exclude(id=user.id).exists():
            return JsonResponse({"message": "Email already registered"}, status=400)

        user.first_name = fname
        user.middle_name = mname
        user.last_name = lname
        user.gender = gender or None
        user.suffix = suffix
        user.address = address
        user.contact_number = contact
        user.birthday = birthday if birthday and birthday != "" else None
        user.bio = bio.strip() if bio and bio != "null" else None

        if user.email != email:
            reloggin = True
            user.is_active = False 
            user.email = email
            user.username = email
            user.save()

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            verify_url = f"https://www.accatjps.online/verify/{uid}/{token}/"

            send_mail(
                subject="Verify your New Email",
                message=f"Hi {fname}, please click the link to verify: {verify_url}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False
            )
        else:
            user.save()

        return JsonResponse({
            'reloggin': reloggin,
            "success": True,
            "message": "Profile updated." + (" Check email to verify." if reloggin else "")
        }, status=200)

    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh_token")
        token = RefreshToken(refresh_token)
        token.blacklist()

        return JsonResponse({ 'success': True }, status=200)
    except Exception as e:
        return Response({'success': False, "message": str(e)}, 400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def update_profile_picture(request):
    try:
        profile_picture = request.FILES.get('profilePicture')

        if not profile_picture:
            return JsonResponse({'success': False, 'message': "No Profile Picture Added." }, status=422)
        
        user = request.user

        if user.profile_picture and 'default-profile-avatar.png' not in user.profile_picture.name:
            if os.path.isfile(user.profile_picture.path):
                os.remove(user.profile_picture.path)

        user.profile_picture = profile_picture
        user.save()
        
        return JsonResponse({'success': True, 'message': "Profile Picture Updated." }, status=200)
    except Exception as e:
        return Response({'success': False, "message": str(e)}, 400)

@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def update_password(request):
    try:
        user = request.user
        currentPassword = request.data.get("currentPassword")
        password = request.data.get("password")
        passwordConfirmation = request.data.get("passwordConfirmation")

        if password != passwordConfirmation:
            return JsonResponse({"message": "Passwords do not match. Please try again."}, status=400)
        
        if not user.check_password(currentPassword):
            return JsonResponse({"message": "The current password you entered is incorrect."}, status=400)

        user.set_password(password)
        user.save()
        reloggin = True
        
        return JsonResponse({
            'reloggin': reloggin,
            'success': True, 
            'message': "Password updated successfully. Please log in again with your new password." 
        }, status=200)

    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
from django.core.mail import send_mail
from django.conf import settings

@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def update_application_status(request):
    try:
        application_id = request.POST.get("applicationId")
        new_status = request.POST.get("status")
        remarks = request.POST.get("remarks")

        if not application_id or not new_status:
            return JsonResponse({"success": False, "message": "Missing application ID or status."}, status=400)

        try:
            application = AlumniJob.objects.select_related('user', 'job', 'job__user').get(id=application_id)
        except AlumniJob.DoesNotExist:
            return JsonResponse({"success": False, "message": "Application not found."}, status=404)

        application.status = new_status
        if remarks:
            application.remarks = remarks
        application.save()

        applicant = application.user
        job_title = application.job.title
        employer_name = f"{request.user.first_name} {request.user.last_name}"

        subject = f"Application Update: {job_title}"
        email_body = (
            f"Hi {applicant.first_name},\n\n"
            f"There has been an update regarding your application for '{job_title}'.\n\n"
            f"New Status: {new_status}\n"
            f"Employer Remarks: {remarks if remarks else 'No additional remarks.'}\n\n"
            f"Please log in to your dashboard for more details.\n\n"
            f"Best regards,\n{employer_name}"
        )

        send_mail(
            subject,
            email_body,
            settings.DEFAULT_FROM_EMAIL,
            [applicant.email],
            fail_silently=True,
        )

        return JsonResponse({'success': True, 'message': f"Application updated to {new_status} and applicant notified."}, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)