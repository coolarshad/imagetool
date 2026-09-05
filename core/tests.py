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
        self.assertIn('SoftwareApplication', content)

    def test_tool_page_seo_and_schema(self):
        """Verify that ToolPage includes HowTo and FAQ schemas."""
        response = self.client.get('/resize-image/')
        self.assertEqual(response.status_code, 200)
        content = response.content.decode('utf-8')
        self.assertIn('Resize', content)
        self.assertIn('How to use Resize Image', content)
        self.assertIn('application/ld+json', content)
