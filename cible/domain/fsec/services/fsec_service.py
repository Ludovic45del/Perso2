"""Service FSEC - Logique métier pure."""
from typing import List

from cible.domain.exceptions import ConflictException, NotFoundException, ValidationException
from cible.domain.fsec.interface.fsec_repository import IFsecRepository
from cible.domain.fsec.models.fsec_bean import FsecBean


def _validate_fsec_bean(bean: FsecBean) -> None:
    """Valide les champs obligatoires d'un FsecBean.
    
    Raises:
        ValidationException: Si un champ obligatoire est manquant ou invalide.
    """
    if not bean.name or not bean.name.strip():
        raise ValidationException("name", "Le nom du FSEC est obligatoire")


def create_fsec(repository: IFsecRepository, bean: FsecBean) -> FsecBean:
    """Crée un nouveau FSEC après validation.
    
    Validates:
        - name: Must not be empty
        - campaign_id/name: Must be unique if campaign_id is set
    
    Raises:
        ValidationException: If required fields are missing
        ConflictException: If FSEC with same name already exists in campaign
    """
    _validate_fsec_bean(bean)
    
    if bean.campaign_id and repository.exists_by_campaign_and_name(
        bean.campaign_id, bean.name
    ):
        raise ConflictException(
            "campaign_id/name", f"{bean.campaign_id}/{bean.name}"
        )
    return repository.create(bean)


def get_fsec_by_version_uuid(
    repository: IFsecRepository, version_uuid: str
) -> FsecBean:
    """Récupère un FSEC par son version_uuid (PK)."""
    bean = repository.get_by_version_uuid(version_uuid)
    if bean is None:
        raise NotFoundException("FSEC", version_uuid)
    return bean


def get_fsec_versions(
    repository: IFsecRepository, fsec_uuid: str
) -> List[FsecBean]:
    """Récupère toutes les versions d'un FSEC."""
    return repository.get_by_fsec_uuid(fsec_uuid)


def get_active_fsec(
    repository: IFsecRepository, fsec_uuid: str
) -> FsecBean:
    """Récupère la version active d'un FSEC."""
    bean = repository.get_active_by_fsec_uuid(fsec_uuid)
    if bean is None:
        raise NotFoundException("FSEC (active)", fsec_uuid)
    return bean


def get_all_fsecs(repository: IFsecRepository) -> List[FsecBean]:
    """Récupère tous les FSECs."""
    return repository.get_all()


def get_all_active_fsecs(repository: IFsecRepository) -> List[FsecBean]:
    """Récupère tous les FSECs actifs."""
    return repository.get_all_active()


def get_fsecs_by_campaign(
    repository: IFsecRepository, campaign_id: str
) -> List[FsecBean]:
    """Récupère tous les FSECs d'une campagne."""
    return repository.get_by_campaign_id(campaign_id)


def update_fsec(repository: IFsecRepository, bean: FsecBean) -> FsecBean:
    """Met à jour un FSEC."""
    existing = repository.get_by_version_uuid(bean.version_uuid)
    if existing is None:
        raise NotFoundException("FSEC", bean.version_uuid)
    return repository.update(bean)


def delete_fsec(repository: IFsecRepository, version_uuid: str) -> bool:
    """Supprime un FSEC."""
    if not repository.delete(version_uuid):
        raise NotFoundException("FSEC", version_uuid)
    return True


def create_new_version(
    repository: IFsecRepository, fsec_uuid: str, new_bean: FsecBean
) -> FsecBean:
    """Crée une nouvelle version d'un FSEC existant.
    
    Désactive toutes les versions existantes et crée la nouvelle version active.
    """
    # Désactiver toutes les versions existantes
    repository.deactivate_all_versions(fsec_uuid)
    
    # Créer la nouvelle version avec is_active=True
    new_bean.fsec_uuid = fsec_uuid
    new_bean.is_active = True
    return repository.create(new_bean)
