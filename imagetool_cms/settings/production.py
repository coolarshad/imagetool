import os

from .base import *  # noqa: F401,F403

# Optional .env file in the project root (next to manage.py). Real environment
# variables (e.g. set in cPanel "Setup Python App") always win over it.
try:
    import environ

    environ.Env.read_env(os.path.join(BASE_DIR, ".env"), overwrite=False)
except Exception:
    pass


def env_list(name, default):
    value = os.environ.get(name)
    if not value:
        return list(default)
    return [item.strip() for item in value.split(",") if item.strip()]


DEBUG = os.environ.get("DJANGO_DEBUG", "False").lower() in ("1", "true", "yes")

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "prod-secret-key-change-in-env-file-983141",
)

ALLOWED_HOSTS = env_list(
    "DJANGO_ALLOWED_HOSTS",
    ["imagetoollab.com", "www.imagetoollab.com", "localhost", "127.0.0.1"],
)

CSRF_TRUSTED_ORIGINS = env_list(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    ["https://imagetoollab.com", "https://www.imagetoollab.com"],
)

WAGTAILADMIN_BASE_URL = os.environ.get("WAGTAILADMIN_BASE_URL", "https://imagetoollab.com")

# cPanel / Apache / LiteSpeed terminate HTTPS in front of the app.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Security headers
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "SAMEORIGIN"  # Wagtail admin previews use iframes

# Send errors to stderr -> cPanel writes them to <app root>/stderr.log
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "WARNING"},
    "loggers": {
        "django": {"handlers": ["console"], "level": "WARNING", "propagate": False},
    },
}

try:
    from .local import *  # noqa: F401,F403
except ImportError:
    pass
