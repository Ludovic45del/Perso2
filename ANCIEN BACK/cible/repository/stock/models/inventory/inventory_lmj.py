import uuid

from django.db import models


class InventoryLmjEntity(models.Model):

    class Meta:
        app_label = "cible"
        db_table = "STOCKS_INVENTORY_LMJ"
        verbose_name_plural = "Stocks_Inventory_LMJ"

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    iec = models.CharField(max_length=100, blank=True, null=True)
    elements_or_target_description = models.CharField(
        max_length=100, blank=True, null=True
    )
    digits_if_untagged_element = models.CharField(max_length=100, blank=True, null=True)
    targets_or_element_number = models.CharField(max_length=100, blank=True, null=True)
    box_number_or_box_description = models.CharField(
        max_length=100, blank=True, null=True
    )
    localisation = models.CharField(max_length=100, blank=True, null=True)
    delivery_date = models.DateField(default=None, blank=True, null=True)
    exit_date = models.DateField(default=None, blank=True, null=True)
    campaign_dtri_number = models.CharField(max_length=100, blank=True, null=True)
    additional_comment = models.CharField(max_length=400, blank=True, null=True)
    fsec = models.CharField(max_length=100, blank=True, null=True)
