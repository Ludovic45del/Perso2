import uuid

from django.db import models


class TransfersEntity(models.Model):
    class Meta:
        app_label = "cible"
        db_table = "STOCKS_TRANSFERS"
        verbose_name_plural = "Stock_Transfers"

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    equipment = models.CharField(max_length=100, blank=True, null=True)
    equipment_type = models.CharField(max_length=100, blank=True, null=True)
    initial_stock = models.CharField(max_length=100, blank=True, null=True)
    units = models.CharField(max_length=100, blank=True, null=True)
    current_stock = models.CharField(max_length=100, blank=True, null=True)
    entry_date = models.DateField(default=None, blank=True, null=True)
    exit_date = models.DateField(default=None, blank=True, null=True)
    date = models.DateField(default=None, blank=True, null=True)
    additional_comment = models.CharField(max_length=400, blank=True, null=True)
