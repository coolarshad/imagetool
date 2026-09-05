from django.http import HttpResponse
from django.views import View

class RobotsTxtView(View):
    def get(self, request, *args, **kwargs):
        base_url = request.build_absolute_uri('/')[:-1]
        lines = [
            "User-agent: *",
            "Allow: /",
            "Disallow: /admin/",
            "Disallow: /django-admin/",
            "Disallow: /documents/",
            "",
            f"Sitemap: {base_url}/sitemap.xml",
        ]
        return HttpResponse("\n".join(lines), content_type="text/plain")
