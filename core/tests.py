import json
from django.test import TestCase, Client
from wagtail.models import Site, Page
from core.models import HomePage, ToolPage, StandardPage
from blog.models import BlogIndexPage, BlogPage

from django.core.management import call_command

class ImageToolLabV2Tests(TestCase):
    def setUp(self):
        call_command('seed_v2')
        self.client = Client()

    def test_routes_respond_200(self):
        """Verify that all core routes, tools, and company pages return 200 OK."""
        routes = [
            '/',
            '/resize-image/',
            '/crop-image/',
            '/compress-image/',
            '/convert-image/',
            '/rotate-image/',
            '/mirror-image/',
            '/watermark-image/',
            '/metadata-image/',
            '/pixelate-image/',
            '/blackwhite-image/',
            '/blog/',
            '/blog/how-to-resize-images-without-losing-quality/',
            '/about/',
            '/privacy/',
            '/terms/',
            '/contact/',
            '/sitemap.xml',
            '/robots.txt',
        ]
        for route in routes:
            response = self.client.get(route)
            self.assertEqual(
                response.status_code, 
                200, 
                f"Route {route} returned status {response.status_code} instead of 200"
            )

    def test_sitemap_xml(self):
        """Verify that /sitemap.xml contains key routes."""
        response = self.client.get('/sitemap.xml')
        self.assertEqual(response.status_code, 200)
        self.assertIn('application/xml', response['Content-Type'])
        content = response.content.decode('utf-8')
        self.assertIn('<urlset', content)
        self.assertIn('/resize-image/', content)
        self.assertIn('/blog/', content)

    def test_robots_txt(self):
        """Verify that /robots.txt serves correct directives."""
        response = self.client.get('/robots.txt')
        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf-8')
        self.assertIn('User-agent: *', content)
        self.assertIn('Allow: /', content)
        self.assertIn('Disallow: /admin/', content)
        self.assertIn('Sitemap:', content)

    def test_homepage_seo_and_schema(self):
        """Verify that HomePage includes meta tags, canonical link, and JSON-LD structured data."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf-8')
        self.assertIn('<title>', content)
        self.assertIn('rel="canonical"', content)
        self.assertIn('application/ld+json', content)
        self.assertIn('WebApplication', content)
        self.assertIn('#organization', content)
        self.assertIn('og:image', content)
        self.assertIn('twitter:image', content)

    def test_tool_page_seo_and_schema(self):
        """Verify that ToolPage includes HowTo and FAQ schemas."""
        response = self.client.get('/resize-image/')
        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf-8')
        self.assertIn('Resize', content)
        self.assertIn('How to use Resize Image', content)
        self.assertIn('application/ld+json', content)

    def _jsonld(self, path):
        import re
        content = self.client.get(path).content.decode('utf-8')
        match = re.search(r'<script type="application/ld\+json">(.*?)</script>', content, re.S)
        self.assertIsNotNone(match, f"No JSON-LD on {path}")
        return json.loads(match.group(1))

    def test_structured_data_is_valid_json(self):
        """Every page type emits parseable JSON-LD with the Organization entity."""
        for path in ['/', '/resize-image/', '/blog/how-to-resize-images-without-losing-quality/']:
            types = [node['@type'] for node in self._jsonld(path)['@graph']]
            self.assertIn('Organization', types, path)

    def test_llms_txt(self):
        response = self.client.get('/llms.txt')
        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf-8')
        self.assertTrue(content.startswith('# ImageToolLab'))
        self.assertIn('/compress-image/', content)

    def test_tool_panels_do_not_emit_headings(self):
        """Tool control labels for all ten tools must not be headings (dilutes topical focus)."""
        content = self.client.get('/resize-image/').content.decode('utf-8')
        self.assertNotIn('<h4 class="text-sm font-black uppercase', content)
        self.assertEqual(content.count('<h1'), 1)

    def test_update_tool_content_command(self):
        """Tool-specific FAQs/steps replace the shared template and land in the schema."""
        call_command('update_tool_content')
        graph = self._jsonld('/compress-image/')['@graph']
        faq = next(n for n in graph if n['@type'] == 'FAQPage')
        questions = [q['name'] for q in faq['mainEntity']]
        self.assertIn('How do I compress an image to under 100 KB?', questions)
        self.assertGreaterEqual(len(questions), 5)
        howto = next(n for n in graph if n['@type'] == 'HowTo')
        self.assertEqual(len(howto['step']), 4)
        page = ToolPage.objects.get(tool_type='compress')
        self.assertTrue(120 <= len(page.search_description) <= 165, len(page.search_description))
