from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock

class BenefitBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, max_length=150, help_text="Short benefit highlight")
    description = blocks.TextBlock(required=False, help_text="Optional detail about this benefit")

    class Meta:
        icon = "tick-inverse"
        label = "Benefit Item"


class StepBlock(blocks.StructBlock):
    step_number = blocks.CharBlock(required=True, max_length=10, default="01", help_text="Step index e.g. 01")
    title = blocks.CharBlock(required=True, max_length=120, help_text="Step title e.g. Import")
    description = blocks.TextBlock(required=True, help_text="Actionable instructions")

    class Meta:
        icon = "list-numbered"
        label = "Process Step"


class FAQBlock(blocks.StructBlock):
    question = blocks.CharBlock(required=True, max_length=255, help_text="Frequently asked question")
    answer = blocks.RichTextBlock(required=True, features=["bold", "italic", "link", "ul", "ol"], help_text="Clear answer to the question")

    class Meta:
        icon = "help"
        label = "FAQ Item"


class FeatureCardBlock(blocks.StructBlock):
    icon_name = blocks.ChoiceBlock(
        choices=[
            ("zap", "Lightning Fast (Zap)"),
            ("lock", "Privacy / Security (Lock)"),
            ("sparkles", "High Quality (Sparkles)"),
            ("globe", "Zero Installation (Globe)"),
            ("shield", "Safety / Clean (Shield)"),
            ("layers", "Batch Ready (Layers)"),
        ],
        default="zap"
    )
    title = blocks.CharBlock(required=True, max_length=120)
    description = blocks.TextBlock(required=True)

    class Meta:
        icon = "cogs"
        label = "Feature Card"


class CalloutBlock(blocks.StructBlock):
    type = blocks.ChoiceBlock(choices=[
        ("info", "Information (Blue/Teal)"),
        ("success", "Success (Emerald)"),
        ("tip", "Pro Tip (Lime)"),
        ("warning", "Note (Amber)"),
    ], default="success")
    title = blocks.CharBlock(required=False, max_length=120)
    text = blocks.RichTextBlock(required=True, features=["bold", "italic", "link", "code"])

    class Meta:
        icon = "info-circle"
        label = "Callout / Alert Box"


class ComparisonTableBlock(blocks.StructBlock):
    """Simple data table (first column is the row label). Good for featured snippets."""
    caption = blocks.CharBlock(required=False, max_length=200, help_text="Shown above the table and used as its caption")
    headers = blocks.ListBlock(blocks.CharBlock(max_length=80), help_text="Column headings")
    rows = blocks.ListBlock(
        blocks.ListBlock(blocks.CharBlock(max_length=200), label="Row cells"),
        help_text="One entry per row; cells in the same order as the headings",
    )

    class Meta:
        icon = "table"
        label = "Comparison Table"
        template = "core/blocks/comparison_table.html"
