from django.http import HttpResponse
from django.views import View

class RobotsTxtView(View):
    AI_CRAWLERS = [
        "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot",
        "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot",
    ]

    def get(self, request, *args, **kwargs):
        base_url = request.build_absolute_uri('/')[:-1]
        disallow = ["Disallow: /admin/", "Disallow: /django-admin/", "Disallow: /documents/"]
        lines = ["User-agent: *", "Allow: /", *disallow, ""]
        # Named groups make the welcome explicit for search and AI answer-engine crawlers.
        # A crawler that matches a named group ignores "*", so each repeats the rules.
        for bot in self.AI_CRAWLERS:
            lines += [f"User-agent: {bot}", "Allow: /", *disallow, ""]
        lines += [
            f"Sitemap: {base_url}/sitemap.xml",
            f"# AI summary: {base_url}/llms.txt",
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
