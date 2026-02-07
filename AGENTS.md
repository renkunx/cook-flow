# AGENTS.md - AI Coding Agent Guide

This document provides comprehensive guidance for AI coding agents working with the **Cook Flow** (Tandoor Recipes) project. This is a full-stack recipe management application with Django backend and Vue.js frontend.

---

## Project Overview

**Cook Flow** (based on Tandoor Recipes) is a full-stack web application for recipe management, meal planning, and shopping list management. It supports recipe importing from thousands of websites, AI-powered features (image recognition, nutrition facts, translation), and multi-tenant spaces for collaboration.

**Key Features:**
- Recipe management with images, steps, and ingredients
- Meal planning with calendar views
- Shopping list generation from meal plans
- Recipe import from websites (ld+json/microdata)
- AI integration (OpenAI/Anthropic/Google) for image recognition, translations, and nutrition facts
- Multi-tenancy with Spaces for team collaboration
- Mobile-optimized responsive design

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.13+ | Runtime |
| Django | 5.2.9 | Web framework |
| Django REST Framework | 3.16.1 | API development |
| PostgreSQL | 14+ | Primary database |
| Redis | 6+ | Caching, sessions |
| Gunicorn | 23.0.0 | WSGI server |
| Nginx | - | Reverse proxy |
| OAuth2 | - | Authentication (django-oauth-toolkit) |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue.js | 3.5.13 | UI framework |
| TypeScript | 5.8.3 | Type-safe JavaScript |
| Vite | 7.1.11 | Build tool |
| Vuetify | 3.10.3 | Material Design components |
| Pinia | 3.0.2 | State management |
| Vue Router | 4.5.0 | Client-side routing |
| Vue I18n | 11.1.11 | Internationalization |

---

## Project Structure

```
cook-flow/
├── cookbook/                  # Django backend application
│   ├── models.py             # Core data models (Recipe, Food, Unit, etc.)
│   ├── serializer.py         # DRF serializers
│   ├── views/                # View modules
│   │   ├── api.py           # REST API endpoints
│   │   ├── views.py         # Traditional Django views
│   │   └── ...
│   ├── helper/              # Utility modules
│   │   ├── ai_helper.py     # AI integration utilities
│   │   ├── recipe_search.py # Search functionality
│   │   ├── recipe_url_import.py # Web scraping
│   │   └── ...
│   ├── integration/         # Recipe import integrations
│   │   ├── mealie.py       # Mealie importer
│   │   ├── nextcloud_cookbook.py
│   │   └── ...
│   ├── tests/              # Test suite
│   │   ├── api/           # API endpoint tests
│   │   ├── factories/     # Test factories
│   │   └── ...
│   └── migrations/        # Database migrations
├── vue3/                   # Vue.js 3 frontend
│   ├── src/
│   │   ├── apps/          # Application entry points
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level page components
│   │   ├── stores/        # Pinia state stores
│   │   ├── composables/   # Vue composables
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── locales/       # i18n translation files
│   ├── package.json       # Node dependencies
│   └── vite.config.ts     # Vite configuration
├── recipes/               # Django project settings
│   ├── settings.py        # Main settings
│   ├── test_settings.py   # Test-specific settings
│   ├── urls.py           # URL routing
│   └── wsgi.py           # WSGI entry point
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD workflows
├── requirements.txt       # Python dependencies
├── Dockerfile            # Container build
└── boot.sh               # Container startup script
```

---

## Development Setup

### Prerequisites
- Python 3.13+
- Node.js 22+
- PostgreSQL 14+
- Redis 6+
- Yarn or npm

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.template .env
# Edit .env with your database and secret key settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup

```bash
cd vue3

# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

### Environment Variables

Key environment variables in `.env`:

```bash
# Required
SECRET_KEY=your-secret-key-here
DB_ENGINE=django.db.backends.postgresql
POSTGRES_HOST=localhost
POSTGRES_DB=djangodb
POSTGRES_PORT=5432
POSTGRES_USER=djangouser
POSTGRES_PASSWORD=your-password

# AI Providers (optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# Optional
DEBUG=1
DEBUG_TOOLBAR=1
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## Build Commands

### Backend

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=cookbook --cov-report=html

# Run specific test file
pytest cookbook/tests/api/test_api_recipe.py

# Run tests in parallel
pytest -n auto

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Run linting
flake8

# Format code
yapf --in-place --recursive cookbook/
autopep8 --in-place --recursive cookbook/
```

### Frontend

```bash
cd vue3

# Development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Type checking
vue-tsc --noEmit
```

---

## Code Style Guidelines

### Python

- **Formatter**: YAPF with column limit of 179 characters
- **Linter**: Flake8
- **Import sorting**: isort
- Configuration in `pyproject.toml` and `.flake8`

Key style rules:
- Max line length: 179 characters
- Use PEP 8 as base style
- Use trailing commas for multi-line structures
- Indent dictionary values

### TypeScript/Vue

- Use TypeScript for all new code
- Use composition API with `<script setup>` syntax
- Follow existing component patterns
- Use Pinia for state management
- Use Vue I18n for all user-facing strings

---

## Testing Strategy

### Test Structure

```
cookbook/tests/
├── api/              # API endpoint tests
├── factories/        # pytest-factoryboy factories
├── other/            # Unit tests
└── views/            # View tests
```

### Running Tests

```bash
# Run all tests with coverage
pytest

