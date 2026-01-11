"""Service FsecDocuments - Logique métier pure."""
from typing import List

from cible.domain.fsec.interface.fsec_repository import IFsecDocumentsRepository
from cible.domain.fsec.models.fsec_documents_bean import FsecDocumentsBean
from cible.domain.exceptions import NotFoundException


def create_fsec_document(
    repository: IFsecDocumentsRepository, bean: FsecDocumentsBean
) -> FsecDocumentsBean:
    """Crée un nouveau document."""
    return repository.create(bean)


def get_fsec_document_by_uuid(
    repository: IFsecDocumentsRepository, uuid: str
) -> FsecDocumentsBean:
    """Récupère un document par son UUID."""
    bean = repository.get_by_uuid(uuid)
    if bean is None:
        raise NotFoundException("FsecDocument", uuid)
    return bean


def get_fsec_documents(
    repository: IFsecDocumentsRepository, fsec_id: str
) -> List[FsecDocumentsBean]:
    """Récupère tous les documents d'un FSEC."""
    return repository.get_by_fsec_id(fsec_id)


def update_fsec_document(
    repository: IFsecDocumentsRepository, bean: FsecDocumentsBean
) -> FsecDocumentsBean:
    """Met à jour un document."""
    existing = repository.get_by_uuid(bean.uuid)
    if existing is None:
        raise NotFoundException("FsecDocument", bean.uuid)
    return repository.update(bean)


def delete_fsec_document(repository: IFsecDocumentsRepository, uuid: str) -> bool:
    """Supprime un document."""
    if not repository.delete(uuid):
        raise NotFoundException("FsecDocument", uuid)
    return True
