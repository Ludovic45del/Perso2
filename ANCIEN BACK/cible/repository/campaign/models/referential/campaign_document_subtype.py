from django.db import models

from cible.repository.campaign.models.referential.campaign_document_type import (
    CampaignDocumentTypeEntity,
)


class CampaignDocumentSubtypeEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "CAMPAIGN_DOCUMENT_SUBTYPES"
        verbose_name_plural = "Campaign_Document_Subtypes"

    def __str__(self):
        return f"{self.label}"

    objects = models.Manager()

    id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=40)
    type = models.ForeignKey(
        CampaignDocumentTypeEntity, on_delete=models.CASCADE, related_name="subtypes"
    )
