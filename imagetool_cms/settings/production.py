import os
from .base import *

DEBUG = False
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "prod-secret-key-change-in-env-file-983141")

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "imagetoollab.com,www.imagetoollab.com,localhost,127.0.0.1").split(",")

# Security headers for production SEO and Performance
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

try:
    from .local import *
except ImportError:
    pass
