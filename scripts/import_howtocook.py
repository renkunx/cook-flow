#!/usr/bin/env python3
"""
Import recipes from HowToCook repository to Tandoor Recipes.

This script scans the HowToCook dishes directory and imports markdown recipes.
It also downloads and associates images with each recipe.

Usage:
    python scripts/import_howtocook.py --path /Users/renkun/Source/HowToCook/dishes
    python scripts/import_howtocook.py --path /Users/renkun/Source/HowToCook/dishes --category meat_dish
"""

import argparse
import os
import sys
import re
import base64
import json
import warnings
from pathlib import Path
from typing import List, Dict, Optional

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
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.models import Q
from cookbook.models import Recipe, Step, Ingredient, Food, Unit, Keyword, Space, AiProvider, Property, PropertyType
from cookbook.helper.image_processing import handle_image
from cookbook.helper.ai_config_helper import get_ai_provider_config
from io import BytesIO
import uuid


class HowToCookImporter:
    """Importer for HowToCook markdown recipes"""

    def __init__(self, space: Space, user: User):
        self.space = space
        self.user = user
        self.imported_count = 0
        self.skipped_count = 0
        self.error_count = 0

        # Load AI config
        self.ai_config = None
        self._load_ai_config()

    def _load_ai_config(self):
        """Load AI provider configuration"""
        try:
            provider = AiProvider.objects.filter(
                Q(space=self.space) | Q(space__isnull=True)
            ).first()

            if not provider:
                print("警告: 未找到 AI provider，将跳过 AI 优化")
                return

            self.ai_config = get_ai_provider_config(provider)
            print("AI 优化功能已启用")
        except Exception as e:
            print(f"警告: 加载 AI 配置失败: {e}")
            self.ai_config = None

    def _clean_tips(self, tips: List[str]) -> List[str]:
        """清理技巧提示，删除无关内容"""
        patterns = [
            r'^参考资料：.*',
            r'^如果您遵循本指南.*',
            r'^请提出 Issue 或 Pull.*',
            r'^本文.*参考.*',
            r'^作者：.*',
        ]
        cleaned = []
        for tip in tips:
            # 检查是否匹配任何删除模式
            should_remove = any(re.search(p, tip) for p in patterns)
            if not should_remove and tip.strip():
                cleaned.append(tip.strip())
        return cleaned

    def _optimize_recipe_with_ai(self, recipe_data: Dict, images: List[Path]) -> Dict:
        """使用 AI 优化菜谱"""
        if not self.ai_config:
            return recipe_data

        try:
            from litellm import completion

            print(f"      使用 AI 优化菜谱...")

            # 1. 清理技巧提示
            recipe_data['tips'] = self._clean_tips(recipe_data.get('tips', []))

            # 2. 准备 prompt
            ingredients_summary = ', '.join([ing.get('name', '') for ing in recipe_data.get('ingredients', [])[:10]])
            steps_summary = '\n'.join(recipe_data.get('steps', [])[:5])

            prompt = f"""请优化以下中文菜谱数据：

菜谱名称：{recipe_data['name']}
当前描述：{recipe_data.get('description', '无')}
主要食材：{ingredients_summary}
主要步骤：{steps_summary}
技巧提示：{recipe_data.get('tips', [])[:3]}

请返回 JSON 格式：
{{
  "name": "优化后的菜名（简化，去除营销词）",
  "description": "约100-150字的菜品描述，包括口感特点和营养搭配",
  "nutrition": {{
    "calories": 每份卡路里（整数）,
    "protein": 蛋白质克数（整数）,
    "fat": 脂肪克数（整数）,
    "carbohydrates": 碳水克数（整数）
  }}
}}

要求：
- 如果当前描述为空或太短（少于50字），生成新的描述
- 根据食材估算营养信息（4人份）
- 简化菜名，去除夸张修饰词
- 返回有效的 JSON，不要有其他文字
"""

            # 3. 构造消息
            content = [{"type": "text", "text": prompt}]

            # 4. 添加步骤图片进行识别（最多3张）
            if images:
                for img_path in images[:3]:
                    if img_path.exists():
                        try:
                            with open(img_path, 'rb') as f:
                                img_base64 = base64.b64encode(f.read()).decode('utf-8')

                            content.append({
                                "type": "image_url",
                                "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}
                            })
                            print(f"        已添加图片到 AI 请求: {img_path.name}")
                        except Exception as e:
                            print(f"        添加图片失败: {e}")

            messages = [{"role": "user", "content": content}]

            response = completion(
                **self.ai_config,
                messages=messages,
                temperature=0.3
            )

            # 5. 解析 AI 返回的 JSON
            response_text = response.choices[0].message.content.strip()

            # 移除可能的 markdown 代码块标记
            if response_text.startswith('```'):
                lines = response_text.split('\n')
                if lines[0].startswith('```'):
                    response_text = '\n'.join(lines[1:])
                if response_text.endswith('```'):
                    response_text = '\n'.join(response_text.split('\n')[:-1])

            ai_result = json.loads(response_text.strip())

            # 6. 合并 AI 优化结果
            if ai_result.get('name'):
                print(f"        AI 优化菜名: {ai_result['name']}")
                recipe_data['name'] = ai_result['name']

            if ai_result.get('description'):
                print(f"        AI 生成描述: {ai_result['description'][:50]}...")
                recipe_data['description'] = ai_result['description']

            if ai_result.get('nutrition'):
                print(f"        AI 估算营养: {ai_result['nutrition']}")
                recipe_data['nutrition'] = ai_result['nutrition']

            return recipe_data

        except Exception as e:
            print(f"      AI 优化失败: {e}")
            import traceback
            traceback.print_exc()
            return recipe_data

    def _add_nutrition_properties(self, recipe: Recipe, nutrition: Dict):
        """添加营养属性到菜谱"""
        try:
            nutrition_map = {
                'calories': ('卡路里', 'kcal'),
                'protein': ('蛋白质', 'g'),
                'fat': ('脂肪', 'g'),
                'carbohydrates': ('碳水化合物', 'g'),
            }

            for key, value in nutrition.items():
                if key in nutrition_map and value is not None:
                    pt_name, pt_unit = nutrition_map[key]

                    # 获取或创建属性类型
                    property_type, created = PropertyType.objects.get_or_create(
                        name=pt_name,
                        space=self.space,
                        defaults={'unit': pt_unit}
                    )

                    # 创建属性
                    try:
                        amount = float(value)
                        prop = Property.objects.create(
                            space=self.space,
                            property_type=property_type,
                            property_amount=amount
                        )
                        recipe.properties.add(prop)
                        print(f"        营养: {pt_name} {amount} {pt_unit}")
                    except (ValueError, TypeError) as e:
                        print(f"        警告: 无效的营养值 {key}: {value}")

        except Exception as e:
            print(f"        添加营养属性失败: {e}")

    def parse_markdown_recipe(self, md_file: Path, images: List[Path]) -> Optional[Dict]:
        """Parse a HowToCook markdown recipe file"""
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract recipe name from filename or first heading
            recipe_name = md_file.parent.name

            # Extract description
            description = ''
            desc_match = re.search(r'^([^#\n].{20,})$', content, re.MULTILINE)
            if desc_match:
                description = desc_match.group(1).strip()

            # Extract difficulty
            difficulty_level = 0
            diff_match = re.search(r'预估烹饪难度：(★+)', content)
            if diff_match:
                stars = diff_match.group(1)
                difficulty_level = len(stars)  # ★★★★★ → 5

            # Extract ingredients (from ## 计算 section)
            ingredients = []
            ingredients_section = re.search(r'## 计算.*?\n\n(.*?)(?=##|\Z)', content, re.DOTALL)
            if ingredients_section:
                ingredient_text = ingredients_section.group(1)
                for line in ingredient_text.split('\n'):
                    line = line.strip()
                    if line.startswith('-'):
                        # Parse ingredient: "- 鲜仔鸭肉 2000g"
                        ingredient = self._parse_ingredient_line(line)
                        if ingredient:
                            ingredients.append(ingredient)

            # Extract steps (from ## 操作 section)
            steps = []
            steps_section = re.search(r'## 操作.*?\n\n(.*?)(?=##|\Z)', content, re.DOTALL)
            if steps_section:
                step_text = steps_section.group(1)
                # Each bullet point is a step
                for line in step_text.split('\n'):
                    line = line.strip()
                    if line.startswith('-'):
                        step_text_clean = line.lstrip('-').strip()
                        if step_text_clean:
                            steps.append(step_text_clean)

            if not steps:
                # Fallback: split by paragraphs if no bullet points
                for line in content.split('\n'):
                    line = line.strip()
                    if line and not line.startswith('#') and not line.startswith('-') and len(line) > 10:
                        steps.append(line)

            # Extract additional content/tips (from ## 附加内容 section)
            tips = []
            tips_section = re.search(r'## 附加内容.*?\n\n(.*?)(?=##|\Z)', content, re.DOTALL)
            if tips_section:
                tips_text = tips_section.group(1)
                # Each bullet point is a tip
                for line in tips_text.split('\n'):
                    line = line.strip()
                    if line.startswith('-'):
                        tip_text = line.lstrip('-').strip()
                        if tip_text:
                            tips.append(tip_text)
                    elif line and len(line) > 5:
                        # Also include non-bullet lines as tips
                        tips.append(line)

            # Get first image
            image_path = None
            if images:
                image_path = images[0]

            return {
                'name': recipe_name,
                'description': description,
                'ingredients': ingredients,
                'steps': steps,
                'tips': tips,
                'image': image_path,
                'servings': 4,  # Default from the recipe
                'working_time': 120,  # Default estimate (2 hours)
                'difficulty': difficulty_level,
            }

        except Exception as e:
            print(f"      Error parsing {md_file.name}: {e}")
            return None

    def _parse_ingredient_line(self, line: str) -> Optional[Dict]:
        """Parse an ingredient line like '- 鲜仔鸭肉 2000g'"""
        line = line.lstrip('-').strip()
        if not line:
            return None

        # Try to match: "ingredient_name amount unit"
        # Pattern: Chinese characters followed by optional numbers and units
        match = re.match(r'^([\u4e00-\u9fa5\s]+)(\d+(?:\.\d+)?)?\s*([a-zA-Z\u4e00-\u9fa5]*)?', line)
        if match:
            name = match.group(1).strip()
            amount = match.group(2)
            unit = match.group(3)

            return {
                'name': name,
                'amount': float(amount) if amount else None,
                'unit': unit if unit else None,
            }

        # Fallback: treat whole line as ingredient name
        return {'name': line, 'amount': None, 'unit': None}

    def create_recipe(self, recipe_data: Dict, category: str = '') -> Optional[Recipe]:
        """Create a recipe from parsed data"""
        try:
            # Check if recipe already exists
            existing = Recipe.objects.filter(name=recipe_data['name'], space=self.space).first()
            if existing:
                print(f"      跳过（已存在）: {recipe_data['name']}")
                self.skipped_count += 1
                return None

            # Create recipe
            recipe = Recipe.objects.create(
                space=self.space,
                created_by=self.user,
                name=recipe_data['name'],
                description=recipe_data.get('description', ''),
                servings=recipe_data.get('servings', 4),
                working_time=recipe_data.get('working_time', 60),
                waiting_time=0,
                internal=True,
                difficulty=recipe_data.get('difficulty') or None,
            )

            # Add image
            if recipe_data.get('image'):
                self._add_image_to_recipe(recipe, recipe_data['image'])

            # Create steps with ingredients
            ingredients = recipe_data.get('ingredients', [])
            steps = recipe_data.get('steps', [])
            tips = recipe_data.get('tips', [])

            current_order = 0
            for idx, step_text in enumerate(steps[:20], start=1):
                if not step_text or len(step_text) < 3:
                    continue

                current_order += 1
                step = Step.objects.create(
                    space=self.space,
                    name=f'步骤 {idx}',
                    instruction=step_text,
                    order=current_order
                )
                recipe.steps.add(step)

                # Add all ingredients to the first step
                if idx == 1 and ingredients:
                    for ing_data in ingredients[:20]:
                        self._add_ingredient_to_step(step, ing_data)

            # Add tips as a special step (if any)
            if tips:
                current_order += 1
                tips_instruction = '\n\n'.join(tips)
                tip_step = Step.objects.create(
                    space=self.space,
                    name='💡 技巧提示',
                    instruction=tips_instruction,
                    order=current_order
                )
                recipe.steps.add(tip_step)

            # Add category keyword
            if category:
                keyword, _ = Keyword.objects.get_or_create(
                    name=category,
                    space=self.space,
                    defaults={'description': f'{category}分类'}
                )
                recipe.keywords.add(keyword)

            # Add 中餐 tag
            keyword, _ = Keyword.objects.get_or_create(
                name='中餐',
                space=self.space,
                defaults={'description': '中式菜肴'}
            )
            recipe.keywords.add(keyword)

            # Add nutrition properties (if available)
            nutrition = recipe_data.get('nutrition', {})
            if nutrition:
                self._add_nutrition_properties(recipe, nutrition)

            self.imported_count += 1
            print(f"      ✓ 导入成功: {recipe_data['name']}")
            if recipe_data.get('difficulty'):
                print(f"        难度: {recipe_data['difficulty']} 星")
            return recipe

        except Exception as e:
            print(f"      ✗ 导入失败: {recipe_data['name']} - {e}")
            self.error_count += 1
            return None

    def _add_ingredient_to_step(self, step: Step, ingredient_data: Dict):
        """Add an ingredient to a step"""
        try:
            # Get or create food
            food = self._get_or_create_food(ingredient_data['name'])

            # Get or create unit
            unit = None
            if ingredient_data.get('unit'):
                unit = self._get_or_create_unit(ingredient_data['unit'])

            # Create ingredient (amount must not be null)
            Ingredient.objects.create(
                space=self.space,
                food=food,
                unit=unit,
                amount=ingredient_data.get('amount') or 0,
                step=step
            )
        except Exception as e:
            print(f"        Warning: Failed to add ingredient {ingredient_data['name']}: {e}")

    def _get_or_create_food(self, name: str) -> Food:
        """Get or create Food"""
        name = name.strip()
        try:
            food = Food.objects.get(name__iexact=name, space=self.space)
            return food
        except Food.DoesNotExist:
            pass

        return Food.objects.create(
            space=self.space,
            name=name,
            plural_name=name
        )

    def _get_or_create_unit(self, name: str) -> Optional[Unit]:
        """Get or create Unit"""
        if not name:
            return None

        name = name.strip()
        try:
            unit = Unit.objects.get(name__iexact=name, space=self.space)
            return unit
        except Unit.DoesNotExist:
            pass

        return Unit.objects.create(
            space=self.space,
            name=name,
            plural_name=name
        )

    def _add_image_to_recipe(self, recipe: Recipe, image_path: Path):
        """Add image to recipe"""
        try:
            if not image_path.exists():
                return

            class FakeRequest:
                def __init__(self, user, space):
                    self.user = user
                    self.space = space

            fake_request = FakeRequest(self.user, self.space)

            # Determine file type
            ext = image_path.suffix.lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                ext = '.jpg'

            # Read the entire file into memory
            with open(image_path, 'rb') as f:
                image_data = f.read()

            # Create a new file-like object from the data
            image_file = DjangoFile(BytesIO(image_data), name='image' + ext)

            processed_image = handle_image(fake_request, image_file, ext)

            if processed_image:
                # Reset the position for reading
                if hasattr(processed_image, 'seek'):
                    processed_image.seek(0)
                recipe.image.save(f'{uuid.uuid4()}_{recipe.pk}.jpg', DjangoFile(processed_image))
                recipe.save()
                print(f"        图片上传成功: {image_path.name}")
            else:
                print(f"        Warning: handle_image 返回 None")

        except Exception as e:
            print(f"        Warning: Failed to add image: {e}")
            import traceback
            traceback.print_exc()

    def import_from_directory(self, dishes_path: str, category: str = None):
        """Import all recipes from the HowToCook dishes directory"""
        dishes_root = Path(dishes_path)

        if not dishes_root.exists():
            print(f"Error: Directory does not exist: {dishes_path}")
            return

        print(f"\n扫描目录: {dishes_path}")

        # Find all recipe directories
        recipe_dirs = []
        if category:
            # Import from specific category
            category_path = dishes_root / category
            if category_path.exists():
                recipe_dirs = [d for d in category_path.iterdir() if d.is_dir() and not d.name.startswith('.')]
            else:
                print(f"Error: Category not found: {category}")
                return
        else:
            # Import from all categories
            for cat_dir in dishes_root.iterdir():
                if cat_dir.is_dir() and not cat_dir.name.startswith('.'):
                    recipe_dirs.extend([d for d in cat_dir.iterdir() if d.is_dir() and not d.name.startswith('.')])

        print(f"找到 {len(recipe_dirs)} 个菜谱")

        # Import each recipe
        for recipe_dir in recipe_dirs:
            print(f"\n  处理: {recipe_dir.name}")

            # Find markdown file
            md_files = list(recipe_dir.glob('*.md'))
            if not md_files:
                print(f"    跳过（无 markdown 文件）")
                continue

            md_file = md_files[0]

            # Find images
            images = []
            for ext in ['.jpg', '.jpeg', '.png', '.webp']:
                images.extend(list(recipe_dir.glob(f'*{ext}')))

            # Parse and create recipe
            recipe_data = self.parse_markdown_recipe(md_file, images)
            if recipe_data:
                # Optimize with AI (if available)
                recipe_data = self._optimize_recipe_with_ai(recipe_data, images)

                # Create recipe
                self.create_recipe(recipe_data, category or recipe_dir.parent.name)

        # Print summary
        print(f"\n导入完成!")
        print(f"  成功导入: {self.imported_count}")
        print(f"  跳过（已存在）: {self.skipped_count}")
        print(f"  失败: {self.error_count}")


def main():
    parser = argparse.ArgumentParser(description='Import HowToCook recipes')
    parser.add_argument(
        '--path',
        default='/Users/renkun/Source/HowToCook/dishes',
        help='Path to HowToCook dishes directory'
    )
    parser.add_argument(
        '--category',
        help='Specific category to import (e.g., meat_dish, vegetable_dish)'
    )

    args = parser.parse_args()

    with scopes_disabled():
        # Get default space and user
        space = Space.objects.first()
        if not space:
            print("Error: No space found. Please create a space first.")
            sys.exit(1)

        user = space.created_by
        if not user:
            # Try to get the first superuser
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                print("Error: No user found. Please create a user first.")
                sys.exit(1)

        print(f"使用空间: {space.name}")
        print(f"使用用户: {user.username}")

        # Import recipes
        importer = HowToCookImporter(space, user)
        importer.import_from_directory(args.path, args.category)


if __name__ == '__main__':
    main()
