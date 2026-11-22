from django.core.management.base import BaseCommand

from core.models import ToolPage
from core.seo_content import TOOL_CONTENT


class Command(BaseCommand):
    help = (
        "Replace the templated how-to steps, FAQs, editorial content and meta descriptions "
        "on each ToolPage with the tool-specific copy in core/seo_content.py, then publish."
    )

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Show what would change without saving.")
        parser.add_argument("--tool", action="append", help="Only update this tool_type (repeatable).")

    def handle(self, *args, dry_run=False, tool=None, **options):
        tools = tool or list(TOOL_CONTENT)
        for tool_type in tools:
            content = TOOL_CONTENT.get(tool_type)
            if content is None:
                self.stderr.write(self.style.ERROR(f"No content defined for tool '{tool_type}'"))
                continue

            page = ToolPage.objects.filter(tool_type=tool_type).first()
            if page is None:
                self.stderr.write(self.style.WARNING(f"No ToolPage with tool_type='{tool_type}' - skipped"))
                continue

            # Work on the latest draft so unpublished editor changes to other fields are kept.
            page = page.get_latest_revision_as_object()
            page.search_description = content["search_description"]
            page.how_to_steps = content["steps"]
            page.faqs = content["faqs"]
            page.editorial_content = content["editorial"]

            words = sum(len(str(v).split()) for v in (content["steps"], content["faqs"], content["editorial"]))
            label = f"{page.url_path.rstrip('/').split('/')[-1]}: {len(content['faqs'])} FAQs, ~{words} words"

            if dry_run:
                self.stdout.write(f"[dry-run] would update {label}")
                continue

            page.save_revision(log_action=True).publish()
            self.stdout.write(self.style.SUCCESS(f"Updated and published {label}"))
