from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        ADMINISTRATOR = "ADMINISTRATOR"
        ALUMNI = "ALUMNI"
        EMPLOYER = "EMPLOYER"

    class Gender(models.TextChoices):
        MALE = "MALE"
        FEMALE = "FEMALE"

    class AccountStatus(models.TextChoices):
        ACTIVATED = "ACTIVATED"
        VERIFICATION = "VERIFICATION"
        DECLINED = "DECLINED"
        ON_HOLD = "ON-HOLD"

    middle_name = models.CharField(max_length=150, blank=True)
    suffix = models.CharField(max_length=10, blank=True, null=True)
    contact_number = models.CharField(max_length=15, null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    gender = models.CharField(blank=True, null=True, choices=Gender)
    birthday = models.DateField(blank=True, null=True)
    address = models.TextField(null=True, blank=True)
    address_coordinates = models.TextField(null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to = 'static/user-profile-picture/', 
        null = True, 
        blank = True, 
        default = "/static/user-profile-picture/default-profile-avatar.png"
    )
    role = models.CharField(max_length=50, default=Role.ADMINISTRATOR, choices=Role.choices)  
    account_status = models.CharField(max_length=50, default=AccountStatus.VERIFICATION, choices=AccountStatus.choices)  
    declined_remarks = models.TextField(null=True, blank=True) 

class Announcement(models.Model):
    class Status(models.TextChoices):
        CAN_MESSAGE = "1"
        CANNOT_MESSAGE = "0"

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=250)
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to = 'static/announcement/', null=True, blank=True)
    can_message = models.CharField(max_length=50, default=Status.CANNOT_MESSAGE, choices=Status.choices)  

class AnnouncementMessage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class EducationCourse(models.Model):
    course_name = models.CharField(max_length=255)

class EmployerAccount(models.Model):
    class Type(models.TextChoices):
        GOVERNMENT = "GOVERNMENT"
        PRIVATE = "PRIVATE"
        NGO = "NON-GOVERNMENTAL ORGANIZATION"
        FREELANCE = "FREELANCE"

    class DocStatus(models.TextChoices):
        VERIFICATION = "VERIFICATION"
        REJECTED = "REJECTED"
        VERIFIED = "VERIFIED"

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=250)
    country = models.CharField(max_length=250)
    business_type = models.CharField(max_length=50, choices=Type.choices) 

    business_permit = models.FileField(upload_to = 'static/supporting-document/')
    business_permit_remarks = models.TextField(blank=True, null=True)
    business_permit_status = models.CharField(max_length=50, default=DocStatus.VERIFICATION, choices=DocStatus.choices) 

    bir_2303 = models.FileField(upload_to = 'static/supporting-document/')
    bir_2303_status = models.CharField(max_length=50, default=DocStatus.VERIFICATION, choices=DocStatus.choices) 
    bir_2303_remarks = models.TextField(blank=True, null=True)

    sec_dti_reg = models.FileField(upload_to = 'static/supporting-document/')
    sec_dti_reg_status = models.CharField(max_length=50, default=DocStatus.VERIFICATION, choices=DocStatus.choices) 
    sec_dti_reg_remarks = models.TextField(blank=True, null=True)

class EmployerContact(models.Model):
    user = models.ForeignKey(EmployerAccount, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=250)

class AlumniEducationalProfile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(EducationCourse, on_delete=models.CASCADE)
    course_highlights = models.TextField()
    year_graduated = models.IntegerField()

class AlumniCertificationsProfile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    certificate = models.TextField()
    certificate_description = models.TextField()
    expiry_date = models.DateField()

class AlumniSkillsProfile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    skill = models.TextField()

class AlumniLanguagesProfile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    language = models.TextField()

class AlumniScaleProfile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    general_appearance = models.IntegerField()
    manner_of_speaking = models.IntegerField()
    physical_condition = models.IntegerField()
    mental_alertness = models.IntegerField()
    self_confidence = models.IntegerField()
    ability_to_present_ideas = models.IntegerField()
    communication_skills = models.IntegerField()
    student_performance_rating = models.IntegerField()

class JobPostPayRange(models.Model):
    currency = models.CharField(max_length=100)
    from_amount = models.IntegerField()
    to_amount = models.IntegerField()

class JobPost(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE"
        INACTIVE = "INACTIVE"
        DRAFT = "DRAFT"

    class WorkPlaceOption(models.TextChoices):
        ON_SITE = "ON-SITE"
        HYBRID = "HYBRID"
        REMOTE = "REMOTE"

    class WorkType(models.TextChoices):
        FULL_TIME = "FULL-TIME"
        PART_TIME = "PART-TIME"
        CONTRACT = "CONTRACT"
        CASUAL = "CASUAL"

    class PayType(models.TextChoices):
        HOURLY = "HOURLY"
        MONTHLY = "MONTHLY"
        ANNUALLY = "ANNUALLY"

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    pay_range = models.ForeignKey(JobPostPayRange, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    location = models.TextField()
    location_coordinates = models.TextField()
    workplace_option = models.CharField(max_length=255, default=WorkPlaceOption.ON_SITE, choices=WorkPlaceOption.choices)
    work_type = models.CharField(max_length=255, default=WorkType.FULL_TIME, choices=WorkType.choices)
    pay_type = models.CharField(max_length=255, default=PayType.HOURLY, choices=PayType.choices)
    summary = models.TextField()
    description = models.TextField()
    min_general_appearance = models.IntegerField()
    min_manner_of_speaking = models.IntegerField()
    min_physical_condition = models.IntegerField()
    min_mental_alertness = models.IntegerField()
    min_self_confidence = models.IntegerField()
    min_ability_to_present_ideas = models.IntegerField()
    min_communication_skills = models.IntegerField()
    min_student_performance_rating = models.IntegerField()
    status = models.CharField(max_length=255, default=Status.ACTIVE, choices=Status.choices)
    created_at = models.DateTimeField(auto_now_add=True)

class JobPostCourse(models.Model):
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE)
    course = models.ForeignKey(EducationCourse, on_delete=models.CASCADE)

class AlumniJob(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING"
        IN_REVIEW = "IN REVIEW"
        INTERVIEW = "INTERVIEW"
        WITHDRAWN = "WITHDRAWN"
        REJECTED = "REJECTED"
        HIRED = "HIRED"
        FINISHED = "FINISHED"

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=255, default=Status.PENDING, choices=Status.choices)
    remarks = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class JobChat(models.Model):
    job = models.ForeignKey(AlumniJob, on_delete=models.CASCADE)
    from_sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sent_messages")
    to_sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="received_messages")
    message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class AlumniJobResume(models.Model):
    user = models.ForeignKey(AlumniJob, on_delete=models.CASCADE)
    resume = models.FileField(upload_to = 'static/resume/')

class AlumniJobCoverLetter(models.Model):
    user = models.ForeignKey(AlumniJob, on_delete=models.CASCADE)
    cover_letter = models.FileField(upload_to = 'static/cover-letter/')

class AlumniJobArchive(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE)

class History(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    class Type(models.TextChoices):
        CHAT = 'CHAT',
        JOB_POST = 'JOB_POST'

    from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="from_user", null=True, blank=True)
    to_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="to_user", null=True, blank=True)
    type = models.CharField(max_length=255, default=Type.CHAT, choices=Type.choices)
    message = models.TextField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
