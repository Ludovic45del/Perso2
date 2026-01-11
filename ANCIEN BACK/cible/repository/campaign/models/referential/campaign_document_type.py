from django.db import models


class CampaignDocumentTypeEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "CAMPAIGN_DOCUMENT_TYPES"
        verbose_name_plural = "Campaign_Document_Types"

    def __str__(self):
        return f"{self.label}"

    objects = models.Manager()

    id = models.IntegerField(primary_key=True, editable=False)
    label = models.CharField(max_length=40)
