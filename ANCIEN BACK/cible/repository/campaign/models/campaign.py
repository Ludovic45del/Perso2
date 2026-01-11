import uuid

from django.db import models

from cible.repository.campaign.models.referential.campaign_installation import (
    CampaignInstallationEntity,
)
from cible.repository.campaign.models.referential.campaign_status import (
    CampaignStatusEntity,
)
from cible.repository.campaign.models.referential.campaign_type import (
    CampaignTypeEntity,
)


class CampaignEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "CAMPAIGN"
        unique_together = ("name", "year", "semester")
        verbose_name_plural = "Campaigns"

    def __str__(self):
        return f"{self.year}-{self.installation}_{self.name}"

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    type = models.ForeignKey(CampaignTypeEntity, on_delete=models.CASCADE)
    status = models.ForeignKey(CampaignStatusEntity, on_delete=models.CASCADE)
    installation = models.ForeignKey(
        CampaignInstallationEntity, on_delete=models.CASCADE
    )

    name = models.CharField(max_length=50)
    year = models.IntegerField()
    semester = models.CharField(choices=[("S1", "S1"), ("S2", "S2")], max_length=2)
    last_updated = models.DateTimeField(auto_now=True)
    start_date = models.DateField(default=None, blank=True, null=True)
    end_date = models.DateField(default=None, blank=True, null=True)
    dtri_number = models.IntegerField(default=None, blank=True, null=True)
    description = models.TextField(max_length=4000, blank=True, null=True)
