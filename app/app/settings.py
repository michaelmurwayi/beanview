"""
Django settings for app project.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------------------------
# SECURITY
# ------------------------------------------------------------
SECRET_KEY = 'django-insecure-g#j^ols89tug61d&$5n*f-)#skz91ic+3#l_#x&3%%!^k2b+ee'
DEBUG = True

ALLOWED_HOSTS = [
    "localhost",
    "http://localhost:5173/",
    "127.0.0.1",
    "f90c6cbbfc26.ngrok-free.app",
    "dev-48vrii7xsykextuk.us.auth0.com/api/v2/",  # ✅ your public backend URL
    "*",  # for development (you can remove in production)
]

# ------------------------------------------------------------
# APPLICATIONS
# ------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    # Local apps
    'api',
]

# ------------------------------------------------------------
# MIDDLEWARE
# ------------------------------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ✅ must be high up
    'django.middleware.common.CommonMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ------------------------------------------------------------
# CORS CONFIGURATION
# ------------------------------------------------------------

CORS_ALLOW_ALL_ORIGINS = True  # ✅ during development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
    "accept",
    "origin",
    "user-agent",
    "dnt",
    "x-requested-with",
]

# ------------------------------------------------------------
# AUTH0 CONFIGURATION
# ------------------------------------------------------------
AUTH0_DOMAIN = "dev-48vrii7xsykextuk.us.auth0.com"
AUTH0_API_IDENTIFIER = "https://f90c6cbbfc26.ngrok-free.app/api"  # ✅ must match Auth0 API Identifier

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'api.auth0authentication.Auth0JSONWebTokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# ------------------------------------------------------------
# CUSTOM USER & AUTH BACKEND
# ------------------------------------------------------------
AUTH_USER_MODEL = 'api.User'
AUTHENTICATION_BACKENDS = [
    'api.auth.CustomBackend',
]

# ------------------------------------------------------------
# URLS & WSGI
# ------------------------------------------------------------
ROOT_URLCONF = 'app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'app.wsgi.application'

# ------------------------------------------------------------
# DATABASE
# ------------------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DATABASE_NAME', 'beanview'),
        'USER': os.getenv('DATABASE_USER', 'huncho'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD', 'C11h28no3'),
        'HOST': os.getenv('DATABASE_HOST', 'cebba_db'),  # 👈 use service name 'db'
        'PORT': os.getenv('DATABASE_PORT', '3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# ------------------------------------------------------------
# PASSWORD VALIDATION
# ------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ------------------------------------------------------------
# INTERNATIONALIZATION
# ------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = False

# ------------------------------------------------------------
# STATIC & MEDIA
# ------------------------------------------------------------
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# ✅ Required for collectstatic
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# ------------------------------------------------------------
# DEFAULTS
# ------------------------------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
