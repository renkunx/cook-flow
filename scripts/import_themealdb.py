#!/usr/bin/env python3
"""
TheMealDB Recipe Importer for Tandoor Recipes (AI-Enhanced Version)

This script fetches recipes from TheMealDB API and uses AI to:
1. Translate to Chinese (or other languages)
2. Generate recipe description
3. Optimize cooking steps
4. Assign ingredients to steps
5. Calculate nutritional information (calories, protein, fat, carbs)

Usage:
    python scripts/import_themealdb.py --count 10
    python scripts/import_themealdb.py --category Seafood
    python scripts/import_themealdb.py --random --lang zh
"""

import argparse
import warnings
import json
import os
import sys
import requests
from typing import List, Dict, Optional
from urllib.parse import urlparse
from PIL import Image as PILImage
from io import BytesIO

# Filter out Pydantic warnings from litellm
warnings.filterwarnings('ignore', category=UserWarning, module='pydantic')

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recipes.settings')

import django
django.setup()

from django.contrib.auth.models import User
from django_scopes import scope, scopes_disabled
from django.core.files import File as DjangoFile
from django.db.models import Q
from cookbook.models import Recipe, Step, Ingredient, Food, Unit, Keyword, Space, PropertyType, AiProvider, Property
from cookbook.helper.image_processing import handle_image
from cookbook.helper.ai_config_helper import get_ai_provider_config
import uuid


# TheMealDB API endpoints
THEMEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1"


