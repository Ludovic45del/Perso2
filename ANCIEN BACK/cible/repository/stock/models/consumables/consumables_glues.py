import uuid

from django.db import models


class ConsumablesGluesEntity(models.Model):

    class Meta:
        app_label = "cible"
        db_table = "STOCKS_CONSUMABLES_GLUES"
        verbose_name_plural = "Stocks_Consumables_Glues"

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.CharField(max_length=100, blank=True, null=True)
    stocks = models.CharField(max_length=100, blank=True, null=True)
    unit = models.CharField(max_length=100, blank=True, null=True)
    reference = models.CharField(max_length=100, blank=True, null=True)
    buying_type = models.CharField(max_length=100, blank=True, null=True)
    supplier = models.CharField(max_length=100, blank=True, null=True)
    expiry_date = models.DateField(default=None, blank=True, null=True)
    additional_comment = models.CharField(max_length=400, blank=True, null=True)
