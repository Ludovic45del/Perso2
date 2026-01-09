"""Repository FsecDocuments - Implémentation IFsecDocumentsRepository."""
from typing import List, Optional

from django.db import transaction

from cible.domain.fsec.interface.fsec_repository import IFsecDocumentsRepository
from cible.domain.fsec.models.fsec_documents_bean import FsecDocumentsBean
from cible.mapper.fsec.fsec_documents_mapper import (
    fsec_documents_mapper_bean_to_entity,
    fsec_documents_mapper_entity_to_bean,
)
from cible.repository.fsec.models.fsec_documents_entity import FsecDocumentsEntity


class FsecDocumentsRepository(IFsecDocumentsRepository):
    """Implémentation du repository FsecDocuments."""

    @transaction.atomic
    def create(self, bean: FsecDocumentsBean) -> FsecDocumentsBean:
        """Crée un nouveau document."""
        entity = fsec_documents_mapper_bean_to_entity(bean)
        entity.save()
        return fsec_documents_mapper_entity_to_bean(entity)

    def get_by_uuid(self, uuid: str) -> Optional[FsecDocumentsBean]:
        """Récupère un document par son UUID."""
        try:
            entity = FsecDocumentsEntity.objects.select_related(
                'fsec_id', 'subtype_id'
            ).get(uuid=uuid)
            return fsec_documents_mapper_entity_to_bean(entity)
        except FsecDocumentsEntity.DoesNotExist:
            return None

    def get_by_fsec_id(self, fsec_id: str) -> List[FsecDocumentsBean]:
        """Récupère tous les documents d'un FSEC."""
        entities = FsecDocumentsEntity.objects.select_related(
            'fsec_id', 'subtype_id'
        ).filter(fsec_id_id=fsec_id)
        return [fsec_documents_mapper_entity_to_bean(entity) for entity in entities]

    @transaction.atomic
    def update(self, bean: FsecDocumentsBean) -> FsecDocumentsBean:
        """Met à jour un document."""
        entity = FsecDocumentsEntity.objects.select_related(
            'fsec_id', 'subtype_id'
        ).get(uuid=bean.uuid)
        entity.fsec_id_id = bean.fsec_id
        entity.subtype_id_id = bean.subtype_id
        entity.name = bean.name
        entity.path = bean.path
        entity.date = bean.date
        entity.save()
        return fsec_documents_mapper_entity_to_bean(entity)

    @transaction.atomic
    def delete(self, uuid: str) -> bool:
        """Supprime un document par son UUID."""
        try:
            entity = FsecDocumentsEntity.objects.get(uuid=uuid)
            entity.delete()
            return True
        except FsecDocumentsEntity.DoesNotExist:
            return False
