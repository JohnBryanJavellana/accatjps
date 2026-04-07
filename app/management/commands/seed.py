import random
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from app.models import EducationCourse, CustomUser, AlumniEducationalProfile
from faker import Faker

class Command(BaseCommand):
    help = "Seeds the database with courses and 10 fake alumni accounts"

    def handle(self, *args, **options):
        fake = Faker()
        
        # --- Seed Education Courses ---
        self.stdout.write("Seeding Education Courses...")
        courses_data = [
            ("BSIT", "Bachelor of Science in Information Technology"),
            ("BSCS", "Bachelor of Science in Computer Science"),
            ("BSIS", "Bachelor of Science in Information Systems"),
            ("BSCE", "Bachelor of Science in Civil Engineering"),
            ("BSME", "Bachelor of Science in Mechanical Engineering"),
            ("BSEE", "Bachelor of Science in Electrical Engineering"),
            ("BSArch", "Bachelor of Science in Architecture"),
            ("BSN", "Bachelor of Science in Nursing"),
            ("BSBA", "Bachelor of Science in Business Administration"),
            ("BSA", "Bachelor of Science in Accountancy"),
            ("BSSW", "Bachelor of Science in Social Work"),
            ("BEED", "Bachelor of Elementary Education"),
            ("BSED", "Bachelor of Secondary Education"),
            ("BSHM", "Bachelor of Science in Hospitality Management"),
            ("BSTM", "Bachelor of Science in Tourism Management"),
            ("BSBio", "Bachelor of Science in Biology"),
            ("BA Comm", "Bachelor of Arts in Communication"),
            ("AB Psych", "Bachelor of Arts in Psychology"),
        ]

        course_objects = []
        course_count = 0
        for abbr, full_name in courses_data:
            name_to_save = f"{full_name} ({abbr})"
            obj, created = EducationCourse.objects.get_or_create(
                course_name=name_to_save
            )
            course_objects.append(obj)
            if created:
                course_count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {course_count} courses!"))

        # --- Seed Alumni Accounts ---
        self.stdout.write("Seeding 10 Alumni Accounts...")
        
        achievements_pool = [
            "Cum Laude", "Magna Cum Laude", "Dean's Lister", 
            "Student Council President", "Best in Capstone Project",
            "Academic Excellence Awardee", "Leadership Award", 
            "Research of the Year", "Varsity Captain"
        ]

        password = make_password("Password#2026")
        alumni_count = 0

        for _ in range(10):
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = fake.unique.email()
            
            # Create User
            user = CustomUser.objects.create(
                first_name=first_name,
                last_name=last_name,
                middle_name=fake.last_name(),
                suffix=random.choice(["", "Jr.", "III"]),
                role=CustomUser.Role.ALUMNI,
                username=email,
                email=email,
                contact_number=None,
                password=password,
                is_active=True
            )

            # Create Profile
            AlumniEducationalProfile.objects.create(
                user=user,
                course=random.choice(course_objects),
                course_highlights=random.choice(achievements_pool),
                year_graduated=random.randint(2015, 2025)
            )
            alumni_count += 1
            self.stdout.write(f"Created Alumni: {first_name} {last_name}")

        self.stdout.write(
            self.style.SUCCESS(f"Successfully seeded {alumni_count} alumni accounts!")
        )