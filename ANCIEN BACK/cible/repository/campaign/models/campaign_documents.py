import uuid

from django.db import models

from cible.repository.campaign.models.campaign import CampaignEntity
from cible.repository.campaign.models.referential.campaign_document_subtype import (
    CampaignDocumentSubtypeEntity,
)


class CampaignDocumentEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "CAMPAIGN_DOCUMENTS"
        verbose_name_plural = "Campaign_Documents"

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign_uuid = models.ForeignKey(CampaignEntity, on_delete=models.CASCADE)
    subtype = models.ForeignKey(CampaignDocumentSubtypeEntity, on_delete=models.CASCADE)

    name = models.CharField(max_length=50, null=True)
    path = models.CharField(max_length=256, null=True)
    date = models.DateTimeField(default=None, blank=True, null=True)

    @property
    def type(self):
        return self.subtype.type if self.subtype else None
