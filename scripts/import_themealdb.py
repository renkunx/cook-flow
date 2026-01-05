#!/usr/bin/env python3
"""
TheMealDB Recipe Importer for Tandoor Recipes

This script fetches recipes from TheMealDB API and imports them into Tandoor Recipes.

Usage:
    python scripts/import_themealdb.py --count 10
    python scripts/import_themealdb.py --category Seafood
    python scripts/import_themealdb.py --random
"""

import argparse
import json
import os
import sys
import tempfile
import requests
from typing import List, Dict, Optional
from urllib.parse import urlparse
from PIL import Image as PILImage
from io import BytesIO

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recipes.settings')

import django
django.setup()

from django.contrib.auth.models import User
from django_scopes import scope, scopes_disabled
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files import File as DjangoFile
from cookbook.models import Recipe, Step, Ingredient, Food, Unit, Keyword, Space
from cookbook.helper.image_processing import handle_image
import uuid
from io import BytesIO


# TheMealDB API endpoints
THEMEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1"


class TheMealDBImporter:
    """Importer for TheMealDB recipes to Tandoor Recipes"""

    def __init__(self, space: Space, user: User):
        self.space = space
        self.user = user
        self.session = requests.Session()
        self.imported_images = set()  # Track imported images to avoid duplicates

    def fetch_all_categories(self) -> List[str]:
        """Fetch all available categories from TheMealDB"""
        response = self.session.get(f"{THEMEALDB_BASE_URL}/categories.php")
        response.raise_for_status()
        data = response.json()

        if data.get('categories'):
            return [cat['strCategory'] for cat in data['categories']]
        return []

    def download_image(self, image_url: str) -> Optional[bytes]:
        """Download image from URL and return processed image data"""
        if not image_url or image_url in self.imported_images:
            return None

        try:
            # Download image
            response = self.session.get(image_url, timeout=30)
            response.raise_for_status()

            # Determine filetype (TheMealDB typically uses jpg)
            ext = '.jpg'

            # Create a request-like object for handle_image
            class FakeRequest:
                def __init__(self, user, space):
                    self.user = user
                    self.space = space

            fake_request = FakeRequest(self.user, self.space)

            # Create file object
            image_file = DjangoFile(BytesIO(response.content), name='image.jpg')

            # Process image using handle_image
            processed_image = handle_image(fake_request, image_file, ext)

            if processed_image:
                self.imported_images.add(image_url)
                print(f"    Downloaded and processed image")
                return processed_image

        except Exception as e:
            print(f"    Warning: Failed to download image: {e}")
            return None

    def fetch_meals_by_category(self, category: str) -> List[Dict]:
        """Fetch all meals in a category"""
        response = self.session.get(f"{THEMEALDB_BASE_URL}/filter.php", params={'c': category})
        response.raise_for_status()
        data = response.json()

        return data.get('meals', [])

    def fetch_meal_details(self, meal_id: str) -> Optional[Dict]:
        """Fetch full details for a specific meal"""
        response = self.session.get(f"{THEMEALDB_BASE_URL}/lookup.php", params={'i': meal_id})
        response.raise_for_status()
        data = response.json()

        meals = data.get('meals', [])
        if meals:
            return meals[0]
        return None

    def create_or_get_food(self, name: str) -> Food:
        """Get or create a Food item"""
        name = name.strip()

        # Check if already exists with exact or case-insensitive match
        try:
            food = Food.objects.get(name__iexact=name, space=self.space)
            return food
        except Food.DoesNotExist:
            pass

        # Create new food (NOTE: Food doesn't have created_by field)
        food = Food.objects.create(
            space=self.space,
            name=name,
            plural_name=name + 's' if not name.endswith('s') else name
        )
        return food

    def create_or_get_unit(self, name: str) -> Unit:
        """Get or create a Unit"""
        name = name.strip()

        # Check if already exists with exact or case-insensitive match
        try:
            unit = Unit.objects.get(name__iexact=name, space=self.space)
            return unit
        except Unit.DoesNotExist:
            pass

        # Create new unit (NOTE: Unit doesn't have created_by field)
        unit = Unit.objects.create(
            space=self.space,
            name=name,
            plural_name=name + 's' if not name.endswith('s') else name
        )
        return unit

    def parse_ingredient(self, ingredient_str: str, measure_str: str) -> tuple:
        """
        Parse ingredient and measure strings into (amount, food, unit)

        Examples:
        - "1 cup", "Rice" -> (1, "Rice", "cup")
        - "2 tbsp", "Olive Oil" -> (2, "Olive Oil", "tbsp")
        - "", "Salt" -> (None, "Salt", None)
        """
        # Clean up the strings
        ingredient_str = ingredient_str.strip()
        measure_str = measure_str.strip()

        if not measure_str:
            return None, ingredient_str, None

        # Try to extract amount and unit from measure
        parts = measure_str.split()
        if not parts:
            return None, ingredient_str, None

        # First part might be a number
        amount = None
        unit = None

        try:
            amount = float(parts[0])
            remaining = ' '.join(parts[1:])
        except ValueError:
            remaining = measure_str

        # The rest is the unit
        if remaining:
            unit = remaining

        return amount, ingredient_str, unit

    def create_recipe_from_meal(self, meal: Dict, replace: bool = False) -> Recipe:
        """Create a Tandoor Recipe from TheMealDB meal data

        Args:
            meal: TheMealDB meal data
            replace: If True, replace existing recipe; if False, skip it
        """

        # Check if recipe already exists
        existing = Recipe.objects.filter(space=self.space, name=meal.get('strMeal')).first()
        if existing:
            if replace:
                print(f"  Recipe '{meal.get('strMeal')}' exists, replacing...")
                # Delete existing recipe and its related objects
                existing.delete()
            else:
                print(f"  Recipe '{meal.get('strMeal')}' already exists, skipping...")
                return existing

        # Create the recipe
        recipe = Recipe.objects.create(
            space=self.space,
            created_by=self.user,
            name=meal.get('strMeal', 'Unknown Recipe'),
            description=meal.get('strCategory', ''),
            source_url=meal.get('strSource') or meal.get('strYoutube'),
            servings=1,
            servings_text="1 serving",
            working_time=30,  # TheMealDB doesn't provide time, default 30 min
            waiting_time=0,
            internal=True,
        )

        # Download and add image if available
        image_url = meal.get('strMealThumb')
        if image_url:
            print(f"    Downloading image...")
            image_data = self.download_image(image_url)
            if image_data:
                try:
                    # Save image to recipe
                    recipe.image.save(f'{uuid.uuid4()}_{recipe.pk}.jpg', DjangoFile(image_data))
                    recipe.save()
                except Exception as e:
                    print(f"    Warning: Failed to save image to recipe: {e}")

        # Add keywords (NOTE: Keyword doesn't have created_by field)
        category = meal.get('strCategory')
        if category:
            keyword, created = Keyword.objects.get_or_create(
                name=category,
                space=self.space,
                defaults={'description': f'Category: {category}'}
            )
            recipe.keywords.add(keyword)

        area = meal.get('strArea')
        if area:
            keyword, created = Keyword.objects.get_or_create(
                name=area,
                space=self.space,
                defaults={'description': f'Cuisine: {area}'}
            )
            recipe.keywords.add(keyword)

        # Create step with instructions
        instructions = meal.get('strInstructions', '')
        if instructions:
            # Clean up instructions
            instructions = instructions.replace('\r\n', '\n').replace('\r', '\n')

            step = Step.objects.create(
                space=self.space,
                name='Instructions',
                instruction=instructions,
                order=1
            )
            recipe.steps.add(step)

        # Add ingredients
        ingredients = []
        for i in range(1, 21):  # TheMealDB has up to 20 ingredients
            ingredient_key = f'strIngredient{i}'
            measure_key = f'strMeasure{i}'

            ingredient_name = meal.get(ingredient_key, '').strip()
            measure = meal.get(measure_key, '').strip()

            if not ingredient_name:
                continue

            amount, food_name, unit_name = self.parse_ingredient(ingredient_name, measure)

            food = self.create_or_get_food(food_name)
            unit = self.create_or_get_unit(unit_name) if unit_name else None

            ingredient = Ingredient.objects.create(
                space=self.space,
                food=food,
                unit=unit,
                amount=amount or 1,
                note=measure if not amount and measure else '',
                original_text=f"{measure} {ingredient_name}".strip()
            )
            ingredients.append(ingredient)

        # Add ingredients to step
        if recipe.steps.exists():
            step = recipe.steps.first()
            for ingredient in ingredients:
                ingredient.step = step
                ingredient.save()

        print(f"  Created recipe: {recipe.name}")
        return recipe

    def import_by_category(self, category: str, limit: Optional[int] = None, replace: bool = False) -> int:
        """Import recipes from a specific category

        Args:
            category: Category name from TheMealDB
            limit: Maximum number of recipes to import
            replace: If True, replace existing recipes; if False, skip them
        """
        print(f"\nImporting recipes from category: {category}")

        meals = self.fetch_meals_by_category(category)
        if not meals:
            print(f"  No meals found for category '{category}'")
            return 0

        if limit:
            meals = meals[:limit]

        print(f"  Found {len(meals)} meals")

        imported_count = 0
        with scope(space=self.space):  # Activate space scope
            for meal in meals:
                meal_id = meal.get('idMeal')
                if not meal_id:
                    continue

                meal_details = self.fetch_meal_details(meal_id)
                if not meal_details:
                    continue

                try:
                    self.create_recipe_from_meal(meal_details, replace=replace)
                    imported_count += 1
                except Exception as e:
                    print(f"  Error importing meal {meal_id}: {e}")

        print(f"  Imported {imported_count} recipes")
        return imported_count

    def import_random(self, count: int = 1, replace: bool = False) -> int:
        """Import random recipes

        Args:
            count: Number of random recipes to import
            replace: If True, replace existing recipes; if False, skip them
        """
        print(f"\nImporting {count} random recipe(s)")

        imported_count = 0
        with scope(space=self.space):  # Activate space scope
            for _ in range(count):
                response = self.session.get(f"{THEMEALDB_BASE_URL}/random.php")
                response.raise_for_status()
                data = response.json()

                meals = data.get('meals', [])
                if meals:
                    try:
                        self.create_recipe_from_meal(meals[0], replace=replace)
                        imported_count += 1
                    except Exception as e:
                        print(f"  Error importing random recipe: {e}")

        print(f"  Imported {imported_count} recipe(s)")
        return imported_count


