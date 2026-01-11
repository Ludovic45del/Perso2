import uuid

from django.db import models

from cible.repository.campaign.models.campaign import CampaignEntity
from cible.repository.campaign.models.referential.campaign_role import (
    CampaignRoleEntity,
)


class CampaignTeamEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "CAMPAIGN_TEAMS"
        verbose_name_plural = "Campaign_Teams"

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    role = models.ForeignKey(CampaignRoleEntity, on_delete=models.CASCADE, null=True)

    name = models.CharField(max_length=50, null=True)
    campaign_uuid = models.ForeignKey(CampaignEntity, on_delete=models.CASCADE)
