"""Service Campaign - Logique métier pure."""
from typing import Any, Dict, List

from cible.domain.campaign.interface.campaign_repository import ICampaignRepository
from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.domain.exceptions import ConflictException, NotFoundException


def create_campaign(
    repository: ICampaignRepository, bean: CampaignBean
) -> CampaignBean:
    """Crée une nouvelle campagne après validation."""
    if repository.exists_by_name_year_semester(bean.name, bean.year, bean.semester):
        raise ConflictException(
            "name/year/semester", f"{bean.name}/{bean.year}/{bean.semester}"
        )
    return repository.create(bean)


def get_campaign_by_uuid(
    repository: ICampaignRepository, uuid: str
) -> CampaignBean:
    """Récupère une campagne par son UUID."""
    bean = repository.get_by_uuid(uuid)
    if bean is None:
        raise NotFoundException("Campaign", uuid)
    return bean


def get_all_campaigns(repository: ICampaignRepository) -> List[CampaignBean]:
    """Récupère toutes les campagnes."""
    return repository.get_all()


def update_campaign(
    repository: ICampaignRepository, bean: CampaignBean
) -> CampaignBean:
    """Met à jour une campagne (remplacement complet)."""
    # 1. Vérifie existence
    existing = repository.get_by_uuid(bean.uuid)
    if existing is None:
        raise NotFoundException("Campaign", bean.uuid)
        
    # 2. Vérifie conflit doublon (SI changement de clé unique)
    # On compare avec le bean existant pour éviter une requête inutile
    has_key_changed = (
        bean.name != existing.name
        or bean.year != existing.year
        or bean.semester != existing.semester
    )
    
    if has_key_changed:
        if repository.exists_by_name_year_semester(bean.name, bean.year, bean.semester):
            raise ConflictException(
                "name/year/semester", f"{bean.name}/{bean.year}/{bean.semester}"
            )
            
    return repository.update(bean)


def patch_campaign(
    repository: ICampaignRepository, uuid: str, partial_data: Dict[str, Any]
) -> CampaignBean:
    """Met à jour partiellement une campagne (PATCH)."""
    existing_bean = repository.get_by_uuid(uuid)
    if existing_bean is None:
        raise NotFoundException("Campaign", uuid)

    # Sauvegarde des anciennes valeurs clés pour comparaison
    old_key = (existing_bean.name, existing_bean.year, existing_bean.semester)

    # Fusion des données (Merge)
    for key, value in partial_data.items():
        if hasattr(existing_bean, key):
            setattr(existing_bean, key, value)

    # Vérification conflit APRÈS fusion (uniquement si clé modifiée)
    new_key = (existing_bean.name, existing_bean.year, existing_bean.semester)
    if new_key != old_key:
        if repository.exists_duplicate(
            uuid, existing_bean.name, existing_bean.year, existing_bean.semester
        ):
            raise ConflictException(
                "name/year/semester",
                f"{existing_bean.name}/{existing_bean.year}/{existing_bean.semester}"
            )

    return repository.update(existing_bean)


def delete_campaign(repository: ICampaignRepository, uuid: str) -> bool:
    """Supprime une campagne."""
    if not repository.delete(uuid):
        raise NotFoundException("Campaign", uuid)
    return True
