"""
Tests unitaires pour le service FsecTeams.

Vérifie la logique métier pure sans dépendance à la BD.
"""
import uuid
from unittest.mock import MagicMock

import pytest

from cible.domain.fsec.models.fsec_teams_bean import FsecTeamsBean
from cible.domain.fsec.services.fsec_teams_service import (
    create_fsec_team_member,
    delete_fsec_team_member,
    get_fsec_team_member_by_uuid,
    get_fsec_team_members,
    update_fsec_team_member,
)
from cible.domain.exceptions import NotFoundException


@pytest.fixture
def sample_team_member_bean():
    """Fixture pour un membre d'équipe de test."""
    return FsecTeamsBean(
        uuid=str(uuid.uuid4()),
        fsec_id=str(uuid.uuid4()),
        role_id=0,
        name="Jean Dupont",
    )


@pytest.fixture
def mock_teams_repository():
    """Fixture pour un mock de repository."""
    return MagicMock()


class TestFsecTeamsServiceCreate:
    """Tests pour la création de membre d'équipe."""

    @pytest.mark.unit
    def test_create_team_member_success(self, sample_team_member_bean, mock_teams_repository):
        """Test création réussie d'un membre d'équipe."""
        mock_teams_repository.create.return_value = sample_team_member_bean

        result = create_fsec_team_member(mock_teams_repository, sample_team_member_bean)

        assert result.uuid == sample_team_member_bean.uuid
        assert result.name == sample_team_member_bean.name
        mock_teams_repository.create.assert_called_once_with(sample_team_member_bean)


class TestFsecTeamsServiceGet:
    """Tests pour la récupération de membre d'équipe."""

    @pytest.mark.unit
    def test_get_team_member_by_uuid_success(self, sample_team_member_bean, mock_teams_repository):
        """Test récupération réussie par UUID."""
        mock_teams_repository.get_by_uuid.return_value = sample_team_member_bean

        result = get_fsec_team_member_by_uuid(mock_teams_repository, sample_team_member_bean.uuid)

        assert result.uuid == sample_team_member_bean.uuid
        mock_teams_repository.get_by_uuid.assert_called_once_with(sample_team_member_bean.uuid)

    @pytest.mark.unit
    def test_get_team_member_by_uuid_not_found(self, mock_teams_repository):
        """Test qu'un UUID inexistant lève NotFoundException."""
        mock_teams_repository.get_by_uuid.return_value = None
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException) as exc_info:
            get_fsec_team_member_by_uuid(mock_teams_repository, fake_uuid)

        assert fake_uuid in str(exc_info.value)
        assert "FsecTeamMember" in str(exc_info.value)

    @pytest.mark.unit
    def test_get_team_members_by_fsec(self, sample_team_member_bean, mock_teams_repository):
        """Test récupération de tous les membres d'un FSEC."""
        mock_teams_repository.get_by_fsec_id.return_value = [
            sample_team_member_bean,
            sample_team_member_bean,
        ]
        fsec_id = str(uuid.uuid4())

        result = get_fsec_team_members(mock_teams_repository, fsec_id)

        assert len(result) == 2
        mock_teams_repository.get_by_fsec_id.assert_called_once_with(fsec_id)


class TestFsecTeamsServiceUpdate:
    """Tests pour la mise à jour de membre d'équipe."""

    @pytest.mark.unit
    def test_update_team_member_success(self, sample_team_member_bean, mock_teams_repository):
        """Test mise à jour réussie."""
        mock_teams_repository.get_by_uuid.return_value = sample_team_member_bean
        updated_bean = FsecTeamsBean(
            uuid=sample_team_member_bean.uuid,
            fsec_id=sample_team_member_bean.fsec_id,
            role_id=1,
            name="Jean Dupont Modifié",
        )
        mock_teams_repository.update.return_value = updated_bean

        result = update_fsec_team_member(mock_teams_repository, updated_bean)

        assert result.name == "Jean Dupont Modifié"
        assert result.role_id == 1
        mock_teams_repository.update.assert_called_once()

    @pytest.mark.unit
    def test_update_team_member_not_found(self, mock_teams_repository):
        """Test que la mise à jour d'un membre inexistant lève NotFoundException."""
        mock_teams_repository.get_by_uuid.return_value = None
        fake_bean = FsecTeamsBean(
            uuid=str(uuid.uuid4()),
            fsec_id=str(uuid.uuid4()),
            role_id=0,
            name="Inexistant",
        )

        with pytest.raises(NotFoundException):
            update_fsec_team_member(mock_teams_repository, fake_bean)

        mock_teams_repository.update.assert_not_called()


class TestFsecTeamsServiceDelete:
    """Tests pour la suppression de membre d'équipe."""

    @pytest.mark.unit
    def test_delete_team_member_success(self, mock_teams_repository):
        """Test suppression réussie."""
        mock_teams_repository.delete.return_value = True
        member_uuid = str(uuid.uuid4())

        result = delete_fsec_team_member(mock_teams_repository, member_uuid)

        assert result is True
        mock_teams_repository.delete.assert_called_once_with(member_uuid)

    @pytest.mark.unit
    def test_delete_team_member_not_found(self, mock_teams_repository):
        """Test que la suppression d'un membre inexistant lève NotFoundException."""
        mock_teams_repository.delete.return_value = False
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException):
            delete_fsec_team_member(mock_teams_repository, fake_uuid)
