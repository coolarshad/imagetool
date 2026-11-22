from django.db import migrations

PROD_HOSTNAME = "imagetoollab.com"
PROD_PORT = 443


def set_hostname(apps, schema_editor):
    """The seeded Wagtail Site was localhost:8000, which made sitemap.xml list
    http://localhost:8000/... URLs. Point the default site at the real domain."""
    Site = apps.get_model("wagtailcore", "Site")
    for site in Site.objects.filter(hostname__in=["localhost", "127.0.0.1"]):
        site.hostname = PROD_HOSTNAME
        site.port = PROD_PORT
        site.is_default_site = True
        site.save()


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
        ("wagtailcore", "0001_initial"),
    ]

    operations = [migrations.RunPython(set_hostname, migrations.RunPython.noop)]