class TheMealDBImporter:
    """Importer for TheMealDB recipes with AI-powered processing"""

    def __init__(self, space: Space, user: User, translate_language: str = None):
        self.space = space
        self.user = user
        self.session = requests.Session()
        self.imported_images = set()
        self.translate_language = translate_language

        # Language mapping
        self.language_names = {
            'zh': 'Chinese (Simplified)',
            'ja': 'Japanese',
            'ko': 'Korean'
        }

        # Load AI config
        self.ai_config = None
        self._load_ai_config()

    def _load_ai_config(self):
        """Load AI provider configuration"""
        from cookbook.models import AiProvider

        try:
            provider = AiProvider.objects.filter(
                Q(space=self.space) | Q(space__isnull=True)
            ).first()

            if not provider:
                print("Warning: No AI provider found. Import will use basic mode.")
                return

            self.ai_config = get_ai_provider_config(provider)
            if self.translate_language:
                print(f"AI translation enabled: {self.language_names.get(self.translate_language, self.translate_language)}")
            else:
                print("AI processing enabled")
        except Exception as e:
            print(f"Warning: Failed to load AI config: {e}")
            self.ai_config = None

    def download_image(self, image_url: str) -> Optional[bytes]:
        """Download and process image"""
        if not image_url or image_url in self.imported_images:
            return None

        try:
            response = self.session.get(image_url, timeout=30)
            response.raise_for_status()

            ext = '.jpg'

            class FakeRequest:
                def __init__(self, user, space):
                    self.user = user
                    self.space = space

            fake_request = FakeRequest(self.user, self.space)
            image_file = DjangoFile(BytesIO(response.content), name='image.jpg')

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

    def fetch_all_categories(self) -> List[str]:
        """Fetch all available categories from TheMealDB"""
        response = self.session.get(f"{THEMEALDB_BASE_URL}/categories.php")
        response.raise_for_status()
        data = response.json()

        if data.get('categories'):
            return [cat['strCategory'] for cat in data['categories']]
        return []

    def create_or_get_food(self, name: str) -> Food:
        """Get or create a Food item"""
        name = name.strip()
        try:
            food = Food.objects.get(name__iexact=name, space=self.space)
            return food
        except Food.DoesNotExist:
            pass

        food = Food.objects.create(
            space=self.space,
            name=name,
            plural_name=name + 's' if not name.endswith('s') else name
        )
        return food

    def create_or_get_unit(self, name: str) -> Optional[Unit]:
        """Get or create a Unit"""
        if not name:
            return None

        name = name.strip()
        try:
            unit = Unit.objects.get(name__iexact=name, space=self.space)
            return unit
        except Unit.DoesNotExist:
            pass

        unit = Unit.objects.create(
            space=self.space,
            name=name,
            plural_name=name + 's' if not name.endswith('s') else name
        )
        return unit

    def process_with_ai(self, meal: Dict) -> Optional[Dict]:
        """
        Use AI to process the meal data:
        - Translate to target language (if specified)
        - Generate recipe description
        - Optimize and structure cooking steps
        - Assign ingredients to appropriate steps
        - Calculate nutritional information
        """
        if not self.ai_config:
            return None

        try:
            from litellm import completion

            print(f"    Processing with AI...")

            # Build ingredient list for context
            ingredient_list = []
            for i in range(1, 21):
                ingredient = meal.get(f'strIngredient{i}', '').strip()
                measure = meal.get(f'strMeasure{i}', '').strip()
                if ingredient:
                    ingredient_list.append(f"{measure} {ingredient}".strip())

            instructions = meal.get('strInstructions', '')
            category = meal.get('strCategory', '')
            area = meal.get('strArea', '')

            # Build the AI prompt
            if self.translate_language == 'zh':
                target_lang = "Chinese (Simplified)"
                prompt = f"""You are a professional chef and recipe translator. Please process the following English recipe and return a structured JSON in Chinese.

Original Recipe Data:
- Name: {meal.get('strMeal')}
- Category: {category}
- Cuisine: {area}
- Ingredients: {', '.join(ingredient_list)}
- Instructions: {instructions}

Please return a JSON in this exact format:

{{
  "name": "中文菜名（简化，去掉营销词汇）",
  "description": "简短描述（1-2句话，包含口感、风味、营养亮点）",
  "keywords": ["关键词1", "关键词2"],
  "steps": [
    {{
      "instruction": "详细的步骤说明（用中文，条理清晰）",
      "ingredients": [
        {{"food": "食材中文名", "amount": 数量, "unit": "单位"}}
      ]
    }}
  ],
  "nutrition": {{
    "calories": 估算数值（每份）,
    "protein": 数值（克）,
    "fat": 数值（克）,
    "carbohydrates": 数值（克）
  }},
  "servings": 估算份数,
  "working_time": 估算时间（分钟）
}}

Requirements:
1. Simplify the recipe name: Remove marketing words, keep only the core dish name
2. Break down long instructions into logical, numbered steps
3. Assign ingredients to the steps where they are first used
4. Estimate nutritional values based on the ingredients (be realistic)
5. Only return valid JSON, no explanations
6. Use proper UTF-8 Chinese characters

Recipe text:"""
            else:
                # English mode - just optimize
                prompt = f"""You are a professional chef. Please process the following recipe and return a structured JSON.

Original Recipe Data:
- Name: {meal.get('strMeal')}
- Category: {category}
- Cuisine: {area}
- Ingredients: {', '.join(ingredient_list)}
- Instructions: {instructions}

Please return a JSON in this exact format:

{{
  "name": "Simplified recipe name",
  "description": "Brief description (1-2 sentences)",
  "keywords": ["keyword1", "keyword2"],
  "steps": [
    {{
      "instruction": "Detailed step instruction",
      "ingredients": [
        {{"food": "ingredient name", "amount": number, "unit": "unit"}}
      ]
    }}
  ],
  "nutrition": {{
    "calories": estimated value per serving,
    "protein": grams,
    "fat": grams,
    "carbohydrates": grams
  }},
  "servings": estimated servings,
  "working_time": minutes
}}

Requirements:
1. Simplify the recipe name
2. Break down instructions into logical steps
3. Assign ingredients to appropriate steps
4. Estimate nutritional values realistically
5. Only return valid JSON

Recipe text:"""

            messages = [{
                "role": "user",
                "content": prompt
            }]

            response = completion(
                **self.ai_config,
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.3
            )

            response_text = response.choices[0].message.content.strip()

            # Parse JSON response
            if response_text.startswith('```'):
                response_text = '\n'.join(response_text.split('\n')[1:-1])

            recipe_json = json.loads(response_text)

            # Add image URL
            recipe_json['image_url'] = meal.get('strMealThumb')
            recipe_json['source_url'] = meal.get('strSource') or meal.get('strYoutube')

            print(f"      AI processing complete: {recipe_json['name']}")
            print(f"        Steps: {len(recipe_json.get('steps', []))}")
            print(f"        Nutrition: {recipe_json.get('nutrition', {})}")

            return recipe_json

        except Exception as e:
            print(f"    AI processing failed: {e}")
            import traceback
            traceback.print_exc()
            return None

    def process_basic(self, meal: Dict) -> Dict:
        """Basic processing without AI"""
        ingredient_list = []
        for i in range(1, 21):
            ingredient = meal.get(f'strIngredient{i}', '').strip()
            measure = meal.get(f'strMeasure{i}', '').strip()
            if ingredient:
                ingredient_list.append({
                    'food': ingredient,
                    'amount': 1,
                    'unit': measure if measure else None,
                    'note': f"{measure} {ingredient}".strip()
                })

        instructions = meal.get('strInstructions', '')
        # Split instructions by common delimiters
        steps = []
        for delimiter in ['\r\n\r\n', '\n\n', '. ', '。']:
            if delimiter in instructions:
                steps = [s.strip() for s in instructions.split(delimiter) if s.strip()]
                break
        if not steps:
            steps = [instructions]

        return {
            'name': meal.get('strMeal', 'Unknown Recipe'),
            'description': meal.get('strCategory', ''),
            'keywords': [meal.get('strCategory'), meal.get('strArea')] if meal.get('strArea') else [meal.get('strCategory')],
            'steps': [{'instruction': s, 'ingredients': []} for s in steps[:10]],
            'ingredients': ingredient_list,
            'image_url': meal.get('strMealThumb'),
            'source_url': meal.get('strSource') or meal.get('strYoutube'),
            'servings': 1,
            'working_time': 30,
            'nutrition': {}
        }

    def create_recipe_from_data(self, recipe_data: Dict, replace: bool = False) -> Optional[Recipe]:
        """Create Tandoor Recipe from processed data"""
        name = recipe_data.get('name', 'Unknown Recipe')

        # Check if recipe already exists
        existing = Recipe.objects.filter(space=self.space, name=name).first()
        if existing:
            if replace:
                print(f"  Recipe '{name}' exists, replacing...")
                existing.delete()
            else:
                print(f"  Recipe '{name}' already exists, skipping...")
                return existing

        # Create the recipe
        recipe = Recipe.objects.create(
            space=self.space,
            created_by=self.user,
            name=name,
            description=recipe_data.get('description', ''),
            source_url=recipe_data.get('source_url'),
            servings=recipe_data.get('servings', 1),
            servings_text=f"{recipe_data.get('servings', 1)} serving",
            working_time=recipe_data.get('working_time', 30),
            waiting_time=0,
            internal=True,
        )

        # Download and add image
        image_url = recipe_data.get('image_url')
        if image_url:
            image_data = self.download_image(image_url)
            if image_data:
                try:
                    recipe.image.save(f'{uuid.uuid4()}_{recipe.pk}.jpg', DjangoFile(image_data))
                    recipe.save()
                except Exception as e:
                    print(f"    Warning: Failed to save image: {e}")

        # Add keywords
        keywords = recipe_data.get('keywords', [])
        for kw_name in keywords:
            if kw_name:
                keyword, created = Keyword.objects.get_or_create(
                    name=kw_name,
                    space=self.space,
                    defaults={'description': f'Tag: {kw_name}'}
                )
                recipe.keywords.add(keyword)

        # Create steps with ingredients
        steps_data = recipe_data.get('steps', [])
        if not steps_data:
            # Fallback: create one step with all ingredients
            steps_data = [{
                'instruction': recipe_data.get('description', 'See instructions'),
                'ingredients': recipe_data.get('ingredients', [])
            }]

        for idx, step_data in enumerate(steps_data[:20], start=1):
            if not step_data.get('instruction'):
                continue

            step = Step.objects.create(
                space=self.space,
                name=f'Step {idx}' if len(steps_data) > 1 else 'Instructions',
                instruction=step_data['instruction'],
                order=idx
            )
            recipe.steps.add(step)

            # Add ingredients to this step
            step_ingredients = step_data.get('ingredients', [])
            for ing_data in step_ingredients:
                if isinstance(ing_data, dict):
                    food_name = ing_data.get('food', '')
                    amount = ing_data.get('amount')
                    unit_name = ing_data.get('unit')
                else:
                    continue

                if not food_name:
                    continue

                food = self.create_or_get_food(food_name)
                unit = self.create_or_get_unit(unit_name) if unit_name else None

                ingredient = Ingredient.objects.create(
                    space=self.space,
                    food=food,
                    unit=unit,
                    amount=float(amount) if amount else 1,
                    note=ing_data.get('note', '') if isinstance(ing_data, dict) else ''
                )
                step.ingredients.add(ingredient)

        # Add nutrition properties if available
        nutrition = recipe_data.get('nutrition', {})
        if nutrition:
            # Get or create property types and create properties
            nutrition_map = {
                'calories': ('卡路里' if self.translate_language == 'zh' else 'Calories', 'kcal'),
                'protein': ('蛋白质' if self.translate_language == 'zh' else 'Protein', 'g'),
                'fat': ('脂肪' if self.translate_language == 'zh' else 'Fat', 'g'),
                'carbohydrates': ('碳水化合物' if self.translate_language == 'zh' else 'Carbohydrates', 'g'),
            }

            for key, value in nutrition.items():
                if key in nutrition_map and value is not None:
                    pt_name, pt_unit = nutrition_map[key]

                    # Get or create property type
                    property_type, created = PropertyType.objects.get_or_create(
                        name=pt_name,
                        space=self.space,
                        defaults={'unit': pt_unit}
                    )

                    # Create property
                    try:
                        amount = float(value)
                        prop = Property.objects.create(
                            space=self.space,
                            property_type=property_type,
                            property_amount=amount
                        )
                        recipe.properties.add(prop)
                        print(f"    Added nutrition: {pt_name} {amount} {pt_unit}")
                    except (ValueError, TypeError) as e:
                        print(f"    Warning: Invalid nutrition value for {key}: {value}")

        print(f"  Created recipe: {recipe.name}")
        return recipe

    def import_by_category(self, category: str, limit: Optional[int] = None, replace: bool = False) -> int:
        """Import recipes from a specific category"""
        print(f"\nImporting recipes from category: {category}")

        meals = self.fetch_meals_by_category(category)
        if not meals:
            print(f"  No meals found for category '{category}'")
            return 0

        if limit:
            meals = meals[:limit]

        print(f"  Found {len(meals)} meals")

        imported_count = 0
        with scope(space=self.space):
            for meal_info in meals:
                meal_id = meal_info.get('idMeal')
                if not meal_id:
                    continue

                meal_details = self.fetch_meal_details(meal_id)
                if not meal_details:
                    continue

                try:
                    # Try AI processing first
                    recipe_data = self.process_with_ai(meal_details)

                    # Fallback to basic processing
                    if not recipe_data:
                        print(f"      Using basic processing...")
                        recipe_data = self.process_basic(meal_details)

                    if recipe_data:
                        self.create_recipe_from_data(recipe_data, replace=replace)
                        imported_count += 1
                except Exception as e:
                    print(f"  Error importing meal {meal_id}: {e}")
                    import traceback
                    traceback.print_exc()

        print(f"  Imported {imported_count} recipes")
        return imported_count

    def import_random(self, count: int = 1, replace: bool = False) -> int:
        """Import random recipes"""
        print(f"\nImporting {count} random recipe(s)")

        imported_count = 0
        with scope(space=self.space):
            for _ in range(count):
                response = self.session.get(f"{THEMEALDB_BASE_URL}/random.php")
                response.raise_for_status()
                data = response.json()

                meals = data.get('meals', [])
                if meals:
                    try:
                        recipe_data = self.process_with_ai(meals[0])
                        if not recipe_data:
                            recipe_data = self.process_basic(meals[0])

                        if recipe_data:
                            self.create_recipe_from_data(recipe_data, replace=replace)
                            imported_count += 1
                    except Exception as e:
                        print(f"  Error importing random recipe: {e}")

        print(f"  Imported {imported_count} recipe(s)")
        return imported_count


def main():
    parser = argparse.ArgumentParser(
        description='Import recipes from TheMealDB to Tandoor Recipes (AI-Enhanced)'
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
    parser.add_argument(
        '--language',
        '--lang',
        type=str,
        choices=['zh', 'ja', 'ko'],
        help='Translate recipes to specified language: zh=Chinese, ja=Japanese, ko=Korean'
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

    importer = TheMealDBImporter(space, user, translate_language=getattr(args, 'language', None))

    if args.list_categories:
        print("\nAvailable categories:")
        categories = importer.fetch_all_categories() if hasattr(importer, 'fetch_all_categories') else []
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
