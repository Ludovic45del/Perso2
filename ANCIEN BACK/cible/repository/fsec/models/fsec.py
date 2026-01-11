import uuid

from django.db import models

from cible.repository.campaign.models.campaign import CampaignEntity
from cible.repository.fsec.models.referential.fsec_category import FsecCategoryEntity
from cible.repository.fsec.models.referential.fsec_rack import FsecRackEntity
from cible.repository.fsec.models.referential.fsec_status import FsecStatusEntity


class FsecEntity(models.Model):

    class Meta:
        app_label = "cible"
        db_table = "FSEC"
        verbose_name_plural = "Fsecs"
        unique_together = ("campaign", "name")

    def __str__(self):
        return f"{self.campaign.year}-{self.campaign.installation}_{self.name}"

    objects = models.Manager()

    version_uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    fsec_uuid = models.UUIDField(default=uuid.uuid4, editable=False)

    campaign = models.ForeignKey(
        CampaignEntity, on_delete=models.SET_NULL, null=True, blank=True
    )
    status = models.ForeignKey(FsecStatusEntity, on_delete=models.CASCADE)
    category = models.ForeignKey(FsecCategoryEntity, on_delete=models.CASCADE)
    rack = models.ForeignKey(
        FsecRackEntity, on_delete=models.CASCADE, blank=True, null=True
    )
    last_updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # DESIGN STEP FIELDS
    name = models.CharField(max_length=50)
    comments = models.TextField(max_length=4000, blank=True, null=True)

    # USABLE FIELDS
    delivery_date = models.DateField(blank=True, null=True)

    # INSTALLATION FIELDS
    shooting_date = models.DateField(blank=True, null=True)
    preshooting_pressure = models.FloatField(blank=True, null=True)
    experience_srxx = models.CharField(max_length=50, blank=True, null=True)

    # SHOT FIELDS
    localisation = models.CharField(max_length=20, blank=True, null=True)

    depressurization_failed = models.BooleanField(default=False, null=True)
