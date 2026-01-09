"""Entité GAS_FILLING_HP_STEP - Remplissage gaz haute pression."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity


class GasFillingHpStepEntity(models.Model):
    """Entité représentant un remplissage gaz haute pression."""

    class Meta:
        app_label = "cible"
        db_table = "GAS_FILLING_HP_STEP"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_version_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_version_id",
        related_name="gas_filling_hp_steps",
        to_field="version_uuid",
    )
    leak_rate_dtri = models.CharField(max_length=200, null=True, blank=True)
    gas_type = models.CharField(max_length=200, null=True, blank=True)
    experiment_pressure = models.FloatField(null=True, blank=True)
    operator = models.CharField(max_length=200, null=True, blank=True)
    date_of_fulfilment = models.DateField(null=True, blank=True)
    gas_base = models.IntegerField(null=True, blank=True)
    gas_container = models.IntegerField(null=True, blank=True)
    observations = models.TextField(max_length=4000, null=True, blank=True)
