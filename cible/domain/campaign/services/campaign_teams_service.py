"""Service CampaignTeams - Logique métier pure."""
from typing import List

from cible.domain.campaign.interface.campaign_repository import (
    ICampaignTeamsRepository,
)
from cible.domain.campaign.models.campaign_teams_bean import CampaignTeamsBean
from cible.domain.exceptions import NotFoundException


def create_campaign_team_member(
    repository: ICampaignTeamsRepository, bean: CampaignTeamsBean
) -> CampaignTeamsBean:
    """Crée un nouveau membre d'équipe."""
    return repository.create(bean)


def get_campaign_team_member_by_uuid(
    repository: ICampaignTeamsRepository, uuid: str
) -> CampaignTeamsBean:
    """Récupère un membre d'équipe par son UUID."""
    bean = repository.get_by_uuid(uuid)
    if bean is None:
        raise NotFoundException("CampaignTeamMember", uuid)
    return bean


def get_campaign_team_members(
    repository: ICampaignTeamsRepository, campaign_uuid: str
) -> List[CampaignTeamsBean]:
    """Récupère tous les membres d'une équipe de campagne."""
    return repository.get_by_campaign_uuid(campaign_uuid)


def update_campaign_team_member(
    repository: ICampaignTeamsRepository, bean: CampaignTeamsBean
) -> CampaignTeamsBean:
    """Met à jour un membre d'équipe."""
    existing = repository.get_by_uuid(bean.uuid)
    if existing is None:
        raise NotFoundException("CampaignTeamMember", bean.uuid)
    return repository.update(bean)


def delete_campaign_team_member(
    repository: ICampaignTeamsRepository, uuid: str
) -> bool:
    """Supprime un membre d'équipe."""
    if not repository.delete(uuid):
        raise NotFoundException("CampaignTeamMember", uuid)
    return True
