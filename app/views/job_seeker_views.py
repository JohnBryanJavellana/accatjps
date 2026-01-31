from django.http import JsonResponse
from django.forms.models import model_to_dict
from rest_framework.response import Response # type: ignore
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.permissions import IsAuthenticated, AllowAny # type: ignore
from app.models import *
from django.db import transaction
from app.utils import *
import joblib
from django.db.models import Q, Count
import os
from django.conf import settings
from django.core.mail import send_mail
import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
MODEL_PATH = os.path.join(settings.BASE_DIR, "id3_model.pkl")
id3_model = joblib.load(MODEL_PATH)

@api_view(['POST'])
@transaction.atomic
@transaction.atomic
@permission_classes([IsAuthenticated])
def new_language(request):
    try:
        language = request.POST.get('language')

        if not language:
            return JsonResponse({'success': False, "message": "No language added."}, status=422)
        
        AlumniLanguagesProfile.objects.create(
            user=request.user,
            language=language
        )

        return JsonResponse({'success': True, 'message': "Language Added." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def remove_language(request):
    try:
        language = request.POST.get('documentId')

        if not language:
            return JsonResponse({'success': False, "message": "No language added."}, status=422)
        
        AlumniLanguagesProfile.objects.get(id=language).delete()

        return JsonResponse({'success': True, 'message': "Language Removed." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def create_or_update_lc(request):
    try:
        certificate = request.POST.get('certificate')
        certificateDescription = request.POST.get('certificateDescription')
        expiryDate = request.POST.get('expiryDate')
        documentId = request.POST.get('documentId')

        if not certificate or not certificateDescription or not expiryDate:
            return JsonResponse({'success': False, "message": "No data supplied."}, status=422)
        
        AlumniCertificationsProfile.objects.update_or_create(
            id=documentId, 
            user=request.user,
            defaults={
                'certificate': certificate,
                'certificate_description': certificateDescription,
                'expiry_date': expiryDate,
            }
        )

        return JsonResponse({'success': True, 'message': "License or Certifications Saved." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def remove_lc(request):
    try:
        lc = request.POST.get('documentId')

        if not lc:
            return JsonResponse({'success': False, "message": "No id added."}, status=422)
        
        AlumniCertificationsProfile.objects.get(id=lc).delete()

        return JsonResponse({'success': True, 'message': "License or Certifications Removed." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def new_skill(request):
    try:
        skill = request.POST.get('skill')

        if not skill:
            return JsonResponse({'success': False, "message": "No skill added."}, status=422)
        
        AlumniSkillsProfile.objects.create(
            user=request.user,
            skill=skill
        )

        return JsonResponse({'success': True, 'message': "Skill Added." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def remove_skill(request):
    try:
        skill = request.POST.get('documentId')

        if not skill:
            return JsonResponse({'success': False, "message": "No id added."}, status=422)
        
        AlumniSkillsProfile.objects.get(id=skill).delete()

        return JsonResponse({'success': True, 'message': "Skill Removed." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def create_or_update_education(request):
    try:
        course = request.POST.get('course')
        courseHighlights = request.POST.get('courseHighlights')
        yearGraduated = request.POST.get('yearGraduated')
        documentId = request.POST.get('documentId')

        if not course or not yearGraduated:
            return JsonResponse({'success': False, "message": "No data supplied."}, status=422)
        
        AlumniEducationalProfile.objects.update_or_create(
            id=documentId, 
            user=request.user,
            defaults={
                'course': EducationCourse.objects.get(id=course),
                'course_highlights': courseHighlights,
                'year_graduated': yearGraduated,
            }
        )

        return JsonResponse({'success': True, 'message': "Education Saved." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def bookmark_job_post(request):
    try:
        document_id = request.POST.get('documentId')
        status = request.POST.get('status')

        if not document_id or not status:
            return JsonResponse({'success': False, "message": "Missing documentId or status."}, status=422)
        
        try:
            job = JobPost.objects.get(id=document_id)
        except JobPost.DoesNotExist:
            return JsonResponse({'success': False, "message": "Job post not found."}, status=404)

        if status == "SAVE":
            bookmark, created = AlumniJobArchive.objects.get_or_create(
                user=request.user,
                job=job
            )
            message = "Job Post Saved."
        
        elif status == "REMOVE":
            AlumniJobArchive.objects.filter(user=request.user, job=job).delete()
            message = "Job removed from saved list."
        
        else:
            return JsonResponse({'success': False, "message": "Invalid status value."}, status=400)

        return JsonResponse({
            'success': True, 
            'message': message
        }, status=200)

    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def create_or_update_personal_scale(request):
    try:
        appearance = request.POST.get('general_appearance')
        speaking = request.POST.get('manner_of_speaking')
        physical = request.POST.get('physical_condition')
        alertness = request.POST.get('mental_alertness')
        confidence = request.POST.get('self_confidence')
        ideas = request.POST.get('ability_to_present_ideas')
        communication = request.POST.get('communication_skills')
        performance = request.POST.get('student_performance_rating')
        documentId = request.POST.get('documentId')

        if not appearance or not speaking or not physical or not alertness or not confidence or not ideas or not communication or not performance:
            return JsonResponse({'success': False, "message": "No data supplied."}, status=422)
        
        AlumniScaleProfile.objects.update_or_create(
            id=documentId, 
            user=request.user,
            defaults={
                'general_appearance': int(appearance) if appearance else 0,
                'manner_of_speaking': int(speaking) if speaking else 0,
                'physical_condition': int(physical) if physical else 0,
                'mental_alertness': int(alertness) if alertness else 0,
                'self_confidence': int(confidence) if confidence else 0,
                'ability_to_present_ideas': int(ideas) if ideas else 0,
                'communication_skills': int(communication) if communication else 0,
                'student_performance_rating': int(performance) if performance else 0
            }
        )

        return JsonResponse({'success': True, 'message': "Personal Scale Saved." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)

@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def get_announcement_messages(request):
    try:
        post_id = request.data.get('post_id') 

        if not post_id:
            return JsonResponse({'success': False, "message": "post_id is required"}, status=400)

        messages = AnnouncementMessage.objects.filter(announcement_id=post_id).select_related('user').order_by('-created_at')

        data = [{
            "id": msg.id,
            "message": msg.message,
            "created_at": msg.created_at,
            "user": serialize_user_full_profile(msg.user)
        } for msg in messages]

        return JsonResponse({'success': True, "messages": data}, status=200)

    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@transaction.atomic
@permission_classes([IsAuthenticated])
def submit_comment(request):
    try:
        comment = request.POST.get('message')
        documentId = request.POST.get('documentId')

        if not comment or not documentId:
            return JsonResponse({'success': False, "message": "No data added."}, status=422)
        
        AnnouncementMessage.objects.create(
            user=request.user,
            announcement=Announcement.objects.get(id=documentId),
            message=comment
        )

        return JsonResponse({'success': True, 'message': "Comment Added." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)

@api_view(['POST'])
@transaction.atomic
@permission_classes([AllowAny])
def get_applicable_jobs(request):
    try:
        raw_location = request.data.get('location_coordinates', "").strip()
        search_query = raw_location
        if "," in raw_location:
            parts = [p.strip() for p in raw_location.split(',')]
            if len(parts) >= 3:
                search_query = parts[-3]

        profile = None
        user_courses = None
        is_employable = None
        prediction_text = "N/A"
        applied_active_job_ids = []
        bookmarked_job_ids = []

        if request.user.is_authenticated:
            try:
                profile = AlumniScaleProfile.objects.get(user=request.user)
                user_courses = AlumniEducationalProfile.objects.filter(user=request.user).values_list('course_id', flat=True)
                prediction = generate_prediction(profile=profile, id3_model=id3_model)

                is_employable = prediction['is_employable']
                prediction_text = prediction['prediction_text']
                
                applied_active_job_ids = AlumniJob.objects.filter(user=request.user).exclude(
                    status__in=[AlumniJob.Status.FINISHED, AlumniJob.Status.WITHDRAWN, AlumniJob.Status.REJECTED]
                ).values_list('job_id', flat=True)
                
                bookmarked_job_ids = AlumniJobArchive.objects.filter(user=request.user).values_list('job_id', flat=True)
            except AlumniScaleProfile.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Scale profile missing.'}, status=403)

        jobs_queryset = JobPost.objects.filter(status=JobPost.Status.ACTIVE)

        if request.user.is_authenticated and profile:
            course_filter = Q(jobpostcourse__course__in=user_courses) | Q(jobpostcourse__isnull=True)
            jobs_queryset = jobs_queryset.filter(
                course_filter,
                min_general_appearance__lte=int(profile.general_appearance or 0),
                min_manner_of_speaking__lte=int(profile.manner_of_speaking or 0),
                min_physical_condition__lte=int(profile.physical_condition or 0),
                min_mental_alertness__lte=int(profile.mental_alertness or 0),
                min_self_confidence__lte=int(profile.self_confidence or 0),
                min_ability_to_present_ideas__lte=int(profile.ability_to_present_ideas or 0),
                min_communication_skills__lte=int(profile.communication_skills or 0),
                min_student_performance_rating__lte=int(profile.student_performance_rating or 0)
            ).exclude(id__in=applied_active_job_ids)

        if search_query:
            jobs_queryset = jobs_queryset.filter(location__icontains=search_query)

        jobs_queryset = jobs_queryset.distinct().select_related('pay_range', 'user')

        jobpost_list = []
        for job in jobs_queryset:
            serialized_job = serialize_job_post(
                job=job, 
                user_profile=profile, # Will be None if guest
                request=request,
                is_bookmarked=(job.id in bookmarked_job_ids)
            )
            
            job_courses = job.jobpostcourse_set.all()
            serialized_job['course_name'] = ", ".join([jc.course.course_name for jc in job_courses]) if job_courses.exists() else "General / All Courses"
            
            serialized_job['is_highly_recommended'] = bool(
                request.user.is_authenticated and 
                serialized_job.get('match_percentage', 0) >= 75 and 
                int(is_employable or 0) == 1
            )
            
            jobpost_list.append(serialized_job)

        if request.user.is_authenticated:
            jobpost_list = sorted(jobpost_list, key=lambda x: x.get('match_percentage', 0), reverse=True)

        return JsonResponse({
            'success': True, 
            'user': list(applied_active_job_ids),
            'jobpost': jobpost_list,
            'employability_prediction': prediction_text,
            'is_employable': bool(is_employable == 1) if is_employable is not None else False,
            'filtered_by_city': search_query,
            'is_guest': not request.user.is_authenticated
        }, status=200)

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def apply_job(request):
    try:
        resume = request.FILES.get('resume')
        cover_letter = request.FILES.get('cover_letter')
        document_id = request.POST.get('documentId')

        if not document_id:
            return JsonResponse({'success': False, "message": "Job ID is required."}, status=422)

        try:
            job = JobPost.objects.get(id=document_id)
        except JobPost.DoesNotExist:
            return JsonResponse({'success': False, "message": "The job post no longer exists."}, status=404)

        existing_app = AlumniJob.objects.filter(
            user=request.user, 
            job=job
        ).exclude(status__in=[
            AlumniJob.Status.FINISHED, 
            AlumniJob.Status.WITHDRAWN, 
            AlumniJob.Status.REJECTED
        ]).exists()

        if existing_app:
            return JsonResponse({'success': False, "message": "You already have an active application for this job."}, status=400)

        application = AlumniJob.objects.create(
            user=request.user,
            job=job,
            status=AlumniJob.Status.PENDING
        )

        if resume:
            AlumniJobResume.objects.create(
                user=application,
                resume=resume
            )

        if cover_letter:
            AlumniJobCoverLetter.objects.create(
                user=application,
                cover_letter=cover_letter
            )

        employer = job.user
        alumni_name = f"{request.user.first_name} {request.user.middle_name} {request.user.last_name} {request.user.suffix}"
        
        subject = f"New Job Application: {job.title} - {alumni_name}"
        email_message = (
            f"Hello {employer.first_name},\n\n"
            f"You have received a new application for the position of '{job.title}'.\n\n"
            f"Applicant: {alumni_name}\n"
            f"Email: {request.user.email}\n\n"
            f"Please log in to the portal to review the resume and cover letter.\n\n"
            f"Best regards,\nYour Job Portal Team"
        )

        send_mail(
            subject,
            email_message,
            settings.EMAIL_HOST_USER,
            [employer.email],
            fail_silently=True
        )

        Notification.objects.create(
            from_user=request.user,
            to_user=employer,
            type=Notification.Type.JOB_POST,
            message=f"{alumni_name} has applied for the position of '{job.title}'."
        )

        return JsonResponse({
            'success': True, 
            'message': "Application submitted successfully!" 
        }, status=200)

    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_applied_jobs(request):
    try:
        profile = AlumniScaleProfile.objects.get(user=request.user)
        applications = AlumniJob.objects.filter(user=request.user).select_related(
            'job', 'job__pay_range', 'job__user'
        ).order_by('-created_at')
        
        bookmarked_ids = AlumniJobArchive.objects.filter(user=request.user).values_list('job_id', flat=True)

        job_list = []
        for app in applications:
            job_dict = serialize_job_post(
                app.job, 
                profile, 
                request, 
                is_bookmarked=(app.job.id in bookmarked_ids),
                application_status=app.status
            )
            
            job_dict['application_id'] = app.id 
            job_dict['remarks'] = app.remarks
            
            job_list.append(job_dict)

        return JsonResponse({'success': True, 'jobpost': job_list}, status=200)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_jobs(request):
    try:
        profile = AlumniScaleProfile.objects.get(user=request.user)
        bookmarks = AlumniJobArchive.objects.filter(user=request.user).select_related('job', 'job__pay_range', 'job__user').order_by('-id')

        applied_dict = {
            aj.job_id: aj.status for aj in AlumniJob.objects.filter(user=request.user)
        }

        job_list = [
            serialize_job_post(
                b.job, 
                profile, 
                request, 
                is_bookmarked=True,
                application_status=applied_dict.get(b.job.id)
            ) for b in bookmarks
        ]

        return JsonResponse({'success': True, 'jobpost': job_list}, status=200)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def al_report_data(request):
    try:
        user = request.user
        total_applied = AlumniJob.objects.filter(user=user).count()
        total_interviews = AlumniJob.objects.filter(user=user, status='INTERVIEW').count()
        total_hired = AlumniJob.objects.filter(user=user, status='HIRED').count()
        
        success_rate = "0%"
        if total_applied > 0:
            rate = (total_hired / total_applied) * 100
            success_rate = f"{round(rate, 1)}%"

        status_counts = AlumniJob.objects.filter(user=user).values('status').annotate(count=Count('status'))
        status_distribution = {item['status']: item['count'] for item in status_counts}
        recent_applications = AlumniJob.objects.filter(user=user).order_by('-created_at')[:5]
        
        job_competition_data = []
        for app in recent_applications:
            total_applicants_for_job = AlumniJob.objects.filter(job=app.job).count()
            
            job_competition_data.append({
                'title': app.job.title,
                'applicants': total_applicants_for_job,
                'status': app.status
            })

        report_data = {
            'summary': {
                'total_job_posts': total_applied,
                'total_applications_received': total_interviews,
                'total_chat_interactions': JobChat.objects.filter(
                    Q(from_sender=user) | Q(to_sender=user)
                ).count(),
                'hiring_rate': success_rate,
            },
            'status_distribution': status_distribution,
            'top_performing_posts': job_competition_data
        }

        return JsonResponse({'success': True, 'reportData': report_data}, status=200)

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)