import random
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from app.models import EducationCourse, AlumniMasterlistReference, AlumniEducationalProfile
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

        # SEED ALUMNI DUMMY ACCOUNTS TO ALUMNI MASTERLIST
        self.stdout.write("Seeding 10 Alumni Accounts to Alumni Masterlist Table...")
        alumni_count = 0

        for _ in range(10):
            first_name = fake.first_name()
            last_name = fake.last_name()
            birthday = fake.date_of_birth(minimum_age=20, maximum_age=60)
            
            # Create User
            AlumniMasterlistReference.objects.create(
                first_name=first_name,
                middle_name=fake.last_name(),
                last_name=last_name,
                suffix=random.choice(["", "Jr.", "III"]),
                birthday=birthday,
                course=random.choice(course_objects),
                year_graduated=random.randint(2015, 2025)
            )

            alumni_count += 1
            self.stdout.write(f"Created Alumni: {first_name} {last_name}")

        self.stdout.write(
            self.style.SUCCESS(f"Successfully seeded {alumni_count} alumni accounts!")
        )