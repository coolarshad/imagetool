from core.models import ToolPage

def seo_context(request):
    """Provides global navigation and SEO tools to all templates."""
    return {
        'all_tool_pages': ToolPage.objects.live().order_by('id'),
        'current_year': 2026,
    }
