from app.models import *
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.permissions import IsAuthenticated, AllowAny # type: ignore
from django.db import transaction
from django.forms.models import model_to_dict
from app.utils import *
import joblib
from django.db.models import Count, Q
import re
import json
import os
from django.conf import settings
from django.core.mail import send_mail
from django.conf import settings
import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
MODEL_PATH = os.path.join(settings.BASE_DIR, "id3_model.pkl")
id3_model = joblib.load(MODEL_PATH)

@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def create_or_update_business(request):
    try:
        businessName = request.POST.get('businessName')
        country = request.POST.get('country')
        business_type = request.POST.get('business_type')

        if not businessName or not country or not business_type:
            return JsonResponse({'success': False, "message": "No data supplied."}, status=422)
        
        EmployerAccount.objects.update_or_create(
            user=request.user,
            defaults={
                'business_name': businessName,
                'business_type': business_type,
                'country': country
            }
        )

        return JsonResponse({'success': True, 'message': "Business Details Saved." }, status=200)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def update_doc_file(request):
    try:
        permit_file = request.FILES.get('permit_file')
        index_raw = request.data.get("index")
        documentId = request.data.get("documentId")

        if not permit_file or index_raw is None or not documentId:
            return JsonResponse({"message": "Missing required data (file, index, or documentId)."}, status=400)

        index = int(index_raw)

        try:
            documentFile = EmployerAccount.objects.select_related('user').get(id=documentId)
        except EmployerAccount.DoesNotExist:
            return JsonResponse({'success': False, "message": "Employer Account record not found."}, status=404)

        user = documentFile.user
        doc_name = ""

        if index == 0:
            doc_name = "Business Permit"
            documentFile.business_permit = permit_file
            documentFile.business_permit_status = EmployerAccount.DocStatus.VERIFICATION
            documentFile.business_permit_remarks = None
        elif index == 1:
            doc_name = "BIR 2303"
            documentFile.bir_2303 = permit_file
            documentFile.bir_2303_status = EmployerAccount.DocStatus.VERIFICATION
            documentFile.bir_2303_remarks = None
        elif index == 2:
            doc_name = "SEC/DTI Registration"
            documentFile.sec_dti_reg = permit_file
            documentFile.sec_dti_reg_status = EmployerAccount.DocStatus.VERIFICATION
            documentFile.sec_dti_reg_remarks = None
        else:
            return JsonResponse({"message": "Invalid document index."}, status=400)

        documentFile.save()

        subject = f"Document Re-uploaded: {doc_name}"
        greeting = f"Hi {user.first_name if user.first_name else 'Employer'},"
        
        message = (
            f"{greeting}\n\n"
            f"This is to confirm that you have successfully re-uploaded your {doc_name}.\n"
            "Our admin team will review the document shortly. You will receive another "
            "email notification once the status has been updated.\n\n"
            "Thank you for your patience.\n\n"
            "Best regards,\nAdmin Team"
        )

        send_mail(
            subject,
            message,
            user.email,
            [settings.EMAIL_HOST_USER],
            fail_silently=False
        )
        
        return JsonResponse({
            'success': True, 
            'message': f"{doc_name} has been re-uploaded and is now pending verification." 
        }, status=200)

    except ValueError:
        return JsonResponse({'success': False, "message": "Invalid index format."}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=500)

