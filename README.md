# ImageToolLab v2 - Wagtail CMS & Mobile-First Privacy Suite

High-performance, mobile-first online image editing suite powered by **Wagtail CMS (Django 5.x + Wagtail 6.x)** with 100% Server-Side Rendered (SSR) semantic HTML, automated XML sitemaps, structured Schema.org JSON-LD data, and in-browser Canvas API image processing.

---

## 🌟 Key Features in v2

- **Wagtail CMS Backend (`/admin/`)**: Complete editorial control over tool pages, hero sections, SEO metadata, FAQs, step-by-step guides, and blog articles.
- **100% SEO & Google Search Console Indexability**:
  - Pure Server-Side Rendered (SSR) HTML for instant crawler visibility.
  - Native dynamic XML sitemap at `/sitemap.xml`.
  - Dynamic `/robots.txt` crawler configuration.
  - Schema.org JSON-LD structured data (`SoftwareApplication`, `HowTo`, `FAQPage`, `Article`, `BreadcrumbList`, `WebSite`).
  - Open Graph and Twitter Card social metadata.
- **Full In-Browser Image Suite (Zero Server Uploads)**:
  1. **Resize Image**: Aspect ratio lock, pixel scaling, percentage scaling (10-300%).
  2. **Crop Image**: Interactive touch & mouse draggable crop box with presets (`Free`, `1:1`, `16:9`, `4:3`, `3:2`, `9:16`).
  3. **Compress Image**: Quality control slider (5-100%) and adaptive size optimization.
  4. **Convert Format**: Seamless format switching (`PNG`, `JPG`, `WEBP`, `BMP`, `GIF`, `TIFF`).
  5. **Rotate Image**: Angle slider (-180° to +180°) and quick 90°/180°/270° orientation buttons.
  6. **Mirror Image**: Horizontal & vertical reflections.
  7. **Watermark Image**: Custom text overlay, opacity control, and 5-position placement grid.
  8. **Clean Metadata (EXIF)**: One-click GPS and camera metadata stripper.
  9. **Pixelate / Censor**: Adjustable pixel block size slider (2px to 60px).
  10. **Black & White Filter**: Grayscale intensity slider and high-contrast binary threshold filter.
- **Undo / Redo History**: Up to 20 states with automatic URL memory recycling.
- **Mobile-First Responsive Design**: Preserves and upgrades the v1 emerald/teal aesthetics, glassmorphism cards, Inter typography, and touch-optimized controls.

---

## 🚀 Getting Started

### 1. Activate Virtual Environment
```bash
source .venv/bin/activate
```

### 2. Run Database Migrations
```bash
python manage.py migrate
```

### 3. Seed Database with All Pages, Tools, and SEO Settings
```bash
python manage.py seed_v2
```

### 4. Start Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```

- **Main Application**: [http://localhost:8000/](http://localhost:8000/)
- **Wagtail CMS Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)
  - **Username**: `admin`
  - **Password**: `admin123`
- **Dynamic XML Sitemap**: [http://localhost:8000/sitemap.xml](http://localhost:8000/sitemap.xml)
- **Robots.txt**: [http://localhost:8000/robots.txt](http://localhost:8000/robots.txt)

---

## 🧪 Running Tests

```bash
python manage.py test
```
