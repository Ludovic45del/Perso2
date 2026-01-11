import uuid

from django.db import models


class InventoryBasicPartsCatalogEntity(models.Model):
    objects = models.Manager()

    class Meta:
        app_label = "cible"
        db_table = "STOCKS_INVENTORY_BASIC_PARTS"
        verbose_name_plural = "Stocks_Basic_parts_catalog"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    element_name = models.CharField(max_length=100, blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True, null=True)
    box_number_or_box_description = models.CharField(
        max_length=100, blank=True, null=True
    )
    delivery_date = models.DateField(default=None, blank=True, null=True)
    exit_date = models.DateField(default=None, blank=True, null=True)
    used_campaign = models.CharField(max_length=100, blank=True, null=True)
    additional_comment = models.CharField(max_length=400, blank=True, null=True)
    fsec = models.CharField(max_length=100, blank=True, null=True)
