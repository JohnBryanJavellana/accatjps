from django.forms.models import model_to_dict
from django.db.models import Exists, OuterRef
from app.models import AlumniEducationalProfile
from django.db.models.query import QuerySet
import re
import math

def serialize_user_full_profile(user, request=None):
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
        
        scale = user.alumniscaleprofile_set.all()[0] if user.alumniscaleprofile_set.all() else None
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

def serialize_job_post(job, user_profile=None, request=None, is_bookmarked=False, application_status=None):
    job_data = model_to_dict(job)
    job_data['created_at'] = job.created_at.strftime("%Y-%m-%d %H:%M:%S")
    
    if job.pay_range:
        job_data['pay_range_details'] = model_to_dict(job.pay_range)
    
    job_data['posted_by'] = serialize_user_full_profile(job.user, request)
    job_data['is_bookmarked'] = is_bookmarked
    job_data['application_status'] = application_status
    
    job_course_links = job.jobpostcourse_set.all()
    
    if job_course_links.exists():
        job_data['course_details'] = [
            model_to_dict(link.course) for link in job_course_links
        ]
        job_data['course_name'] = ", ".join([link.course.course_name for link in job_course_links])
    else:
        job_data['course_details'] = []
        job_data['course_name'] = "General / All Courses"

    if user_profile:
        user_score = (
            user_profile.general_appearance + user_profile.manner_of_speaking +
            user_profile.physical_condition + user_profile.mental_alertness +
            user_profile.self_confidence + user_profile.ability_to_present_ideas +
            user_profile.communication_skills + user_profile.student_performance_rating
        )
        job_min = (
            job.min_general_appearance + job.min_manner_of_speaking +
            job.min_physical_condition + job.min_mental_alertness +
            job.min_self_confidence + job.min_ability_to_present_ideas +
            job.min_communication_skills + job.min_student_performance_rating
        )
        if user_score > 0:
            match_pct = int(round((job_min / user_score) * 100))
        else:
            match_pct = 0
            
        job_data['match_percentage'] = min(match_pct, 100)
        job_data['is_highly_recommended'] = match_pct >= 75
    
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

def serialize_announcement(announcement):
    return {
        "id": announcement.id,
        "title": announcement.title,
        "content": announcement.content,
        "created_at": announcement.created_at,
        "can_message": announcement.can_message,
        "author": serialize_user_full_profile(announcement.user)
    }

def serialize_job_chat(chat, request=None):
    chat_data = model_to_dict(chat)
    chat_data['created_at'] = chat.created_at.isoformat()
    chat_data['from_sender'] = serialize_user_full_profile(chat.from_sender, request)
    chat_data['to_sender'] = serialize_user_full_profile(chat.to_sender, request)
    return chat_data