# Run specific test module
pytest cookbook/tests/api/test_api_food.py

# Run with parallel execution
pytest -n auto

# Generate HTML report
pytest --html=docs/reports/tests/tests.html
```

### Test Configuration

- Uses `pytest-django` for Django integration
- Uses `pytest-factoryboy` for test data
- Uses `pytest-cov` for coverage
- Uses `pytest-xdist` for parallel execution
- Test settings in `recipes/test_settings.py`

---

## Core Models & Architecture

### Recipe Management

```
Recipe
├── Step (instructions)
│   └── Ingredient
│       ├── Food (hierarchical via treebeard)
│       └── Unit
├── Keyword (tags)
├── RecipeBook (collections)
└── Supermarket (store organization)
```

### Key Models

| Model | Description |
|-------|-------------|
| `Recipe` | Main recipe with name, description, servings, images |
| `Step` | Recipe instructions with ordering |
| `Ingredient` | Links Food + Unit with amounts |
| `Food` | Hierarchical food items (tree structure) |
| `Unit` | Measurement units with conversions |
| `MealPlan` | Daily/weekly meal planning |
| `ShoppingListEntry` | Shopping items |
| `Space` | Multi-tenancy separation |

### Multi-Tenancy

The application uses `django-scopes` for multi-tenancy:
- Each user belongs to one or more `Space`s
- Most models have a `space` field
- Use `ScopedManager` for queryset scoping
- Use `scopes_disabled()` context manager for cross-space operations

---

## API Architecture

### REST Endpoints

Base path: `/api/`

| Endpoint | Description |
|----------|-------------|
| `/api/recipe/` | Recipe CRUD |
| `/api/ingredient/` | Ingredient management |
| `/api/food/` | Food database |
| `/api/unit/` | Unit conversions |
| `/api/meal-plan/` | Meal planning |
| `/api/shopping-list/` | Shopping lists |
| `/api/keyword/` | Tags/keywords |

### Authentication

- OAuth2 token-based authentication
- Django session authentication for web UI
- API uses `django-oauth-toolkit`

---

## AI Integration

The application integrates with multiple AI providers via `litellm`:

### Supported Providers
- OpenAI (GPT-4, GPT-4o-mini)
- Anthropic (Claude)
- Google (Gemini)

### AI Features
- Recipe image recognition
- Step sorting and organization
- Nutrition fact extraction
- Text translation
- Recipe description generation

### Configuration
AI is configured via environment variables and the `ai_config_helper.py` module.

---

## Deployment

### Docker

```bash
# Build image
docker build -t cook-flow .

# Run container
docker run -p 80:80 -e SECRET_KEY=... cook-flow
```

### CapRover (Configured)

The project includes GitHub Actions workflows for CapRover deployment:
- Production: Deploys on push to `main` branch
- Development: Deploys on push to `develop` branch

Required GitHub Secrets:
- `CAPROVER_SERVER_PROD` / `CAPROVER_SERVER_DEV`
- `APP_NAME_PROD` / `APP_NAME_DEV`
- `APP_TOKEN_PROD` / `APP_TOKEN_DEV`
- `DOCKER_USERNAME`, `DOCKER_PASSWORD`

### Manual Deployment

```bash
# Build frontend
cd vue3 && yarn build

# Collect static
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Start server
gunicorn recipes.wsgi
```

---

## Security Considerations

1. **Secret Key**: Must be set via `SECRET_KEY` or `SECRET_KEY_FILE` env var
2. **Database Password**: Required via `POSTGRES_PASSWORD` or file
3. **Space Isolation**: Multi-tenancy enforced via django-scopes
4. **OAuth2**: API uses token-based authentication
5. **CSRF Protection**: Enabled for web forms
6. **Input Validation**: Required on all forms and API endpoints

---

## Common Development Tasks

### Adding a New API Endpoint

1. Add viewset in `cookbook/views/api.py`
2. Add serializer in `cookbook/serializer.py` if needed
3. Register URL in `cookbook/urls.py`
4. Add tests in `cookbook/tests/api/`

### Adding a New Vue Component

1. Create component in `vue3/src/components/`
2. Follow existing patterns (Composition API, `<script setup>`)
3. Add to page or route as needed
4. Use Pinia stores for state management

### Database Migrations

```bash
# Generate migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Check migration status
python manage.py showmigrations
```

### Working with Translations

```bash
# Extract translations
cd vue3
yarn vue-i18n-extract

# Django translations
python manage.py makemessages -l zh_Hans
python manage.py compilemessages
```

---

## Troubleshooting

### Database Issues
- Ensure PostgreSQL is running and accessible
- Check `POSTGRES_HOST` and `POSTGRES_PORT` settings
- Verify migrations are up to date

### Static Files
- Run `python manage.py collectstatic --noinput`
- Check `STATIC_ROOT` and `STATIC_URL` settings

### Frontend Build
- Clear `node_modules` and reinstall if issues occur
- Check Node.js version (requires 22+)
- Run `yarn build` to see detailed errors

### Import Errors
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`
- Check Python version (requires 3.13+)

---

## Resources

- **Documentation**: https://docs.tandoor.dev/
- **Community**: https://community.tandoor.dev
- **Discord**: https://discord.gg/RhzBrfWgtp
- **Demo**: https://app.tandoor.dev/e/demo-auto-login/

---

## License

This project is licensed under the GNU AGPL v3 with a Common Clause selling exception. See `LICENSE.md` for details.