def main():
    parser = argparse.ArgumentParser(
        description='Import recipes from TheMealDB to Tandoor Recipes'
    )
    parser.add_argument(
        '--count',
        type=int,
        default=10,
        help='Number of recipes to import (default: 10)'
    )
    parser.add_argument(
        '--category',
        type=str,
        help='Category to import from (e.g., Seafood, Vegetarian, Beef)'
    )
    parser.add_argument(
        '--random',
        action='store_true',
        help='Import random recipes instead of by category'
    )
    parser.add_argument(
        '--list-categories',
        action='store_true',
        help='List all available categories'
    )
    parser.add_argument(
        '--replace',
        action='store_true',
        help='Replace existing recipes instead of skipping them'
    )
    parser.add_argument(
        '--user',
        type=str,
        required=True,
        help='Username to associate imported recipes with'
    )
    parser.add_argument(
        '--space-id',
        type=int,
        help='Space ID to import into (defaults to user active space)'
    )

    args = parser.parse_args()

    # Get user
    try:
        with scopes_disabled():
            user = User.objects.get(username=args.user)
    except User.DoesNotExist:
        print(f"Error: User '{args.user}' not found")
        return 1

    # Get space
    if args.space_id:
        try:
            with scopes_disabled():
                space = Space.objects.get(id=args.space_id)
        except Space.DoesNotExist:
            print(f"Error: Space with ID {args.space_id} not found")
            return 1
    else:
        with scopes_disabled():
            space = user.get_active_space()
            if not space:
                print("Error: User has no active space")
                return 1

    print(f"Importing for user: {user.username}")
    print(f"Space: {space.name}")

    importer = TheMealDBImporter(space, user)

    if args.list_categories:
        print("\nAvailable categories:")
        categories = importer.fetch_all_categories()
        for cat in categories:
            print(f"  - {cat}")
        return 0

    total_imported = 0

    if args.random:
        total_imported = importer.import_random(args.count, replace=args.replace)
    elif args.category:
        total_imported = importer.import_by_category(args.category, args.count, replace=args.replace)
    else:
        # Import from various categories
        categories = ['Seafood', 'Chicken', 'Beef', 'Vegetarian', 'Pasta']
        per_category = args.count // len(categories)

        for category in categories:
            total_imported += importer.import_by_category(category, per_category, replace=args.replace)

    print(f"\n✓ Total recipes imported: {total_imported}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
