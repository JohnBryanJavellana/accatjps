from app.models import *
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from app.utils import *
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction
from django.db.models import Count, Q
from django.db.models.functions import TruncYear

User = get_user_model()

@api_view(['GET'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def get_users(request):
    try:
        users_queryset = User.objects.exclude(role="ADMINISTRATOR").prefetch_related(
            'alumnieducationalprofile_set',
            'alumnicertificationsprofile_set',
            'alumniskillsprofile_set',
            'alumnilanguagesprofile_set',
            'alumniscaleprofile_set',
            'alumnijob_set',
            'employeraccount_set'
        )
        
        users_list = [
            serialize_user_full_profile(user, request) 
            for user in users_queryset
        ]
        
        return JsonResponse({'success': True, 'users': users_list}, status=200)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    try:
        if request.user.role != "ADMINISTRATOR":
            return JsonResponse({'success': False, 'message': 'Access Denied: Administrators only.'}, status=403)

        base_users = CustomUser.objects.exclude(role="ADMINISTRATOR")
        alumni_users = base_users.filter(role="ALUMNI")
        employer_users = base_users.filter(role="EMPLOYER")

        alumni_per_course = list(
            AlumniEducationalProfile.objects.values('course__course_name')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        alumni_per_batch = list(
            AlumniEducationalProfile.objects.values('year_graduated')
            .annotate(count=Count('id'))
            .order_by('-year_graduated')
        )

        hired_count = AlumniJob.objects.filter(status="HIRED").values('user').distinct().count()
        total_alumni_count = alumni_users.count()
        unemployed_count = max(0, total_alumni_count - hired_count)

        employment_stats = {
            'employed': hired_count,
            'unemployed': unemployed_count
        }

        employer_type_counts = list(
            EmployerAccount.objects.values('business_type')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        alumni_verification = {
            'verified': alumni_users.filter(account_status="APPROVED").count(),
            'pending': alumni_users.filter(account_status="VERIFICATION").count(),
            'declined': alumni_users.filter(account_status="DECLINED").count(),
        }

        employer_verification = {
            'verified': employer_users.filter(account_status="APPROVED").count(), 
            'pending': employer_users.filter(account_status="VERIFICATION").count(),
            'declined': employer_users.filter(account_status="DECLINED").count(),
        }

        total_jobs = JobPost.objects.count()
        active_jobs = JobPost.objects.filter(status="ACTIVE").count()

        dashboardData = {
            'summary': {
                'totalUsers': base_users.count(),
                'totalAlumni': total_alumni_count,
                'totalEmployers': employer_users.count(),
                'currentlyEmployed': hired_count,
                'totalJobPosts': total_jobs,
                'activeJobPosts': active_jobs
            },
            'verificationStats': {
                'alumni': alumni_verification,
                'employers': employer_verification
            },
            'employmentStats': employment_stats,
            'employerTypes': employer_type_counts,
            'alumniDetails': {
                'byCourse': alumni_per_course,
                'byBatch': alumni_per_batch,
            },
            'recentUsers': list(base_users.order_by('-date_joined')[:5].values(
                'id', 'first_name', 'last_name', 'role', 'account_status', 'date_joined'
            ))
        }

        return JsonResponse({'success': True, 'dashboardData': dashboardData}, status=200)

    except Exception as e:
        # Logging the error for the developer is recommended
        print(f"Dashboard Error: {str(e)}")
        return JsonResponse({'success': False, 'message': 'Internal Server Error'}, status=500)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def account_activation(request):
    try:
        status = request.data.get("status")
        remarks = request.data.get("remarks")
        userId = request.data.get("userId")
        user = User.objects.get(id=userId)

        if status is None or userId is None:
            return JsonResponse({"message": "No data provided."}, status=400)

        user.account_status = status
        user.declined_remarks = remarks if status in ["DECLINED", "ON-HOLD"] else None
        user.save()

        subject = f"Account Update: {status}"
        
        if status == "APPROVED":
            message = (
                f"Hi {user.first_name},\n\n"
                "Great news! Your account has been approved. "
                "You can now access all features of the platform.\n\n"
                "Best regards,\nAdmin Team"
            )
        elif status == "DECLINED" or status == "ON-HOLD":
            message = (
                f"Hi {user.first_name},\n\n"
                f"We regret to inform you that your account registration was {status}.\n"
                f"Reason/Remarks: {remarks if remarks else 'No specific reason provided.'}\n\n"
                "If you believe this is a mistake, please reply to this email."
            )
        else:
            message = f"Hi {user.first_name}, your account status has been updated to: {status}."

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False
        )
        
        return JsonResponse({
            'success': True, 
            'message': f"User status updated to {status} and notification sent." 
        }, status=200)

    except User.DoesNotExist:
        return JsonResponse({'success': False, "message": "User not found."}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def update_document_status(request):
    try:
        status = request.data.get("status")
        remarks = request.data.get("remarks")
        index = int(request.data.get("index"))
        documentId = request.data.get("documentId")

        if status is None or index is None or documentId is None:
            return JsonResponse({"message": "Missing required data (status, index, or documentId)."}, status=400)

        try:
            documentFile = EmployerAccount.objects.select_related('user').get(id=documentId)
        except EmployerAccount.DoesNotExist:
            return JsonResponse({'success': False, "message": "Employer Account record not found."}, status=404)

        user = documentFile.user
        doc_name = ""

        if index == 0:
            doc_name = "Business Permit"
            documentFile.business_permit_status = status
            documentFile.business_permit_remarks = remarks
        elif index == 1:
            doc_name = "BIR 2303"
            documentFile.bir_2303_status = status
            documentFile.bir_2303_remarks = remarks
        elif index == 2:
            doc_name = "SEC/DTI Registration"
            documentFile.sec_dti_reg_status = status
            documentFile.sec_dti_reg_remarks = remarks
        else:
            return JsonResponse({"message": "Invalid document index."}, status=400)

        documentFile.save()

        subject = f"Document Update: {doc_name} - {status}"
        greeting = f"Hi {user.first_name if user.first_name else 'Employer'},"
        
        if status == "VERIFIED":
            message = (
                f"{greeting}\n\n"
                f"We have successfully verified your {doc_name}.\n"
                "Thank you for providing the necessary documentation.\n\n"
                "Best regards,\nAdmin Team"
            )
        elif status == "REJECTED":
            message = (
                f"{greeting}\n\n"
                f"Your {doc_name} has been marked as REJECTED.\n"
                f"Reason/Remarks: {remarks if remarks else 'No specific reason provided.'}\n\n"
                "Please re-upload a clear and valid copy of the document through your profile settings to proceed with account activation.\n\n"
                "Best regards,\nAdmin Team"
            )
        else:
            message = (
                f"{greeting}\n\n"
                f"The status of your {doc_name} has been set to: {status}.\n"
                f"Remarks: {remarks if remarks else 'None'}"
            )

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False
        )
        
        return JsonResponse({
            'success': True, 
            'message': f"{doc_name} status updated to {status} and email sent to {user.email}." 
        }, status=200)

    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=500)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def create_or_update_course(request):
    try:
        course = request.POST.get('course')
        documentId = request.POST.get('documentId')

        if not course:
            return JsonResponse({'success': False, "message": "No data supplied."}, status=422)
        
        EducationCourse.objects.update_or_create(
            id=documentId,
            defaults={
                'course_name': course
            }
        )

        return JsonResponse({'success': True, 'message': "Course Saved." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)

@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def remove_course(request):
    try:
        course_id = request.data.get('documentId')

        if not course_id:
            return JsonResponse({'success': False, "message": "No course ID provided."}, status=422)
        
        try:
            course = EducationCourse.objects.get(id=course_id)
        except EducationCourse.DoesNotExist:
            return JsonResponse({'success': False, "message": "Course not found."}, status=404)

        is_in_use = AlumniEducationalProfile.objects.filter(course=course).exists()

        if is_in_use:
            return JsonResponse({
                'success': False, 
                'message': "Cannot remove course. It is currently linked to alumni profiles."
            }, status=400)

        course.delete()

        return JsonResponse({'success': True, 'message': "Course Removed."}, status=200)

    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_announcements(request):
    try:
        can_message = request.data.get('can_message', "0")

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
def create_or_update_announcement(request):
    try:
        title = request.POST.get('title')
        content = request.POST.get('content')
        documentId = request.POST.get('documentId')
        can_message = request.POST.get('can_message', "0")
        attachment = request.FILES.get('attachment', None)

        if not title or not content:
            return JsonResponse({'success': False, "message": "Title and content are required."}, status=422)
        
        announcement_defaults = {
            'user': request.user,
            'title': title,
            'can_message': can_message,
            'content': content
        }

        if attachment:
            announcement_defaults['attachment'] = attachment

        announcement, created = Announcement.objects.update_or_create(
            id=documentId if documentId and documentId != "null" else None,
            defaults=announcement_defaults
        )

        message = "Announcement Created." if created else "Announcement Updated."
        return JsonResponse({'success': True, 'message': message}, status=200)

    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)

@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def remove_announcement(request):
    try:
        announcement_id = request.data.get('documentId')

        if not announcement_id:
            return JsonResponse({'success': False, "message": "No ID provided."}, status=422)
        
        announcement = Announcement.objects.get(id=announcement_id)
        announcement.delete()

        return JsonResponse({'success': True, 'message': "Announcement Removed."}, status=200)

    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)