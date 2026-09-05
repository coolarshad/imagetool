import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from wagtail.models import Site, Page
from core.models import HomePage, ToolPage, StandardPage, SEOSettings
from blog.models import BlogIndexPage, BlogPage

User = get_user_model()

class Command(BaseCommand):
    help = "Seed database with ImageToolLab v2 pages, tools, blog, company pages, and SEO settings."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("🚀 Starting ImageToolLab v2 Database Seeding..."))

        # 1. Create Superuser if not exists
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@imagetoollab.com", "admin123")
            self.stdout.write(self.style.SUCCESS("✓ Superuser created: admin / admin123"))

        # 2. Get Root Page
        root = Page.get_first_root_node()
        if not root:
            self.stdout.write(self.style.ERROR("Root node not found!"))
            return

        # 3. Clean up default welcome page if present
        default_home = Page.objects.filter(slug="home", depth=2).first()
        if default_home and not isinstance(default_home.specific, HomePage):
            default_home.delete()

        # Re-fetch root from DB to ensure treebeard state is consistent
        root = Page.objects.get(id=1)

        # Check if our custom HomePage already exists
        home = HomePage.objects.first()
        if not home:
            home = HomePage(
                title="ImageToolLab - Free Online Image Editor",
                slug="home",
                hero_badge="Professional Image Suite",
                headline="Resize & Edit Your Images Online",
                subheadline="The ultimate online image editor. Fast, secure, and free. All processing happens locally in your browser, ensuring your privacy is never compromised.",
                why_choose_title="Why choose ImageToolLab?",
                why_choose_text="Experience the pinnacle of browser-based image editing. We combine high-performance processing with an uncompromising commitment to your privacy.",
                benefits=[
                    ('benefit', {'title': '100% Client-Side Privacy', 'description': 'Your photos never leave your device.'}),
                    ('benefit', {'title': 'Zero Upload Latency', 'description': 'Instant processing with zero wait times.'}),
                    ('benefit', {'title': 'Lossless Resampling Engine', 'description': 'Maintain crisp clarity and exact pixel aspect ratios.'}),
                    ('benefit', {'title': 'Free & Unlimited Use', 'description': 'No subscriptions, watermarks, or limits.'}),
                ],
                steps=[
                    ('step', {'step_number': '01', 'title': 'Import', 'description': 'Drag your high-resolution assets into our secure workspace or paste from clipboard.'}),
                    ('step', {'step_number': '02', 'title': 'Refine', 'description': 'Apply professional-grade transformations, crop, compression, watermark, and filters with real-time feedback.'}),
                    ('step', {'step_number': '03', 'title': 'Export', 'description': 'Download your optimized masterpiece in PNG, JPG, WEBP, or any chosen format instantly.'}),
                ],
                faqs=[
                    ('faq', {'question': 'Are my images uploaded to any server?', 'answer': '<p>No! All image processing happens locally in your browser using JavaScript and Canvas APIs. Your photos never leave your device.</p>'}),
                    ('faq', {'question': 'Is ImageToolLab free to use?', 'answer': '<p>Yes, ImageToolLab is 100% free with no subscriptions, watermarks, or file limits.</p>'}),
                    ('faq', {'question': 'What image formats are supported?', 'answer': '<p>We support PNG, JPG, JPEG, WEBP, BMP, GIF, and TIFF for reading, converting, and downloading.</p>'}),
                    ('faq', {'question': 'Can I edit large high-resolution photos?', 'answer': '<p>Yes! ImageToolLab utilizes your browser’s hardware acceleration and Canvas memory to process high-resolution photography without lag.</p>'}),
                ],
                search_description="The ultimate online image editor. Fast, secure, and free. All processing happens locally in your browser, ensuring your privacy is never compromised.",
                seo_title="ImageToolLab - Free Online Image Editor & Privacy Suite",
            )
            root.add_child(instance=home)
            home.save_revision().publish()
            self.stdout.write(self.style.SUCCESS("✓ Seeded HomePage"))
        else:
            self.stdout.write("✓ HomePage already exists")

        # 4. Set Wagtail Site
        site = Site.objects.filter(is_default_site=True).first()
        if not site:
            site = Site.objects.create(
                hostname="localhost",
                port=8000,
                site_name="ImageToolLab",
                root_page=home,
                is_default_site=True,
            )
        else:
            site.root_page = home
            site.site_name = "ImageToolLab"
            site.save()
        self.stdout.write(self.style.SUCCESS("✓ Configured default Wagtail Site"))

        # 5. Seed All 10 Tools
        tools_data = [
            {
                "type": "resize",
                "slug": "resize-image",
                "title": "Resize Image",
                "headline": "Resize Your Images Online",
                "subheadline": "Easily resize your images to any dimension or percentage. Perfect for social media, websites, and email attachments.",
                "benefits": ["Maintain aspect ratio", "Percentage-based scaling", "High-quality resampling", "Fast local processing"],
                "seo_title": "Free Online Image Resizer - Resize Images Without Losing Quality",
                "seo_desc": "Easily resize photos and images online to exact dimensions or percentage scaling. Free, fast, and 100% private in-browser resizing.",
            },
            {
                "type": "crop",
                "slug": "crop-image",
                "title": "Crop Image",
                "headline": "Crop Images with Precision",
                "subheadline": "Remove unwanted areas and focus on what matters. Our intuitive cropping tool makes it easy to get the perfect frame.",
                "benefits": ["Free-form cropping", "Aspect ratio presets", "Real-time preview", "Lossless quality"],
                "seo_title": "Online Image Cropper - Crop Photos with Precision",
                "seo_desc": "Crop photos and pictures online with custom aspect ratio presets. Fast, free, and secure in-browser image crop tool.",
            },
            {
                "type": "compress",
                "slug": "compress-image",
                "title": "Compress Image",
                "headline": "Compress Images Without Quality Loss",
                "subheadline": "Reduce file size while maintaining visual clarity. Optimize your images for faster web loading and storage efficiency.",
                "benefits": ["Target size in KB/MB", "Quality-based compression", "Bulk-ready processing", "Browser-side optimization"],
                "seo_title": "Compress Images Online - Reduce Image File Size Fast",
                "seo_desc": "Reduce image size in KB or MB with adaptive compression. Optimize JPG, PNG, and WEBP for website performance.",
            },
            {
                "type": "convert",
                "slug": "convert-image",
                "title": "Convert Image",
                "headline": "Convert Images to Any Format",
                "subheadline": "Switch between PNG, JPG, WEBP, BMP, GIF, and TIFF instantly. Ensure compatibility across all platforms and devices.",
                "benefits": ["Supports 6+ formats", "WEBP optimization", "Fast batch conversion", "Privacy-focused"],
                "seo_title": "Online Image Converter - Convert PNG, JPG, WEBP, GIF",
                "seo_desc": "Convert images between PNG, JPG, WEBP, BMP, and GIF formats instantly in your browser with zero quality degradation.",
            },
            {
                "type": "rotate",
                "slug": "rotate-image",
                "title": "Rotate Image",
                "headline": "Rotate Images to Any Angle",
                "subheadline": "Fix tilted photos or rotate images by 90°, 180°, or any custom angle using our precise rotation slider.",
                "benefits": ["Slider-based control", "Enlarge background option", "90°/180° quick buttons", "No corner clipping"],
                "seo_title": "Rotate Image Online - Custom Angle & 90 Degree Rotation",
                "seo_desc": "Rotate tilted photos or spin images by 90, 180, or custom angles online for free. Fast browser-based photo rotation.",
            },
            {
                "type": "mirror",
                "slug": "mirror-image",
                "title": "Mirror Image",
                "headline": "Mirror and Flip Images",
                "subheadline": "Instantly flip your images horizontally or vertically. Create symmetrical designs or fix orientation issues in seconds.",
                "benefits": ["Horizontal flip", "Vertical flip", "Instant preview", "One-click application"],
                "seo_title": "Mirror & Flip Image Online - Horizontal & Vertical Flip",
                "seo_desc": "Flip images horizontally or vertically online for free. Create mirrored photo reflections instantly.",
            },
            {
                "type": "watermark",
                "slug": "watermark-image",
                "title": "Watermark Image",
                "headline": "Add Watermark to Images",
                "subheadline": "Protect your creative work with custom text watermarks. Adjust opacity, size, and position for the perfect look.",
                "benefits": ["Custom text overlay", "Adjustable opacity", "Flexible positioning", "Real-time preview"],
                "seo_title": "Add Watermark to Image Online - Protect Your Photos",
                "seo_desc": "Add custom text watermarks, logos, and copyright stamps to your photos online for free. Full opacity and placement control.",
            },
            {
                "type": "metadata",
                "slug": "metadata-image",
                "title": "Clean Metadata",
                "headline": "Clean Image Metadata & EXIF",
                "subheadline": "Remove hidden EXIF data like GPS coordinates and camera settings to protect your privacy before sharing.",
                "benefits": ["Strip GPS data", "Remove camera info", "Privacy protection", "One-click cleaning"],
                "seo_title": "Remove EXIF Metadata from Images Online - Privacy Cleaner",
                "seo_desc": "Strip GPS location coordinates, camera models, and private EXIF tags from photos before sharing online.",
            },
            {
                "type": "pixelate",
                "slug": "pixelate-image",
                "title": "Pixelate Image",
                "headline": "Pixelate Images for Privacy or Style",
                "subheadline": "Hide sensitive information or add a retro pixel-art effect to your photos with our adjustable pixelation tool.",
                "benefits": ["Adjustable pixel size", "Privacy protection", "Creative effects", "Real-time adjustment"],
                "seo_title": "Pixelate Image Online - Censor & Blur Photos",
                "seo_desc": "Censor sensitive faces, license plates, or numbers with adjustable pixelation blur. 100% private in-browser.",
            },
            {
                "type": "blackwhite",
                "slug": "blackwhite-image",
                "title": "Black & White Filter",
                "headline": "Black and White Photo Filter",
                "subheadline": "Convert your color photos into stunning monochrome masterpieces. Choose between classic grayscale or high-contrast binary.",
                "benefits": ["Grayscale intensity slider", "Binary threshold control", "Monochrome presets", "Professional results"],
                "seo_title": "Convert Photo to Black and White Online - Monochrome Filter",
                "seo_desc": "Transform color photos into grayscale or high-contrast black and white images online for free.",
            },
        ]

        for data in tools_data:
            existing = ToolPage.objects.filter(tool_type=data["type"]).first()
            if not existing:
                tool_page = ToolPage(
                    title=data["title"],
                    slug=data["slug"],
                    tool_type=data["type"],
                    hero_badge="Professional Image Suite",
                    headline=data["headline"],
                    subheadline=data["subheadline"],
                    benefits=[('benefit', {'title': b, 'description': ''}) for b in data["benefits"]],
                    how_to_steps=[
                        ('step', {'step_number': '01', 'title': 'Upload Image', 'description': 'Upload your image or paste it from clipboard.'}),
                        ('step', {'step_number': '02', 'title': 'Configure Tool', 'description': f'Adjust {data["title"].lower()} parameters with live real-time preview.'}),
                        ('step', {'step_number': '03', 'title': 'Download', 'description': 'Download your processed image instantly in high resolution.'}),
                    ],
                    faqs=[
                        ('faq', {'question': f'Is the {data["title"]} tool free?', 'answer': '<p>Yes, all ImageToolLab tools are completely free to use without limits or subscriptions.</p>'}),
                        ('faq', {'question': 'Are my images secure?', 'answer': '<p>Yes! Image processing happens directly in your browser. Your images are never uploaded to any cloud server.</p>'}),
                    ],
                    seo_title=data["seo_title"],
                    search_description=data["seo_desc"],
                )
                home.add_child(instance=tool_page)
                tool_page.save_revision().publish()
                self.stdout.write(self.style.SUCCESS(f"✓ Seeded ToolPage: {data['slug']}"))
            else:
                self.stdout.write(f"✓ ToolPage {data['slug']} already exists")

        # 6. Seed Blog Index and Sample Post
        blog_index = BlogIndexPage.objects.first()
        if not blog_index:
            blog_index = BlogIndexPage(
                title="Blog",
                slug="blog",
                headline="Blog & Articles",
                subheadline="Discover tutorials, tips, and insights about image processing, privacy, and web technology.",
                seo_title="Blog & Articles - ImageToolLab",
                search_description="Read our latest articles, tutorials, and tips on image editing, web performance, and digital privacy.",
            )
            home.add_child(instance=blog_index)
            blog_index.save_revision().publish()
            self.stdout.write(self.style.SUCCESS("✓ Seeded BlogIndexPage: /blog/"))

        # Seed Sample Article
        article_slug = "how-to-resize-images-without-losing-quality"
        if not BlogPage.objects.filter(slug=article_slug).exists():
            article = BlogPage(
                title="How to Resize Images Without Losing Quality",
                slug=article_slug,
                published_date=timezone.now().date(),
                author="ImageToolLab Editorial Team",
                featured_image_url="https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=1200&auto=format&fit=crop",
                excerpt="Learn the secrets of maintaining crisp, high-resolution images even when scaling them down for your website or social media. We cover aspect ratios, algorithms, and more.",
                body=[
                    ('rich_text', '<p>Resizing images is a common task, but doing it without losing quality can be tricky. Whether you are preparing photos for a website, a presentation, or social media, maintaining clarity is crucial.</p><h2>Understanding Aspect Ratios</h2><p>The most important rule of resizing is to maintain the original aspect ratio. If you change the width without proportionally changing the height, your image will stretch and distort.</p><h2>Interpolation Algorithms</h2><p>When you resize an image, the software has to calculate what the new pixels should look like. Bicubic and Lanczos resampling deliver the sharpest results for high-resolution graphics.</p><h2>Why Browser-Side Processing is Better</h2><p>Traditionally, resizing required uploading your images to a server. This is slow and raises privacy concerns. With ImageToolLab, resizing happens entirely in your browser using the HTML5 Canvas API. This means zero upload time and 100% privacy.</p>'),
                    ('callout', {'type': 'tip', 'title': 'Pro Tip', 'text': '<p>Always keep a backup of your original high-resolution master file before resizing or compressing!</p>'}),
                ],
                seo_title="How to Resize Images Without Losing Quality - Guide",
                search_description="Learn the secrets of maintaining crisp, high-resolution images even when scaling them down for your website or social media.",
            )
            blog_index.add_child(instance=article)
            article.save_revision().publish()
            self.stdout.write(self.style.SUCCESS(f"✓ Seeded BlogPage: {article_slug}"))

        # 7. Seed Standard Company Pages
        company_pages = [
            {
                "title": "About Us",
                "slug": "about",
                "icon": "users",
                "subtitle": "Mission & Philosophy",
                "show_mission": True,
                "show_contact": False,
                "body": [
                    ('rich_text', '<p>ImageToolLab was born out of a simple observation: most online image editing tools are either too complex, filled with intrusive ads, or compromise user privacy by uploading sensitive data to remote servers.</p><p>We decided to build a better alternative. A tool that is powerful yet simple, beautiful yet functional, and most importantly, 100% private.</p><h2>Our Mission</h2><p>Our mission is to democratize high-quality image editing. We believe that everyone should have access to professional-grade tools without having to worry about their privacy or paying expensive subscriptions.</p>'),
                ],
                "seo_title": "About Us - ImageToolLab",
                "seo_desc": "Learn more about ImageToolLab's mission to provide fast, secure, and completely private browser-based image editing tools."
            },
            {
                "title": "Privacy Policy",
                "slug": "privacy",
                "icon": "shield",
                "subtitle": "Your Data Privacy is Guaranteed",
                "show_mission": False,
                "show_contact": False,
                "body": [
                    ('callout', {'type': 'success', 'title': '100% Local Execution', 'text': '<p>At ImageToolLab, your privacy is our core philosophy. Because our application runs entirely inside your web browser, we do not collect, store, or transmit any of the images you edit.</p>'}),
                    ('rich_text', '<h2>1. Data Collection</h2><p>We do not collect any personally identifiable information (PII). We do not use tracking cookies to follow you across the web.</p><h2>2. Image Processing</h2><p>All image processing is performed locally on your device using JavaScript and the Canvas API. When you select an image, it is simply loaded into your browser’s memory. It is never sent to our servers or any third-party service.</p><h2>3. Third-Party CDNs</h2><p>We may use third-party CDNs to serve our application’s code and assets. These providers do not have access to the images you process.</p>'),
                ],
                "seo_title": "Privacy Policy - ImageToolLab",
                "seo_desc": "Read the ImageToolLab Privacy Policy. Discover how we protect your data by processing images entirely inside your browser without external servers."
            },
            {
                "title": "Terms of Service",
                "slug": "terms",
                "icon": "file-text",
                "subtitle": "Usage Agreement",
                "show_mission": False,
                "show_contact": False,
                "body": [
                    ('rich_text', '<p>By using ImageToolLab, you agree to the following terms. Please read them carefully.</p><h2>1. Use of Service</h2><p>ImageToolLab is provided "as is" and "as available". You are free to use our tools for personal or commercial purposes. You are responsible for ensuring you have the rights to the images you edit.</p><h2>2. Prohibited Activities</h2><p>You may not use ImageToolLab to process illegal content or engage in activities that violate the rights of others.</p><h2>3. Limitation of Liability</h2><p>ImageToolLab and its creators shall not be liable for any damages arising from the use or inability to use our services.</p>'),
                ],
                "seo_title": "Terms of Service - ImageToolLab",
                "seo_desc": "Review the Terms of Service for using ImageToolLab."
            },
            {
                "title": "Contact Us",
                "slug": "contact",
                "icon": "mail",
                "subtitle": "Get in touch with the ImageToolLab team",
                "show_mission": False,
                "show_contact": True,
                "body": [
                    ('rich_text', '<p>Have a question, feedback, or a feature request? We’d love to hear from you! Since ImageToolLab is a community-driven project, your input is invaluable.</p><h2>Open Source</h2><p>ImageToolLab is an open-source project. If you are a developer and want to contribute or report a bug, please visit our GitHub repository.</p>'),
                ],
                "seo_title": "Contact Us - ImageToolLab",
                "seo_desc": "Get in touch with the ImageToolLab team. Reach out via email or connect with us on social media for support and feedback."
            },
        ]

        for pdata in company_pages:
            existing = StandardPage.objects.filter(slug=pdata["slug"]).first()
            if not existing:
                spage = StandardPage(
                    title=pdata["title"],
                    slug=pdata["slug"],
                    icon_type=pdata["icon"],
                    subtitle=pdata["subtitle"],
                    show_mission_cards=pdata["show_mission"],
                    show_contact_cards=pdata["show_contact"],
                    body=pdata["body"],
                    seo_title=pdata["seo_title"],
                    search_description=pdata["seo_desc"],
                )
                home.add_child(instance=spage)
                spage.save_revision().publish()
                self.stdout.write(self.style.SUCCESS(f"✓ Seeded StandardPage: {pdata['slug']}"))
            else:
                self.stdout.write(f"✓ StandardPage {pdata['slug']} already exists")

        # 8. Configure SEOSettings
        seo_settings = SEOSettings.for_site(site)
        seo_settings.site_title = "ImageToolLab - Free Online Image Editor & Privacy Suite"
        seo_settings.site_tagline = "Fast, secure, and private browser-based image editing tools."
        seo_settings.default_meta_description = "The ultimate online image editor. Fast, secure, and free. All processing happens locally in your browser, ensuring your privacy is never compromised."
        seo_settings.twitter_handle = "@ImageToolLab"
        seo_settings.save()
        self.stdout.write(self.style.SUCCESS("✓ Configured Global SEOSettings"))

        self.stdout.write(self.style.SUCCESS("\n🎉 ImageToolLab v2 database seeding completed successfully!"))
