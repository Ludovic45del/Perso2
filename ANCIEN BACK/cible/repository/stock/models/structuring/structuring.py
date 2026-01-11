import uuid

from django.db import models


class StructuringEntity(models.Model):

    class Meta:
        app_label = "cible"
        db_table = "STOCKS_STRUCTURING"
        verbose_name_plural = "Stocks_Structuring"

    objects = models.Manager()

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    who = models.CharField(max_length=100, blank=True, null=True)
    fulfillment_date = models.DateField(default=None, blank=True, null=True)
    structuring_number = models.CharField(max_length=100, blank=True, null=True)
    pams_number = models.CharField(max_length=100, blank=True, null=True)
    localisation = models.CharField(max_length=100, blank=True, null=True)
    fsec = models.CharField(max_length=100, blank=True, null=True)
    usage_date = models.DateField(default=None, blank=True, null=True)
    comments = models.TextField(max_length=4000, blank=True, null=True)
    additional_comment = models.CharField(max_length=400, blank=True, null=True)
