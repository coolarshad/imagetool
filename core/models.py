import json
from django.db import models
from django.utils.html import mark_safe
from wagtail.models import Page
from wagtail.fields import StreamField, RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting
from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock

from .blocks import BenefitBlock, StepBlock, FAQBlock, FeatureCardBlock, CalloutBlock


class HomePage(Page):
    max_count = 1
    subpage_types = ['core.ToolPage', 'core.StandardPage', 'blog.BlogIndexPage']

    hero_badge = models.CharField(
        max_length=100, 
        default="Professional Image Suite", 
        help_text="Small pill badge displayed above hero title"
    )
    headline = models.CharField(
        max_length=200, 
        default="Resize & Edit Your Images Online", 
        help_text="Main H1 heading"
    )
    subheadline = models.TextField(
        default="Easily resize, crop, convert, compress, and enhance your images directly in your web browser. 100% private, ultra-fast, and completely free."
    )
    
    # Value proposition
    why_choose_title = models.CharField(max_length=200, default="Why choose ImageToolLab?")
    why_choose_text = models.TextField(
        default="Experience the pinnacle of browser-based image editing. We combine high-performance processing with an uncompromising commitment to your privacy."
    )
    benefits = StreamField([
        ('benefit', BenefitBlock()),
    ], use_json_field=True, blank=True, null=True)

    steps = StreamField([
        ('step', StepBlock()),
    ], use_json_field=True, blank=True, null=True)

    faqs = StreamField([
        ('faq', FAQBlock()),
    ], use_json_field=True, blank=True, null=True)

    # SEO & Social
    canonical_url = models.CharField(max_length=255, blank=True, help_text="Override canonical URL (optional)")
    og_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Social sharing preview image (1200x630 recommended)"
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('hero_badge'),
            FieldPanel('headline'),
            FieldPanel('subheadline'),
        ], heading="Hero Section"),
        MultiFieldPanel([
            FieldPanel('why_choose_title'),
            FieldPanel('why_choose_text'),
            FieldPanel('benefits'),
        ], heading="Why Choose Section"),
        FieldPanel('steps'),
        FieldPanel('faqs'),
    ]

    promote_panels = Page.promote_panels + [
        MultiFieldPanel([
            FieldPanel('canonical_url'),
            FieldPanel('og_image'),
        ], heading="Advanced SEO & Social Sharing")
    ]

    def get_structured_data(self, request):
        base_url = request.build_absolute_uri('/')[:-1]
        schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": f"{base_url}/#website",
                    "url": base_url,
                    "name": "ImageToolLab",
                    "description": self.search_description or self.subheadline,
                    "inLanguage": "en-US"
                },
                {
                    "@type": "SoftwareApplication",
                    "@id": f"{base_url}/#application",
                    "name": "ImageToolLab Online Image Editor",
                    "applicationCategory": "DesignApplication",
                    "operatingSystem": "All modern web browsers",
                    "url": base_url,
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "description": self.search_description or self.subheadline
                }
            ]
        }

        # Add FAQ schema if faqs exist
        if self.faqs:
            faq_items = []
            for block in self.faqs:
                if block.block_type == 'faq':
                    faq_items.append({
                        "@type": "Question",
                        "name": str(block.value['question']),
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": str(block.value['answer'])
                        }
                    })
            if faq_items:
                schema["@graph"].append({
                    "@type": "FAQPage",
                    "@id": f"{base_url}/#faq",
                    "mainEntity": faq_items
                })

        return mark_safe(json.dumps(schema, indent=2))


