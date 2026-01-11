"""Service CampaignDocuments - Logique métier pure."""
from typing import List

from cible.domain.campaign.interface.campaign_repository import (
    ICampaignDocumentsRepository,
)
from cible.domain.campaign.models.campaign_documents_bean import CampaignDocumentsBean
from cible.domain.exceptions import NotFoundException


def create_campaign_document(
    repository: ICampaignDocumentsRepository, bean: CampaignDocumentsBean
) -> CampaignDocumentsBean:
    """Crée un nouveau document."""
    return repository.create(bean)


def get_campaign_document_by_uuid(
    repository: ICampaignDocumentsRepository, uuid: str
) -> CampaignDocumentsBean:
    """Récupère un document par son UUID."""
    bean = repository.get_by_uuid(uuid)
    if bean is None:
        raise NotFoundException("CampaignDocument", uuid)
    return bean


def get_campaign_documents(
    repository: ICampaignDocumentsRepository, campaign_uuid: str
) -> List[CampaignDocumentsBean]:
    """Récupère tous les documents d'une campagne."""
    return repository.get_by_campaign_uuid(campaign_uuid)


def update_campaign_document(
    repository: ICampaignDocumentsRepository, bean: CampaignDocumentsBean
) -> CampaignDocumentsBean:
    """Met à jour un document."""
    existing = repository.get_by_uuid(bean.uuid)
    if existing is None:
        raise NotFoundException("CampaignDocument", bean.uuid)
    return repository.update(bean)


def delete_campaign_document(
    repository: ICampaignDocumentsRepository, uuid: str
) -> bool:
    """Supprime un document."""
    if not repository.delete(uuid):
        raise NotFoundException("CampaignDocument", uuid)
    return True
