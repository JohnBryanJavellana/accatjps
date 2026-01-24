from django.core.management.base import BaseCommand
from app.models import EducationCourse

class Command(BaseCommand):
    help = "Seeds the database with courses offered in Tacloban City"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Education Courses...")

        courses = [
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

        count = 0
        for abbr, full_name in courses:
            name_to_save = f"{full_name} ({abbr})"
            
            obj, created = EducationCourse.objects.get_or_create(
                course_name=name_to_save
            )
            
            if created:
                count += 1
                self.stdout.write(f"Added: {name_to_save}")

        self.stdout.write(
            self.style.SUCCESS(f"Successfully seeded {count} courses!")
        )