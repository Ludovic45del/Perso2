"""Repository FSEC - Implémentation IFsecRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.fsec.interface.fsec_repository import IFsecRepository
from cible.domain.fsec.models.fsec_bean import FsecBean
from cible.mapper.fsec.fsec_mapper import (
    fsec_mapper_bean_to_entity,
    fsec_mapper_entity_to_bean,
)
from cible.repository.fsec.models.fsec_entity import FsecEntity
from cible.repository.fsec.models.fsec_teams_entity import FsecTeamsEntity, StepType
from cible.repository.fsec.models.fsec_document_subtypes_entity import FsecDocumentSubtypesEntity
from cible.repository.fsec.models.fsec_documents_entity import FsecDocumentsEntity


class FsecRepository(IFsecRepository):
    """Implémentation du repository FSEC."""

    @transaction.atomic
    def create(self, bean: FsecBean) -> FsecBean:
        """Crée un nouveau FSEC."""
        entity = fsec_mapper_bean_to_entity(bean)
        entity.save()

        # Save Teams
        if bean.teams:
            for team in bean.teams:
                # Assuming team is a dict from API or FsecTeamsBean
                # If dict: keys are 'name', 'role_id'
                # Default step for creation is DESIGN
                name = team.get("name") if isinstance(team, dict) else team.name
                role_id = team.get("role_id") if isinstance(team, dict) else team.role_id
                
                FsecTeamsEntity.objects.create(
                    fsec_id=entity,
                    role_id_id=role_id,
                    name=name,
                    step_type=StepType.DESIGN
                )

        # Save Documents
        if bean.documents:
            for doc in bean.documents:
                # Assuming doc is a dict from API
                # keys: 'path', 'subtype_id'
                path = doc.get("path") if isinstance(doc, dict) else doc.path
                subtype_id = doc.get("subtype_id") if isinstance(doc, dict) else doc.subtype_id
                
                # Retrieve Subtype to get default Type
                # This is slightly inefficient, ideally passed from frontend or cached
                # But necessary for FsecDocumentsEntity which requires type_id
                subtype = FsecDocumentSubtypesEntity.objects.get(id=subtype_id)
                
                FsecDocumentsEntity.objects.create(
                    fsec_id=entity,
                    type_id=subtype.type_id,
                    subtype_id=subtype,
                    name=subtype.label, # Default name
                    path=path,
                    step_type=StepType.DESIGN
                )

        return fsec_mapper_entity_to_bean(entity)

    def get_by_version_uuid(self, version_uuid: str) -> Optional[FsecBean]:
        """Récupère un FSEC par son version_uuid (PK)."""
        try:
            entity = FsecEntity.objects.select_related(
                'campaign_id', 'status_id', 'category_id', 'rack_id'
            ).get(version_uuid=version_uuid)
            return fsec_mapper_entity_to_bean(entity)
        except FsecEntity.DoesNotExist:
            return None

    def get_by_fsec_uuid(self, fsec_uuid: str) -> List[FsecBean]:
        """Récupère toutes les versions d'un FSEC par son fsec_uuid."""
        entities = FsecEntity.objects.select_related(
            'campaign_id', 'status_id', 'category_id', 'rack_id'
        ).filter(fsec_uuid=fsec_uuid)
        return [fsec_mapper_entity_to_bean(entity) for entity in entities]

    def get_active_by_fsec_uuid(self, fsec_uuid: str) -> Optional[FsecBean]:
        """Récupère la version active d'un FSEC."""
        try:
            entity = FsecEntity.objects.select_related(
                'campaign_id', 'status_id', 'category_id', 'rack_id'
            ).get(fsec_uuid=fsec_uuid, is_active=True)
            return fsec_mapper_entity_to_bean(entity)
        except FsecEntity.DoesNotExist:
            return None

    def get_all(self) -> List[FsecBean]:
        """Récupère tous les FSECs."""
        entities = FsecEntity.objects.select_related(
            'campaign_id', 'status_id', 'category_id', 'rack_id'
        ).all()
        return [fsec_mapper_entity_to_bean(entity) for entity in entities]

    def get_all_active(self) -> List[FsecBean]:
        """Récupère tous les FSECs actifs."""
        entities = FsecEntity.objects.select_related(
            'campaign_id', 'status_id', 'category_id', 'rack_id'
        ).filter(is_active=True)
        return [fsec_mapper_entity_to_bean(entity) for entity in entities]

    def get_by_campaign_id(self, campaign_id: str) -> List[FsecBean]:
        """Récupère tous les FSECs d'une campagne."""
        entities = FsecEntity.objects.select_related(
            'campaign_id', 'status_id', 'category_id', 'rack_id'
        ).filter(campaign_id_id=campaign_id)
        return [fsec_mapper_entity_to_bean(entity) for entity in entities]

    @transaction.atomic
    def update(self, bean: FsecBean) -> FsecBean:
        """Met à jour un FSEC."""
        entity = FsecEntity.objects.select_related(
            'campaign_id', 'status_id', 'category_id', 'rack_id'
        ).get(version_uuid=bean.version_uuid)
        entity.campaign_id_id = bean.campaign_id
        entity.status_id_id = bean.status_id
        entity.category_id_id = bean.category_id
        entity.rack_id_id = bean.rack_id
        entity.name = bean.name
        entity.comments = bean.comments
        entity.is_active = bean.is_active
        entity.delivery_date = bean.delivery_date
        entity.shooting_date = bean.shooting_date
        entity.preshooting_pressure = bean.preshooting_pressure
        entity.experience_srxx = bean.experience_srxx
        entity.localisation = bean.localisation
        entity.depressurization_failed = bean.depressurization_failed
        entity.save()
        return fsec_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, version_uuid: str) -> bool:
        """Supprime un FSEC par son version_uuid."""
        try:
            entity = FsecEntity.objects.get(version_uuid=version_uuid)
            entity.delete()
            return True
        except FsecEntity.DoesNotExist:
            return False

    def exists_by_campaign_and_name(self, campaign_id: str, name: str) -> bool:
        """Vérifie si un FSEC existe pour cette campagne avec ce nom."""
        return FsecEntity.objects.filter(
            campaign_id_id=campaign_id, name=name
        ).exists()

    @transaction.atomic
    def deactivate_all_versions(self, fsec_uuid: str) -> bool:
        """Désactive toutes les versions d'un FSEC."""
        updated = FsecEntity.objects.filter(fsec_uuid=fsec_uuid).update(is_active=False)
        return updated > 0
