import os
from django.core.management.base import BaseCommand
from django.core.files import File as DjangoFile
from django.core.files.storage import default_storage
from django.conf import settings
from django_scopes import scopes_disabled
from cookbook.models import Recipe, Keyword
from tqdm import tqdm


class Command(BaseCommand):
    help = 'Migrate local mediafiles to S3 storage'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be migrated without actually doing it',
        )
        parser.add_argument(
            '--model',
            type=str,
            default='all',
            choices=['all', 'recipe', 'keyword'],
            help='Which model to migrate (default: all)',
        )

    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        model_type = options.get('model', 'all')

        # Check if S3 is configured
        if not hasattr(settings, 'AWS_ACCESS_KEY_ID') or not settings.AWS_ACCESS_KEY_ID:
            self.stdout.write(self.style.ERROR('S3 is not configured. Please set S3_ACCESS_KEY and related environment variables.'))
            return

        self.stdout.write(f"{'[DRY RUN] ' if dry_run else ''}Starting migration to S3...")

        with scopes_disabled():
            total_files = 0
            total_size = 0

            if model_type in ['all', 'recipe']:
                recipe_files, recipe_size = self.migrate_recipes(dry_run)
                total_files += recipe_files
                total_size += recipe_size

            if model_type in ['all', 'keyword']:
                keyword_files, keyword_size = self.migrate_keywords(dry_run)
                total_files += keyword_files
                total_size += keyword_size

            self.stdout.write(self.style.SUCCESS(
                f"\n{'[DRY RUN] ' if dry_run else ''}Migration complete!")
            )
            self.stdout.write(f"  Total files: {total_files}")
            self.stdout.write(f"  Total size: {self.format_size(total_size)}")

            if dry_run:
                self.stdout.write(self.style.WARNING("\nThis was a dry run. Run without --dry-run to actually migrate."))

    def migrate_recipes(self, dry_run):
        """Migrate recipe images"""
        self.stdout.write("\nMigrating Recipe images...")

        # Get all recipes with local images
        recipes = Recipe.objects.exclude(image__exact='').exclude(image__isnull=True)

        files_count = 0
        total_size = 0

        for recipe in tqdm(recipes, desc="Recipes"):
            if not recipe.image or not recipe.image.name:
                continue

            # Check if file exists in local storage
            local_path = os.path.join(settings.MEDIA_ROOT, recipe.image.name)

            if os.path.exists(local_path):
                file_size = os.path.getsize(local_path)
                total_size += file_size

                if dry_run:
                    files_count += 1
                    continue

                # Read the file
                with open(local_path, 'rb') as f:
                    file_content = f.read()

                # Upload to S3
                filename = os.path.basename(recipe.image.name)
                recipe.image.save(filename, DjangoFile(file_content, name=filename), save=True)
                files_count += 1

                # Optional: Delete local file after successful upload
                # os.remove(local_path)

        self.stdout.write(f"  Recipe images: {files_count}")
        self.stdout.write(f"  Size: {self.format_size(total_size)}")

        return files_count, total_size

    def migrate_keywords(self, dry_run):
        """Migrate keyword images"""
        self.stdout.write("\nMigrating Keyword images...")

        # Get all keywords with local images
        keywords = Keyword.objects.exclude(image__exact='').exclude(image__isnull=True)

        files_count = 0
        total_size = 0

        for keyword in tqdm(keywords, desc="Keywords"):
            if not keyword.image or not keyword.image.name:
                continue

            # Check if file exists in local storage
            local_path = os.path.join(settings.MEDIA_ROOT, keyword.image.name)

            if os.path.exists(local_path):
                file_size = os.path.getsize(local_path)
                total_size += file_size

                if dry_run:
                    files_count += 1
                    continue

                # Read the file
                with open(local_path, 'rb') as f:
                    file_content = f.read()

                # Upload to S3
                filename = os.path.basename(keyword.image.name)
                keyword.image.save(filename, DjangoFile(file_content, name=filename), save=True)
                files_count += 1

                # Optional: Delete local file after successful upload
                # os.remove(local_path)

        self.stdout.write(f"  Keyword images: {files_count}")
        self.stdout.write(f"  Size: {self.format_size(total_size)}")

        return files_count, total_size

    def format_size(self, size_bytes):
        """Format bytes to human readable size"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.2f} TB"
