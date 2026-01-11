# Generated manually
from django.db import migrations
import uuid
from datetime import date

def seed_mixed_files(apps, schema_editor):
    CampaignDocumentSubtypesEntity = apps.get_model('cible', 'CampaignDocumentSubtypesEntity')
    CampaignDocumentsEntity = apps.get_model('cible', 'CampaignDocumentsEntity')
    CampaignEntity = apps.get_model('cible', 'CampaignEntity')

    first_campaign = CampaignEntity.objects.first()
    
    if first_campaign:
        try:
            # Plan PDF uses ID 7 (renamed from CAO.pdf)
            plan_pdf_subtype = CampaignDocumentSubtypesEntity.objects.get(id=7)
            
            files_to_create = [
                'note_synthese.docx',
                'budget_previsionnel.xlsx',
                'guide_utilisateur.pdf'
            ]

            for fname in files_to_create:
                if not CampaignDocumentsEntity.objects.filter(
                    name=fname, 
                    subtype_id=plan_pdf_subtype, 
                    campaign_uuid=first_campaign
                ).exists():
                    CampaignDocumentsEntity.objects.create(
                        uuid=uuid.uuid4(),
                        campaign_uuid=first_campaign,
                        subtype_id=plan_pdf_subtype,
                        file_type_id=None, # File at root of subtype
                        name=fname,
                        path=f'P:\\Test\\{fname}',
                        date=date.today()
                    )

        except CampaignDocumentSubtypesEntity.DoesNotExist:
            print("Subtype Plan PDF (id=7) not found. Skipping mixed files seed.")

def reverse_seed(apps, schema_editor):
    CampaignDocumentsEntity = apps.get_model('cible', 'CampaignDocumentsEntity')
    CampaignDocumentsEntity.objects.filter(name__in=[
        'note_synthese.docx', 'budget_previsionnel.xlsx', 'guide_utilisateur.pdf'
    ]).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('cible', '0006_rename_subtype_seed_doc'),
    ]

    operations = [
        migrations.RunPython(seed_mixed_files, reverse_seed),
    ]
