"""Entité FSEC_TEAMS - Équipes FSEC."""
import uuid

from django.db import models

from cible.repository.fsec.models.fsec_entity import FsecEntity
from cible.repository.fsec.models.fsec_roles_entity import FsecRolesEntity


class StepType(models.TextChoices):
    """Enum des types de steps pour filtrer les teams/documents."""

    DESIGN = "DESIGN", "Design"
    ASSEMBLY = "ASSEMBLY", "Assemblage"
    METROLOGY = "METROLOGY", "Métrologie"
    SEALING = "SEALING", "Scellement"
    PICTURES = "PICTURES", "Photos"
    USABLE = "USABLE", "Utilisable"
    INSTALLED = "INSTALLED", "Installé"


class FsecTeamsEntity(models.Model):
    """Entité représentant les équipes FSEC."""

    class Meta:
        app_label = "cible"
        db_table = "FSEC_TEAMS"

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fsec_id = models.ForeignKey(
        FsecEntity,
        on_delete=models.CASCADE,
        db_column="fsec_id",
        related_name="teams",
        to_field="version_uuid",
    )
    role_id = models.ForeignKey(
        FsecRolesEntity,
        on_delete=models.PROTECT,
        db_column="role_id",
        related_name="team_members",
    )
    name = models.CharField(max_length=50)
    # Nouveaux champs pour liaison par step
    step_type = models.CharField(
        max_length=20,
        choices=StepType.choices,
        default=StepType.DESIGN,
        db_column="step_type",
    )
    step_uuid = models.UUIDField(null=True, blank=True, db_column="step_uuid")

