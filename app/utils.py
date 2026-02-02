from django.forms.models import model_to_dict
from django.db.models import Exists, OuterRef
from app.models import AlumniEducationalProfile
from django.db.models.query import QuerySet
import re
import math
from django.core.mail import get_connection, EmailMultiAlternatives
from django.conf import settings

def serialize_user_full_profile(user, request=None, id3_model=None):
    user_data = model_to_dict(user, exclude=['password', 'user_permissions', 'groups'])
    
    if user.profile_picture:
        user_data['profile_picture'] = request.build_absolute_uri(user.profile_picture.url) if request else user.profile_picture.url

    if user.role == "ALUMNI":
        edu_profile = user.alumnieducationalprofile_set.first()
        
        if edu_profile:
            edu_dict = model_to_dict(edu_profile)

            edu_dict['course_details'] = {
                "id": edu_profile.course.id,
                "course_name": edu_profile.course.course_name
            }
            user_data['educational_profile'] = edu_dict
        else:
            user_data['educational_profile'] = None

        user_data['certifications'] = list(user.alumnicertificationsprofile_set.all().values())
        user_data['skills'] = list(user.alumniskillsprofile_set.all().values())
        user_data['languages'] = list(user.alumnilanguagesprofile_set.all().values())
        
        scale_queryset = user.alumniscaleprofile_set.all()
        scale = scale_queryset[0] if scale_queryset.exists() else None

        if scale:
            prediction = generate_prediction(profile=scale, id3_model=id3_model)
            user_data['ai_prediction'] = prediction['prediction_text']
            user_data['is_ai_recommended'] = prediction['is_employable']
            user_data['total_profile_score'] = prediction.get('score_sum', 0)
        else:
            user_data['ai_prediction'] = "No Scale Profile"
            user_data['is_ai_recommended'] = False

        user_data['scale_profile'] = model_to_dict(scale) if scale else None
        user_data['job_history'] = list(user.alumnijob_set.all().values())

    elif user.role == "EMPLOYER":
        business_details = user.employeraccount_set.first()
        if business_details:
            business_dict = model_to_dict(business_details)
            
            def get_file_url(file_field):
                if not file_field:
                    return None
                return request.build_absolute_uri(file_field.url) if request else file_field.url

            business_dict['business_permit'] = get_file_url(business_details.business_permit)
            business_dict['bir_2303'] = get_file_url(business_details.bir_2303)
            business_dict['sec_dti_reg'] = get_file_url(business_details.sec_dti_reg)

            user_data['business_details'] = business_dict
        else:
            user_data['business_details'] = None

    return user_data

def serialize_job_post(job, user_profile=None, request=None, is_bookmarked=False, application_status=None, user_score=0, is_employable=False):
    job_data = model_to_dict(job)
    job_data['created_at'] = job.created_at
    
    if job.pay_range:
        job_data['pay_range_details'] = model_to_dict(job.pay_range)
    
    job_data['posted_by'] = serialize_user_full_profile(job.user, request)
    job_data['is_bookmarked'] = is_bookmarked
    job_data['application_status'] = application_status
    
    job_course_links = job.jobpostcourse_set.all()
    if job_course_links.exists():
        job_data['course_details'] = [model_to_dict(link.course) for link in job_course_links]
        job_data['course_name'] = ", ".join([link.course.course_name for link in job_course_links])
    else:
        job_data['course_details'] = []
        job_data['course_name'] = "General / All Courses"

    if user_profile and user_score > 0:
        job_req_sum = (
            job.min_general_appearance + job.min_manner_of_speaking +
            job.min_physical_condition + job.min_mental_alertness +
            job.min_self_confidence + job.min_ability_to_present_ideas +
            job.min_communication_skills + job.min_student_performance_rating
        )
        
        if job_req_sum > 0:
            match_pct = int(round((user_score / job_req_sum) * 100))
        else:
            match_pct = 100
            
        job_data['match_percentage'] = min(match_pct, 100)
        job_data['is_highly_recommended'] = bool(match_pct >= 75 and is_employable)
    else:
        job_data['match_percentage'] = 0
        job_data['is_highly_recommended'] = False
    
    return job_data

def parse_custom_coords(coord_str):
    if not coord_str or not isinstance(coord_str, str):
        return None, None
    try:
        lat_match = re.search(r'lat:([\d.-]+)', coord_str)
        long_match = re.search(r'long:([\d.-]+)', coord_str)
        
        if lat_match and long_match:
            return float(lat_match.group(1)), float(long_match.group(1))
    except Exception as e:
        print(f"Parsing error: {e}")
    return None, None

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371 
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def serialize_course(courses_queryset):
    checker = AlumniEducationalProfile.objects.filter(course_id=OuterRef('pk'))
    course_list = list(
        courses_queryset.annotate(is_used=Exists(checker)).values('id', 'course_name', 'is_used')
    )
    
    return course_list

def serialize_model_data(data):
    if isinstance(data, QuerySet):
        return [serialize_single_instance(obj) for obj in data]
    return serialize_single_instance(data)

