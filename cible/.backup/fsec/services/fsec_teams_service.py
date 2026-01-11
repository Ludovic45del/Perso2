"""Service FsecTeams - Logique métier pure."""
import logging
from typing import List

from cible.domain.fsec.interface.fsec_repository import IFsecTeamsRepository
from cible.domain.fsec.models.fsec_teams_bean import FsecTeamsBean
from cible.domain.exceptions import NotFoundException

logger = logging.getLogger(__name__)


def create_fsec_team_member(
    repository: IFsecTeamsRepository, bean: FsecTeamsBean
) -> FsecTeamsBean:
    """Crée un nouveau membre d'équipe."""
    logger.info(f"Creating fsec team member for fsec_id={bean.fsec_id}")
    try:
        result = repository.create(bean)
        logger.info(f"Created fsec team member with uuid={result.uuid}")
        return result
    except Exception as e:
        logger.error(f"Failed to create fsec team member: {e}")
        raise


def get_fsec_team_member_by_uuid(
    repository: IFsecTeamsRepository, uuid: str
) -> FsecTeamsBean:
    """Récupère un membre d'équipe par son UUID."""
    bean = repository.get_by_uuid(uuid)
    if bean is None:
        raise NotFoundException("FsecTeamMember", uuid)
    return bean


def get_fsec_team_members(
    repository: IFsecTeamsRepository, fsec_id: str
) -> List[FsecTeamsBean]:
    """Récupère tous les membres d'une équipe FSEC."""
    return repository.get_by_fsec_id(fsec_id)


def update_fsec_team_member(
    repository: IFsecTeamsRepository, bean: FsecTeamsBean
) -> FsecTeamsBean:
    """Met à jour un membre d'équipe."""
    logger.info(f"Updating fsec team member uuid={bean.uuid}")
    existing = repository.get_by_uuid(bean.uuid)
    if existing is None:
        logger.warning(f"FsecTeamMember not found: uuid={bean.uuid}")
        raise NotFoundException("FsecTeamMember", bean.uuid)
    try:
        result = repository.update(bean)
        logger.info(f"Updated fsec team member uuid={bean.uuid}")
        return result
    except Exception as e:
        logger.error(f"Failed to update fsec team member uuid={bean.uuid}: {e}")
        raise


def delete_fsec_team_member(repository: IFsecTeamsRepository, uuid: str) -> bool:
    """Supprime un membre d'équipe."""
    logger.info(f"Deleting fsec team member uuid={uuid}")
    try:
        if not repository.delete(uuid):
            logger.warning(f"FsecTeamMember not found for deletion: uuid={uuid}")
            raise NotFoundException("FsecTeamMember", uuid)
        logger.info(f"Deleted fsec team member uuid={uuid}")
        return True
    except NotFoundException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete fsec team member uuid={uuid}: {e}")
        raise
