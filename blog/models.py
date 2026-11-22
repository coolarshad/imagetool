import json
import math
from django.db import models
from django.utils import timezone
from django.utils.html import mark_safe
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from wagtail.models import Page
from wagtail.fields import StreamField, RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock

from core.blocks import FAQBlock, CalloutBlock, FeatureCardBlock
from core.models import organization_node


class BlogIndexPage(Page):
    max_count = 1
    subpage_types = ['blog.BlogPage']
    parent_page_types = ['core.HomePage']

    headline = models.CharField(max_length=200, default="Blog & Articles")
    subheadline = models.TextField(
        default="Discover tutorials, tips, and insights about image processing, privacy, and web technology."
    )

    canonical_url = models.CharField(max_length=255, blank=True)
    og_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
    )

    content_panels = Page.content_panels + [
        FieldPanel('headline'),
        FieldPanel('subheadline'),
    ]

    promote_panels = Page.promote_panels + [
        MultiFieldPanel([
            FieldPanel('canonical_url'),
            FieldPanel('og_image'),
        ], heading="SEO & Social Meta")
    ]

    def get_context(self, request):
        context = super().get_context(request)
        all_posts = BlogPage.objects.live().descendant_of(self).order_by('-published_date', '-first_published_at')

        paginator = Paginator(all_posts, 9)
        page_num = request.GET.get('page')
        try:
            posts = paginator.page(page_num)
        except PageNotAnInteger:
            posts = paginator.page(1)
        except EmptyPage:
            posts = paginator.page(paginator.num_pages)

        context['posts'] = posts
        return context

    def get_structured_data(self, request):
        page_url = request.build_absolute_uri(self.url)
        base_url = request.build_absolute_uri('/')[:-1]

        schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Blog",
                    "@id": f"{page_url}#blog",
                    "url": page_url,
                    "name": self.headline or self.title,
                    "description": self.search_description or self.subheadline,
                    "inLanguage": "en-US"
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": f"{page_url}#breadcrumbs",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": base_url
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": self.title,
                            "item": page_url
                        }
                    ]
                }
            ]
        }
        return mark_safe(json.dumps(schema, indent=2))


class BlogPage(Page):
    parent_page_types = ['blog.BlogIndexPage']
    subpage_types = []

    published_date = models.DateField("Published date", default=timezone.now)
    author = models.CharField(max_length=100, default="ImageToolLab Editorial Team")
    featured_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Header cover image for the article"
    )
    featured_image_url = models.URLField(
        blank=True, 
        help_text="Direct external image URL fallback if not using media storage"
    )
    excerpt = models.TextField(
        help_text="Short summary for article cards and meta description"
    )

    body = StreamField([
        ('rich_text', blocks.RichTextBlock()),
        ('callout', CalloutBlock()),
        ('features', FeatureCardBlock()),
        ('faq', FAQBlock()),
    ], use_json_field=True, blank=True, null=True)

    canonical_url = models.CharField(max_length=255, blank=True)
    og_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('published_date'),
            FieldPanel('author'),
            FieldPanel('featured_image'),
            FieldPanel('featured_image_url'),
            FieldPanel('excerpt'),
        ], heading="Article Meta"),
        FieldPanel('body'),
    ]

    promote_panels = Page.promote_panels + [
        MultiFieldPanel([
            FieldPanel('canonical_url'),
            FieldPanel('og_image'),
        ], heading="SEO & Social Meta")
    ]

    def get_read_time(self):
        # Calculate estimated reading time
        total_words = len(self.excerpt.split())
        for block in self.body:
            total_words += len(str(block.value).split())
        read_time = max(1, math.ceil(total_words / 200))
        return read_time

    def get_author_schema(self, base_url):
        """A named person is a Person; a team byline is the Organization itself."""
        name = (self.author or "").strip()
        if not name or "team" in name.lower() or name.lower().startswith("imagetoollab"):
            return {"@id": f"{base_url}/#organization"}
        return {"@type": "Person", "name": name}

    def get_structured_data(self, request):
        page_url = request.build_absolute_uri(self.url)
        base_url = request.build_absolute_uri('/')[:-1]

        image_url = ""
        if self.featured_image:
            image_url = request.build_absolute_uri(self.featured_image.file.url)
        elif self.featured_image_url:
            image_url = self.featured_image_url

        schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Article",
                    "@id": f"{page_url}#article",
                    "isPartOf": {
                        "@type": "WebPage",
                        "@id": page_url
                    },
                    "headline": self.title,
                    "description": self.search_description or self.excerpt,
                    "datePublished": self.published_date.isoformat() if self.published_date else self.first_published_at.isoformat(),
                    "dateModified": self.latest_revision_created_at.isoformat() if self.latest_revision_created_at else timezone.now().isoformat(),
                    "author": self.get_author_schema(base_url),
                    "publisher": {"@id": f"{base_url}/#organization"},
                    "mainEntityOfPage": page_url,
                    "inLanguage": "en-US"
                },
                organization_node(request),
                {
                    "@type": "BreadcrumbList",
                    "@id": f"{page_url}#breadcrumbs",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": base_url
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Blog",
                            "item": f"{base_url}/blog/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": self.title,
                            "item": page_url
                        }
                    ]
                }
            ]
        }

        if image_url:
            schema["@graph"][0]["image"] = image_url

        return mark_safe(json.dumps(schema, indent=2))