def serialize_single_instance(obj):
    item = model_to_dict(obj)

    if hasattr(obj, 'created_at'):
        item['created_at'] = obj.created_at.isoformat() if obj.created_at else None
    
    for field in obj._meta.fields:
        field_name = field.name
        if hasattr(obj, field_name):
            field_val = getattr(obj, field_name)
            if hasattr(field_val, 'url'):
                item[field_name] = field_val.url if field_val else None
                
    return item

def serialize_announcement(announcement, request=None):
    data = {
        "id": announcement.id,
        "title": announcement.title,
        "content": announcement.content,
        "created_at": announcement.created_at if announcement.created_at else None,
        "can_message": announcement.can_message,
        "author": serialize_user_full_profile(announcement.user, request)
    }

    if announcement.attachment:
        data['attachment'] = request.build_absolute_uri(announcement.attachment.url) if request else announcement.attachment.url
        
        file_url = announcement.attachment.url.lower()
        if file_url.endswith(('.mp4', '.webm', '.ogg', '.mov')):
            data['attachment_type'] = 'video'
        else:
            data['attachment_type'] = 'image'
    else:
        data['attachment'] = None
        data['attachment_type'] = None

    return data

def serialize_job_chat(chat, request=None):
    chat_data = model_to_dict(chat)
    chat_data['created_at'] = chat.created_at.isoformat()
    chat_data['from_sender'] = serialize_user_full_profile(chat.from_sender, request)
    chat_data['to_sender'] = serialize_user_full_profile(chat.to_sender, request)
    return chat_data

def serialize_notifications(notification, request=None):
    notification_data = model_to_dict(notification)
    notification_data['created_at'] = notification.created_at.isoformat()
    notification_data['from_user'] = serialize_user_full_profile(notification.from_user, request) if notification.from_user else None
    notification_data['to_user'] = serialize_user_full_profile(notification.to_user, request) if notification.to_user else None
    
    return notification_data

def generate_prediction(profile, id3_model):
    if not profile:
        return {'is_employable': False, 'prediction_text': "No Scale Profile"}

    def get_val(attr):
        if isinstance(profile, dict):
            if attr in profile:
                return profile.get(attr, 0)
            scale = profile.get('scale_profile', {})
            if isinstance(scale, dict):
                return scale.get(attr, 0)
            return 0
        return getattr(profile, attr, 0)

    try:
        features = [
            int(get_val('general_appearance') or 0),
            int(get_val('manner_of_speaking') or 0),
            int(get_val('physical_condition') or 0),
            int(get_val('mental_alertness') or 0),
            int(get_val('self_confidence') or 0),
            int(get_val('ability_to_present_ideas') or 0),
            int(get_val('communication_skills') or 0),
            int(get_val('student_performance_rating') or 0)
        ]
    except (ValueError, TypeError):
        return {'is_employable': False, 'prediction_text': "Invalid Data"}
    
    total_score = sum(features)

    if total_score >= 32:
        return {
            'is_employable': True,
            'prediction_text': "Employable",
            'score_sum': total_score
        }
    
    if total_score <= 25:
        return {
            'is_employable': False,
            'prediction_text': "Less Employable",
            'score_sum': total_score
        }

    raw_prediction = id3_model.predict([features])[0]
    is_employable = bool(str(raw_prediction) == "1" or raw_prediction == 1)

    return {
        'is_employable': is_employable,
        'prediction_text': "Employable" if is_employable else "Less Employable",
        'score_sum': int(total_score)
    }

def broadcast_job_post(alumni_queryset, job_data, sender):
    job_title = job_data.get('title', 'New Position')
    job_id = job_data.get('id', '')
    sender_name = sender.get_full_name() or sender.username
    
    base_url = getattr(settings, 'EMAIL_REDIRECT', "http://localhost:3000")
    job_link = f"{base_url}/jobs/{job_id}"
    connection = get_connection()
    messages = []

    for alumnus in alumni_queryset:
        greeting = f"Hi {alumnus.first_name if alumnus.first_name else 'Alumnus'},"
        subject = f"New Job Alert: {job_title}"
        
        text_body = (
            f"{greeting}\n\n{sender_name} has posted a new job: {job_title}.\n"
            f"View details here: {job_link}\n\nBest regards,\nCareer Team"
        )

        html_body = f"""
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2>{greeting}</h2>
                <p><strong>{sender_name}</strong> has just posted a new job opening: <strong>{job_title}</strong>.</p>
                <p>Click the button below to view the details and apply:</p>
                <div style="margin: 20px 0;">
                    <a href="{job_link}" 
                        style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        View Job Posting
                    </a>
                </div>
                <p>Or copy this link: <a href="{job_link}">{job_link}</a></p>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
                <p style="font-size: 0.8em; color: #777;">Best regards,<br>Career Support Team</p>
            </div>
        """

        email = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.EMAIL_HOST_USER,
            to=[alumnus.email],
            connection=connection
        )
        email.attach_alternative(html_body, "text/html")
        messages.append(email)

    if messages:
        return connection.send_messages(messages)
    return 0