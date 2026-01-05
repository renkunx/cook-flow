# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tandoor Recipes** is a full-stack Django + Vue.js application for recipe management, meal planning, and shopping list management. It's a production-ready application with modern architecture and comprehensive features.

## Repository Structure

```
cook-flow/
├── cookbook/          # Django backend (Python)
├── vue3/             # Vue.js frontend (TypeScript)
├── docs/             # Documentation
└── .github/          # GitHub workflows and actions
```

## Key Technologies

**Backend:**
- **Django 5.2.7** - Core web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Primary database (via psycopg2-binary)
- **Redis** - Caching and session storage
- **OAuth2** - Authentication (django-oauth-toolkit)

**Frontend:**
- **Vue.js 3** - Reactive UI framework
- **Vite** - Build tool and dev server
- **Vuetify 3** - Material Design component library
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management

## Core Models & Architecture

### Recipe Management Core
- **Recipe** - Main recipe model with name, description, servings, images, steps
- **Ingredient** - Links Food + Unit + amount for recipe ingredients
- **Food** - Hierarchical food items (tree structure via treebeard)
- **Unit** - Measurement units with conversions
- **Step** - Recipe steps with instructions and ingredient lists

### Meal Planning & Shopping
- **MealPlan** - Daily/weekly meal planning with recipes
- **ShoppingListEntry** - Individual shopping items
- **ShoppingListRecipe** - Recipes linked to shopping lists
- **MealType** - Breakfast, lunch, dinner, etc.

### Organization
- **Keyword** - Hierarchical tags for categorizing recipes
- **RecipeBook** - Collections of recipes
- **Supermarket** - Store organization with categories

### User & Permissions
- **User/Group** - Django auth system
- **Space** - Multi-tenancy separation
- **UserPreference** - User-specific settings
- **ShareLink** - Public recipe sharing

## API Architecture

**REST API Endpoints** (via Django REST Framework):
- `/api/recipe/` - Recipe CRUD operations
- `/api/ingredient/` - Ingredient management
- `/api/meal-plan/` - Meal planning
- `/api/shopping-list/` - Shopping list management
- `/api/food/` - Food database
- `/api/unit/` - Unit conversions
- `/api/keyword/` - Tag management

**Key API Features:**
- **OAuth2 authentication** with token-based access
- **Pagination** for large datasets
- **Filtering** and **search** capabilities
- **File upload** support for images
- **Bulk operations** for efficiency

## Development Commands

### Backend (Django)
```bash
# Start development server
python manage.py runserver

# Run tests
pytest

# Run tests with coverage
pytest --cov=cookbook

# Run specific test file
pytest cookbook/tests/api/test_api_recipe.py

# Run linting
flake8
autopep8 --in-place --recursive cookbook/

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Frontend (Vue.js)
```bash
# Install dependencies
cd vue3 && yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

### Testing
```bash
# Run all tests
pytest

# Run tests with coverage report
pytest --cov=cookbook --cov-report=html

# Run specific test module
pytest cookbook/tests/api/

# Run tests in parallel
pytest -n auto

# Run tests with HTML report
pytest --html=reports/test_report.html
```

### Code Quality
```bash
# Lint Python code
flake8
autopep8 --in-place --recursive cookbook/

# Format Python code
yapf --in-place --recursive cookbook/

# Lint Vue.js code
# (Use ESLint/Vite for frontend linting)
```

## Database Models

### Key Relationships
```
Recipe ←→ Step ←→ Ingredient ←→ Food
                          ↓
                         Unit
Recipe ←→ MealPlan ←→ ShoppingListRecipe ←→ ShoppingListEntry
Recipe ←→ Keyword (tags)
Recipe ←→ RecipeBook (collections)
```

### Important Model Files
- `cookbook/models.py` - Core Django models
- `vue3/src/types/Models.ts` - TypeScript model definitions
- `vue3/src/openapi/models/` - API model definitions

## Frontend Architecture

### Key Components
- **Pages** - Main application views (RecipeView, SearchPage, etc.)
- **Components** - Reusable UI elements
- **Model Editors** - CRUD interfaces for all models
- **Dialogs** - Modal windows for actions

### Important Pages
- **RecipeViewPage** - Single recipe display with instructions
- **SearchPage** - Advanced recipe search with filters
- **IngredientEditorPage** - Food database management
- **MealPlanPage** - Weekly meal planning interface
- **ShoppingListPage** - Shopping list management

### State Management
- **Pinia stores** for global state
- **ShoppingStore** - Shopping list management
- **MealPlanStore** - Meal planning state
- **UserPreferenceStore** - User settings

## Build & Deployment

### Docker
```bash
# Build Docker image
docker build -t tandoor-recipes .

# Run with Docker Compose (if available)
docker-compose up
```

### Environment Variables
- `DEBUG` - Debug mode (True/False)
- `SECRET_KEY` - Django secret key
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string

## Key Features to Understand

1. **Recipe Import** - Supports thousands of websites via ld+json/microdata
2. **Meal Planning** - Plan multiple meals per day with auto-scheduling
3. **Shopping Lists** - Generate from meal plans or recipes
4. **Ingredient Management** - Hierarchical food database with substitutions
5. **Unit Conversions** - Automatic unit conversion and scaling
6. **Collaboration** - Share and collaborate on recipes
7. **AI Integration** - Image recognition, step sorting, nutrition facts

## Important Configuration Files

- `cookbook/settings/` - Django settings configuration
- `vue3/vite.config.js` - Vite build configuration
- `vue3/tsconfig.json` - TypeScript configuration
- `cookbook/requirements.txt` - Python dependencies
- `vue3/package.json` - Node.js dependencies

## Testing Strategy

- **Unit tests** for individual functions and methods
- **Integration tests** for API endpoints and database operations
- **Factory-based testing** using pytest-factoryboy
- **Multi-space testing** for tenant isolation
- **Permission-based testing** for access control

## Common Development Tasks

1. **Adding new API endpoints** - Extend Django views and serializers
2. **Creating new Vue components** - Follow existing component patterns
3. **Database migrations** - Use Django migration system
4. **Frontend state management** - Use Pinia stores
5. **Internationalization** - Update translation files in locale directories

## Performance Considerations

- **Database optimization** - Use select_related and prefetch_related
- **API pagination** - Implement for large datasets
- **Frontend lazy loading** - Use Vue.js async components
- **Image optimization** - Use Django image processing
- **Caching** - Implement Redis caching for frequently accessed data

## Security Considerations

- **OAuth2 authentication** for API access
- **Django permissions** for user access control
- **Space isolation** for multi-tenancy
- **Input validation** on all forms and API endpoints
- **CSRF protection** for web forms

## Troubleshooting

### Common Issues
- **Database migrations** - Ensure migrations are up to date
- **Static files** - Collect static files in production
- **CORS** - Configure CORS headers for API access
- **File uploads** - Check storage configuration
- **Permissions** - Verify user permissions and space access

### Debugging Tools
- **Django Debug Toolbar** for backend debugging
- **Vue DevTools** for frontend debugging
- **Browser developer tools** for API inspection
- **Database queries** - Use Django's query logging