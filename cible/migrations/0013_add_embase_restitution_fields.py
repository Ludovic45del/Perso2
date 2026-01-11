"""Migration pour ajouter les champs embase et restitution_date à FSEC."""
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cible', '0012_assemblystepentity_completed_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='fsecentity',
            name='embase',
            field=models.CharField(
                max_length=100,
                null=True,
                blank=True,
                help_text='Embase/Interface (Sealing Step)'
            ),
        ),
        migrations.AddField(
            model_name='fsecentity',
            name='restitution_date',
            field=models.DateField(
                null=True,
                blank=True,
                help_text='Date de restitution du FSEC'
            ),
        ),
    ]