@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def get_job_ads(request):
    try:
        status = request.POST.get('statusses')

        jobs_queryset = JobPost.objects.filter(status=status).filter(user=request.user).select_related(
            'pay_range', 'user'
        ).prefetch_related('alumnijob_set', 'jobpostcourse_set__course')
        
        jobpost_list = []
        
        for job in jobs_queryset:
            job_dict = model_to_dict(job)
            
            alumni_connections = job.alumnijob_set.all()
            job_dict['created_at'] = job.created_at.strftime("%Y-%m-%d %H:%M:%S") if job.created_at else None
            job_dict['has_alumni_connection'] = alumni_connections.exists()
            job_courses = job.jobpostcourse_set.all()
            if job_courses.exists():
                job_dict['courses'] = [
                    {
                        'id': jc.course.id, 
                        'course_name': jc.course.course_name
                    } for jc in job_courses
                ]
                job_dict['course_names_display'] = ", ".join([jc.course.course_name for jc in job_courses])
            else:
                job_dict['courses'] = []
                job_dict['course_names_display'] = "General / All Courses"

            if job.pay_range:
                job_dict['pay_range_details'] = model_to_dict(job.pay_range)

            if job.user:
                job_dict['posted_by'] = serialize_user_full_profile(job.user, request)
            
            jobpost_list.append(job_dict)
        
        return JsonResponse({'success': True, 'jobpost': jobpost_list}, status=200)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def remove_job_post(request):
    try:
        job_post_id = request.POST.get('documentId')

        if not job_post_id:
            return JsonResponse({'success': False, "message": "No ID provided."}, status=422)
        
        try:
            job_post = JobPost.objects.get(id=job_post_id, user=request.user)
        except JobPost.DoesNotExist:
            return JsonResponse({'success': False, "message": "Job post not found."}, status=404)

        if job_post.alumnijob_set.exists():
            return JsonResponse({
                'success': False, 
                'message': "Cannot remove job post. An alumni is already connected or hired for this position."
            }, status=403)

        pay_range = job_post.pay_range
        job_post.delete()
        if pay_range: pay_range.delete()

        return JsonResponse({'success': True, 'message': "Job Post and associated pay details removed." }, status=200)

    except Exception as e:
        return JsonResponse({'success': False, "message": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
@permission_classes([IsAuthenticated])
def save_job_post(request):
    try:
        documentId = request.POST.get('documentId', None)
        location = request.POST.get('location', '').strip()
        location_coordinates = request.POST.get('location_coordinates', '').strip()
        course_ids = request.POST.getlist('course[]')

        if not location or not location_coordinates:
            return JsonResponse({'success': False, 'message': 'Location and coordinates are required.'}, status=400)

        coord_pattern = r"lat:[-?\d.]+\&long:[-?\d.]+"
        if not re.search(coord_pattern, location_coordinates):
             return JsonResponse({'success': False, 'message': 'Invalid coordinate format.'}, status=400)

        if isinstance(course_ids, str): course_ids = json.loads(course_ids)

        currency = request.POST.get('currency')
        from_amount = request.POST.get('from_amount')
        to_amount = request.POST.get('to_amount')
        pay_range = JobPostPayRange.objects.create(
            currency=currency,
            from_amount=int(from_amount) if from_amount else 0,
            to_amount=int(to_amount) if to_amount else 0
        )

        job_data = {
            'user': request.user,
            'pay_range': pay_range,
            'company_name': request.POST.get('company_name'),
            'title': request.POST.get('title'),
            'location': location,
            'location_coordinates': location_coordinates,
            'workplace_option': request.POST.get('workplace_option'),
            'work_type': request.POST.get('work_type'),
            'pay_type': request.POST.get('pay_type'),
            'summary': request.POST.get('summary'),
            'description': request.POST.get('description'),
            'status': request.POST.get('status', 'ACTIVE'),
            'min_general_appearance': int(request.POST.get('min_general_appearance', 0)),
            'min_manner_of_speaking': int(request.POST.get('min_manner_of_speaking', 0)),
            'min_physical_condition': int(request.POST.get('min_physical_condition', 0)),
            'min_mental_alertness': int(request.POST.get('min_mental_alertness', 0)),
            'min_self_confidence': int(request.POST.get('min_self_confidence', 0)),
            'min_ability_to_present_ideas': int(request.POST.get('min_ability_to_present_ideas', 0)),
            'min_communication_skills': int(request.POST.get('min_communication_skills', 0)),
            'min_student_performance_rating': int(request.POST.get('min_student_performance_rating', 0))
        }

        job_obj, created = JobPost.objects.update_or_create(
            id=documentId if documentId and documentId != 'null' else None, 
            defaults=job_data
        )

        JobPostCourse.objects.filter(job=job_obj).delete()

        for c_id in course_ids:
            course_instance = EducationCourse.objects.get(id=c_id)
            JobPostCourse.objects.create(
                job=job_obj, 
                course=course_instance
            )

        Notification.objects.create(
            from_user=request.user,
            to_user=None,
            job=job_obj,
            type=Notification.Type.JOB_POST,
            message=f"You havea new job recommendation from {request.user.get_full_name()}: {job_data['title']}"
        )

        alumni_list = CustomUser.objects.filter(role=CustomUser.Role.ALUMNI)
        broadcast_job_post(alumni_list, job_data, request.user)

        return JsonResponse({'success': True, 'message': 'Job post saved successfully.'}, status=201)

    except EducationCourse.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'One of the selected courses does not exist.'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_specific_job(request, jobId):
    try:
        try:
            job = JobPost.objects.select_related('pay_range', 'user').prefetch_related(
                'jobpostcourse_set__course'
            ).get(id=jobId)
        except JobPost.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Job not found.'}, status=404)

        user_profile = None
        if request.user.is_authenticated:
            user_profile = AlumniScaleProfile.objects.filter(user=request.user).first()

        job_data = serialize_job_post(job=job, user_profile=user_profile, request=request)

        job_courses = job.jobpostcourse_set.all()
        if job_courses.exists():
            job_data['courses'] = [
                {'id': jc.course.id, 'course_name': jc.course.course_name} 
                for jc in job_courses
            ]
            job_data['course_names_display'] = ", ".join([jc.course.course_name for jc in job_courses])
        else:
            job_data['courses'] = []
            job_data['course_names_display'] = "General / All Courses"

        return JsonResponse({'success': True, 'job': job_data}, status=200)

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_candidates(request, jobId):
    try:
        try:
            job = JobPost.objects.get(id=jobId)
            if job.user != request.user:
                return JsonResponse({'success': False, 'message': 'Unauthorized access.'}, status=403)
        except JobPost.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Job not found.'}, status=404)

        applications = AlumniJob.objects.filter(job=job).select_related('user').order_by('-created_at')

        candidates_list = []
        for app in applications:
            candidate_info = serialize_user_full_profile(app.user, request)
            
            scale = candidate_info.get('scale_profile')
            if scale:
                prediction = generate_prediction(profile=candidate_info, id3_model=id3_model)

                candidate_info['ai_prediction'] = prediction['prediction_text']
                candidate_info['is_ai_recommended'] = prediction['is_employable']
            else:
                candidate_info['ai_prediction'] = "No Scale Profile"
                candidate_info['is_ai_recommended'] = False

            candidate_info['application_id'] = app.id
            candidate_info['application_status'] = app.status
            candidate_info['applied_on'] = app.created_at.strftime("%Y-%m-%d %H:%M %p")
            
            resume_obj = AlumniJobResume.objects.filter(user=app).first()
            cover_obj = AlumniJobCoverLetter.objects.filter(user=app).first()
            
            candidate_info['resume_url'] = request.build_absolute_uri(resume_obj.resume.url) if resume_obj else None
            candidate_info['cover_letter_url'] = request.build_absolute_uri(cover_obj.cover_letter.url) if cover_obj else None

            candidates_list.append(candidate_info)

        return JsonResponse({'success': True, 'jobCandidates': candidates_list}, status=200)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def e_report_data(request):
    try:
        employer_jobs = JobPost.objects.filter(user=request.user)
        job_ids = employer_jobs.values_list('id', flat=True)

        total_posts = employer_jobs.count()
        active_posts = employer_jobs.filter(status="ACTIVE").count()
        
        all_applications = AlumniJob.objects.filter(job_id__in=job_ids)
        total_applicants = all_applications.count()
        
        status_breakdown = list(all_applications.values('status').annotate(count=Count('id')))

        total_messages = JobChat.objects.filter(job__job_id__in=job_ids).count()

        top_jobs = employer_jobs.annotate(
            applicant_count=Count('alumnijob')
        ).order_by('-applicant_count')[:5]
        
        top_jobs_data = [
            {
                "title": job.title,
                "applicants": job.applicant_count,
                "status": job.status,
                "created_at": job.created_at.strftime("%Y-%m-%d")
            } for job in top_jobs
        ]

        report_data = {
            "summary": {
                "total_job_posts": total_posts,
                "active_job_posts": active_posts,
                "total_applications_received": total_applicants,
                "total_chat_interactions": total_messages,
                "hiring_rate": f"{(all_applications.filter(status='HIRED').count() / total_applicants * 100):.2f}%" if total_applicants > 0 else "0%"
            },
            "status_distribution": {item['status']: item['count'] for item in status_breakdown},
            "top_performing_posts": top_jobs_data
        }

        return JsonResponse({'success': True, 'reportData': report_data}, status=200)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)