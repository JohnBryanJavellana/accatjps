"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path

from app.views.guest_views import *
from app.views.authenticated_views import *
from app.views.job_seeker_views import *
from app.views.employer_views import *
from app.views.administrator_views import *

urlpatterns = [
    path('api/get-announcements', get_announcements_outside, name='get_announcements_outside'),
    path('api/login-user', login_user, name='login_user'),
    path('api/register-user', register_user, name='register_user'),
    path('api/verify-email/<str:uidb64>/<str:token>/', verify_email, name='verify_email'),
    path('api/password-reset', request_password_reset, name='api_password_reset'),
    path('api/password-reset-confirm/<str:uidb64>/<str:token>/', confirm_password_reset, name='api_password_reset_confirm'),

    path('api/authenticated/get-courses/', get_courses, name='get_courses'),
    path('api/authenticated/get-job-chats', get_job_chats, name='get_job_chats'),
    path('api/authenticated/submit-job-chat', submit_job_chat, name='submit_job_chat'),
    path('api/authenticated/get-current-user/', get_current_user, name='get_current_user'),
    path('api/authenticated/logout', logout_user, name='logout_user'),
    path('api/authenticated/update-user-profile-info', update_user_profile_info, name='update_user_profile_info'),
    path('api/authenticated/update-profile-picture', update_profile_picture, name='update_profile_picture'),
    path('api/authenticated/update-password', update_password, name='update_password'),
    path('api/authenticated/application/update-status', update_application_status, name='update_application_status'),

    path('api/authenticated/job-seeker/report/', al_report_data, name='al_report_data'),
    path('api/authenticated/job-seeker/announcement/submit-comment', submit_comment, name='submit_comment'),
    path('api/authenticated/job-seeker/announcement/get-announcements', get_announcement_messages, name='get_announcement_messages'),
    path('api/authenticated/job-seeker/get-applicable-jobs', get_applicable_jobs, name='get_applicable_jobs'),
    path('api/authenticated/job-seeker/get-applied-jobs/', get_applied_jobs, name='get_applied_jobs'),
    path('api/authenticated/job-seeker/get-saved-jobs/', get_saved_jobs, name='get_saved_jobs'),
    path('api/authenticated/job-seeker/get-applicable-jobs/save-job-post', bookmark_job_post, name='bookmark_job_post'),
    path('api/authenticated/job-seeker/get-applicable-jobs/apply-job', apply_job, name='apply_job'),
    path('api/authenticated/job-seeker/manage-account/create-or-update-license-and-certification', create_or_update_lc, name='create_or_update_lc'),
    path('api/authenticated/job-seeker/manage-account/create-or-update-education', create_or_update_education, name='create_or_update_education'),
    path('api/authenticated/job-seeker/manage-account/update-personal-scale', create_or_update_personal_scale, name='create_or_update_personal_scale'),
    path('api/authenticated/job-seeker/manage-account/new-language', new_language, name='new_language'),
    path('api/authenticated/job-seeker/manage-account/new-skill', new_skill, name='new_skill'),
    path('api/authenticated/job-seeker/manage-account/remove-skill', remove_skill, name='remove_skill'),
    path('api/authenticated/job-seeker/manage-account/remove-language', remove_language, name='remove_language'),
    path('api/authenticated/job-seeker/manage-account/remove-license-and-certification', remove_lc, name='remove_lc'),

    path('api/authenticated/employer/report/', e_report_data, name='e_report_data'),
    path('api/authenticated/employer/jobs', get_job_ads, name='get_job_ads'),
    path('api/authenticated/employer/jobs/<int:jobId>', get_specific_job, name='get_specific_job'),
    path('api/authenticated/employer/jobs/<int:jobId>/get-candidates', get_candidates, name='get_candidates'),
    path('api/authenticated/employer/jobs/remove', remove_job_post, name='remove_job_post'),
    path('api/authenticated/employer/jobs/create', save_job_post, name='save_job_post'),
    path('api/authenticated/employer/manage-account/create-or-update-business-details', create_or_update_business, name='create_or_update_business'),
    path('api/authenticated/employer/manage-account/update-doc-file', update_doc_file, name='update_doc_file'),

    path('api/authenticated/administrator/dashboard/', dashboard_data, name='dashboard_data'),
    path('api/authenticated/administrator/user-management/get-users/', get_users, name='get_users'),
    path('api/authenticated/administrator/user-management/update-doc-status', update_document_status, name='update_document_status'),
    path('api/authenticated/administrator/user-management/account-activation', account_activation, name='account_activation'),
    path('api/authenticated/administrator/system-settings/create-or-update-course', create_or_update_course, name='create_or_update_course'),
    path('api/authenticated/administrator/system-settings/remove-course', remove_course, name='remove_course'),
    path('api/authenticated/administrator/announcement/get-announcements/', get_announcements, name='get_announcements'),
    path('api/authenticated/administrator/announcement/create-or-update-announcement', create_or_update_announcement, name='create_or_update_announcement'),
    path('api/authenticated/administrator/announcement/remove-announcement', remove_announcement, name='remove_announcement'),
]
