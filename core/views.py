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


class LlmsTxtView(View):
    """Plain-text site summary for AI crawlers (https://llmstxt.org)."""

    def get(self, request, *args, **kwargs):
        from core.models import ToolPage, StandardPage
        from blog.models import BlogPage

        base_url = request.build_absolute_uri('/')[:-1]

        def link(page, desc=""):
            url = base_url + page.url
            return f"- [{page.title}]({url})" + (f": {desc}" if desc else "")

        lines = [
            "# ImageToolLab",
            "",
            "> Free online image tools (resize, crop, compress, convert, rotate, flip, watermark, "
            "EXIF removal, pixelate, black & white) that run entirely in the web browser. "
            "Images are processed locally with the HTML5 Canvas API and are never uploaded to a server. "
            "No sign-up, no watermarks added to output, no usage limits.",
            "",
            "## Tools",
        ]
        for tool in ToolPage.objects.live().order_by('id'):
            lines.append(link(tool, tool.search_description or tool.subheadline))

        posts = BlogPage.objects.live().order_by('-published_date')
        if posts:
            lines += ["", "## Guides"]
            lines += [link(p, p.excerpt) for p in posts]

        company = StandardPage.objects.live().filter(slug__in=["about", "contact", "privacy"])
        if company:
            lines += ["", "## Company"]
            lines += [link(p, p.search_description) for p in company]

        return HttpResponse("\n".join(lines) + "\n", content_type="text/plain; charset=utf-8")