class ToolPage(Page):
    parent_page_types = ['core.HomePage']
    subpage_types = []

    TOOL_CHOICES = [
        ('resize', 'Resize Image'),
        ('crop', 'Crop Image'),
        ('mirror', 'Mirror & Flip Image'),
        ('rotate', 'Rotate Image'),
        ('compress', 'Compress Image'),
        ('convert', 'Convert Format'),
        ('watermark', 'Add Watermark'),
        ('metadata', 'Clean EXIF Metadata'),
        ('pixelate', 'Pixelate / Blur'),
        ('blackwhite', 'Black & White Filter'),
    ]

    tool_type = models.CharField(
        max_length=30, 
        choices=TOOL_CHOICES, 
        unique=True,
        help_text="Select which tool functionality to render on this page"
    )
    hero_badge = models.CharField(
        max_length=100, 
        default="Professional Image Suite", 
        help_text="Small badge above the H1 title"
    )
    headline = models.CharField(max_length=200, help_text="Main H1 heading")
    subheadline = models.TextField(help_text="Introductory text under H1")

    benefits = StreamField([
        ('benefit', BenefitBlock()),
    ], use_json_field=True, blank=True, null=True)

    how_to_steps = StreamField([
        ('step', StepBlock()),
    ], use_json_field=True, blank=True, null=True)

    faqs = StreamField([
        ('faq', FAQBlock()),
    ], use_json_field=True, blank=True, null=True)

    editorial_content = StreamField([
        ('rich_text', blocks.RichTextBlock()),
        ('callout', CalloutBlock()),
        ('features', FeatureCardBlock()),
    ], use_json_field=True, blank=True, null=True, help_text="Additional in-depth guides and content for SEO ranking")

    canonical_url = models.CharField(max_length=255, blank=True, help_text="Override canonical URL (optional)")
    og_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Social sharing preview image"
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('tool_type'),
            FieldPanel('hero_badge'),
            FieldPanel('headline'),
            FieldPanel('subheadline'),
        ], heading="Tool & Header Configuration"),
        FieldPanel('benefits'),
        FieldPanel('how_to_steps'),
        FieldPanel('faqs'),
        FieldPanel('editorial_content'),
    ]

    promote_panels = Page.promote_panels + [
        MultiFieldPanel([
            FieldPanel('canonical_url'),
            FieldPanel('og_image'),
        ], heading="SEO & Social Media Meta")
    ]

    def get_structured_data(self, request):
        page_url = request.build_absolute_uri(self.url)
        base_url = request.build_absolute_uri('/')[:-1]

        schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "@id": f"{page_url}#software",
                    "name": self.headline or self.title,
                    "applicationCategory": "DesignApplication",
                    "operatingSystem": "All modern browsers",
                    "url": page_url,
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "description": self.search_description or self.subheadline
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

        # Add HowTo schema if steps exist
        if self.how_to_steps:
            steps_items = []
            for i, block in enumerate(self.how_to_steps, 1):
                if block.block_type == 'step':
                    steps_items.append({
                        "@type": "HowToStep",
                        "position": i,
                        "name": str(block.value['title']),
                        "text": str(block.value['description'])
                    })
            if steps_items:
                schema["@graph"].append({
                    "@type": "HowTo",
                    "@id": f"{page_url}#howto",
                    "name": f"How to {self.title}",
                    "description": self.subheadline,
                    "step": steps_items
                })

        # Add FAQ schema if faqs exist
        if self.faqs:
            faq_items = []
            for block in self.faqs:
                if block.block_type == 'faq':
                    faq_items.append({
                        "@type": "Question",
                        "name": str(block.value['question']),
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": str(block.value['answer'])
                        }
                    })
            if faq_items:
                schema["@graph"].append({
                    "@type": "FAQPage",
                    "@id": f"{page_url}#faq",
                    "mainEntity": faq_items
                })

        return mark_safe(json.dumps(schema, indent=2))


class StandardPage(Page):
    parent_page_types = ['core.HomePage']
    subpage_types = []

    ICON_CHOICES = [
        ('users', 'Users (About)'),
        ('shield', 'Shield (Privacy)'),
        ('file-text', 'File Text (Terms)'),
        ('mail', 'Mail (Contact)'),
        ('globe', 'Globe (General)'),
    ]

    icon_type = models.CharField(max_length=20, choices=ICON_CHOICES, default='globe')
    subtitle = models.CharField(max_length=255, blank=True)
    body = StreamField([
        ('rich_text', blocks.RichTextBlock()),
        ('callout', CalloutBlock()),
        ('features', FeatureCardBlock()),
        ('faq', FAQBlock()),
    ], use_json_field=True, blank=True, null=True)

    show_contact_cards = models.BooleanField(default=False, help_text="Display email and social media cards")
    show_mission_cards = models.BooleanField(default=False, help_text="Display Blazing Fast & Privacy First highlight boxes")

    canonical_url = models.CharField(max_length=255, blank=True)
    og_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
    )

    content_panels = Page.content_panels + [
        FieldPanel('icon_type'),
        FieldPanel('subtitle'),
        FieldPanel('body'),
        MultiFieldPanel([
            FieldPanel('show_contact_cards'),
            FieldPanel('show_mission_cards'),
        ], heading="Special Card Modules"),
    ]

    promote_panels = Page.promote_panels + [
        MultiFieldPanel([
            FieldPanel('canonical_url'),
            FieldPanel('og_image'),
        ], heading="SEO Meta")
    ]

    def get_structured_data(self, request):
        page_url = request.build_absolute_uri(self.url)
        base_url = request.build_absolute_uri('/')[:-1]

        schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebPage",
                    "@id": f"{page_url}#webpage",
                    "url": page_url,
                    "name": self.title,
                    "description": self.search_description or self.subtitle
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


@register_setting
class SEOSettings(BaseSiteSetting):
    site_title = models.CharField(max_length=100, default="ImageToolLab - Free Online Image Editor")
    site_tagline = models.CharField(max_length=255, default="Fast, secure, and private browser-based image editing tools.")
    default_meta_description = models.TextField(
        default="The ultimate online image editor. Fast, secure, and free. All processing happens locally in your browser, ensuring your privacy is never compromised."
    )
    google_site_verification = models.CharField(max_length=255, blank=True, help_text="Google Search Console verification token")
    google_analytics_id = models.CharField(max_length=50, blank=True, help_text="e.g. G-XXXXXXXXXX")
    twitter_handle = models.CharField(max_length=50, default="@ImageToolLab")
    default_og_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Default image used when sharing on Facebook, Twitter, LinkedIn"
    )

    panels = [
        MultiFieldPanel([
            FieldPanel('site_title'),
            FieldPanel('site_tagline'),
            FieldPanel('default_meta_description'),
        ], heading="General Meta"),
        MultiFieldPanel([
            FieldPanel('google_site_verification'),
            FieldPanel('google_analytics_id'),
            FieldPanel('twitter_handle'),
            FieldPanel('default_og_image'),
        ], heading="Verification & Social"),
    ]
