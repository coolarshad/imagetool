"""
cPanel (Phusion Passenger / LiteSpeed) entry point.

In cPanel > Setup Python App use:
    Application root:          repositories/imagetool
    Application startup file:  passenger_wsgi.py
    Application entry point:   application
"""
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "imagetool_cms.settings.production")

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
