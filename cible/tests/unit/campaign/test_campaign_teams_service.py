"""
Tests unitaires pour le service CampaignTeams.

Ces tests vérifient la logique métier pure sans dépendance à la BD.
Utilise des mocks pour isoler le service des repositories.
"""
import uuid
from unittest.mock import MagicMock

import pytest

from cible.domain.campaign.models.campaign_teams_bean import CampaignTeamsBean
from cible.domain.campaign.services.campaign_teams_service import (
    create_campaign_team_member,
    delete_campaign_team_member,
    get_campaign_team_member_by_uuid,
    get_campaign_team_members,
    update_campaign_team_member,
)
from cible.domain.exceptions import NotFoundException


@pytest.fixture
def sample_team_member_bean():
    """Fixture pour un membre d'équipe de test."""
    return CampaignTeamsBean(
        uuid=str(uuid.uuid4()),
        campaign_uuid=str(uuid.uuid4()),
        role_id=0,  # MOE
        name="Jean Dupont",
    )


@pytest.fixture
def mock_teams_repository():
    """Fixture pour un mock de repository."""
    return MagicMock()


class TestCampaignTeamsServiceCreate:
    """Tests pour la création de membre d'équipe."""

    @pytest.mark.unit
    def test_create_team_member_success(self, sample_team_member_bean, mock_teams_repository):
        """Test création réussie d'un membre d'équipe."""
        mock_teams_repository.create.return_value = sample_team_member_bean

        result = create_campaign_team_member(mock_teams_repository, sample_team_member_bean)

        assert result.uuid == sample_team_member_bean.uuid
        assert result.name == sample_team_member_bean.name
        mock_teams_repository.create.assert_called_once_with(sample_team_member_bean)


class TestCampaignTeamsServiceGet:
    """Tests pour la récupération de membre d'équipe."""

    @pytest.mark.unit
    def test_get_team_member_by_uuid_success(self, sample_team_member_bean, mock_teams_repository):
        """Test récupération réussie par UUID."""
        mock_teams_repository.get_by_uuid.return_value = sample_team_member_bean

        result = get_campaign_team_member_by_uuid(mock_teams_repository, sample_team_member_bean.uuid)

        assert result.uuid == sample_team_member_bean.uuid
        mock_teams_repository.get_by_uuid.assert_called_once_with(sample_team_member_bean.uuid)

    @pytest.mark.unit
    def test_get_team_member_by_uuid_not_found(self, mock_teams_repository):
        """Test qu'un UUID inexistant lève NotFoundException."""
        mock_teams_repository.get_by_uuid.return_value = None
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException) as exc_info:
            get_campaign_team_member_by_uuid(mock_teams_repository, fake_uuid)

        assert fake_uuid in str(exc_info.value)
        assert "CampaignTeamMember" in str(exc_info.value)

    @pytest.mark.unit
    def test_get_team_members_by_campaign(self, sample_team_member_bean, mock_teams_repository):
        """Test récupération de tous les membres d'une campagne."""
        mock_teams_repository.get_by_campaign_uuid.return_value = [
            sample_team_member_bean,
            sample_team_member_bean,
        ]
        campaign_uuid = str(uuid.uuid4())

        result = get_campaign_team_members(mock_teams_repository, campaign_uuid)

        assert len(result) == 2
        mock_teams_repository.get_by_campaign_uuid.assert_called_once_with(campaign_uuid)


class TestCampaignTeamsServiceUpdate:
    """Tests pour la mise à jour de membre d'équipe."""

    @pytest.mark.unit
    def test_update_team_member_success(self, sample_team_member_bean, mock_teams_repository):
        """Test mise à jour réussie."""
        mock_teams_repository.get_by_uuid.return_value = sample_team_member_bean
        updated_bean = CampaignTeamsBean(
            uuid=sample_team_member_bean.uuid,
            campaign_uuid=sample_team_member_bean.campaign_uuid,
            role_id=1,  # RCE
            name="Jean Dupont Modifié",
        )
        mock_teams_repository.update.return_value = updated_bean

        result = update_campaign_team_member(mock_teams_repository, updated_bean)

        assert result.name == "Jean Dupont Modifié"
        assert result.role_id == 1
        mock_teams_repository.update.assert_called_once()

    @pytest.mark.unit
    def test_update_team_member_not_found(self, mock_teams_repository):
        """Test que la mise à jour d'un membre inexistant lève NotFoundException."""
        mock_teams_repository.get_by_uuid.return_value = None
        fake_bean = CampaignTeamsBean(
            uuid=str(uuid.uuid4()),
            campaign_uuid=str(uuid.uuid4()),
            role_id=0,
            name="Inexistant",
        )

        with pytest.raises(NotFoundException):
            update_campaign_team_member(mock_teams_repository, fake_bean)

        mock_teams_repository.update.assert_not_called()


class TestCampaignTeamsServiceDelete:
    """Tests pour la suppression de membre d'équipe."""

    @pytest.mark.unit
    def test_delete_team_member_success(self, mock_teams_repository):
        """Test suppression réussie."""
        mock_teams_repository.delete.return_value = True
        member_uuid = str(uuid.uuid4())

        result = delete_campaign_team_member(mock_teams_repository, member_uuid)

        assert result is True
        mock_teams_repository.delete.assert_called_once_with(member_uuid)

    @pytest.mark.unit
    def test_delete_team_member_not_found(self, mock_teams_repository):
        """Test que la suppression d'un membre inexistant lève NotFoundException."""
        mock_teams_repository.delete.return_value = False
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException):
            delete_campaign_team_member(mock_teams_repository, fake_uuid)
