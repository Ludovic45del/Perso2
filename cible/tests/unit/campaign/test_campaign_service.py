"""
Tests unitaires pour le service Campaign.

Ces tests vérifient la logique métier pure sans dépendance à la BD.
Utilise des mocks pour isoler le service des repositories.
"""
import uuid
from datetime import date
from unittest.mock import MagicMock

import pytest

from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.domain.campaign.services.campaign_service import (
    create_campaign,
    delete_campaign,
    get_all_campaigns,
    get_campaign_by_uuid,
    update_campaign,
)
from cible.domain.exceptions import ConflictException, NotFoundException


class TestCampaignServiceCreate:
    """Tests pour la création de campagne."""

    @pytest.mark.unit
    def test_create_campaign_success(self, sample_campaign_bean, mock_campaign_repository):
        """Test création réussie d'une campagne."""
        mock_campaign_repository.create.return_value = sample_campaign_bean

        result = create_campaign(mock_campaign_repository, sample_campaign_bean)

        assert result.uuid == sample_campaign_bean.uuid
        assert result.name == sample_campaign_bean.name
        mock_campaign_repository.exists_by_name_year_semester.assert_called_once_with(
            sample_campaign_bean.name,
            sample_campaign_bean.year,
            sample_campaign_bean.semester,
        )
        mock_campaign_repository.create.assert_called_once_with(sample_campaign_bean)

    @pytest.mark.unit
    def test_create_campaign_duplicate_raises_conflict(self, sample_campaign_bean):
        """Test qu'un doublon lève ConflictException."""
        mock_repo = MagicMock()
        mock_repo.exists_by_name_year_semester.return_value = True

        with pytest.raises(ConflictException) as exc_info:
            create_campaign(mock_repo, sample_campaign_bean)

        assert "name/year/semester" in str(exc_info.value)
        mock_repo.create.assert_not_called()


class TestCampaignServiceGet:
    """Tests pour la récupération de campagne."""

    @pytest.mark.unit
    def test_get_campaign_by_uuid_success(self, sample_campaign_bean):
        """Test récupération réussie par UUID."""
        mock_repo = MagicMock()
        mock_repo.get_by_uuid.return_value = sample_campaign_bean

        result = get_campaign_by_uuid(mock_repo, sample_campaign_bean.uuid)

        assert result.uuid == sample_campaign_bean.uuid
        mock_repo.get_by_uuid.assert_called_once_with(sample_campaign_bean.uuid)

    @pytest.mark.unit
    def test_get_campaign_by_uuid_not_found(self):
        """Test qu'un UUID inexistant lève NotFoundException."""
        mock_repo = MagicMock()
        mock_repo.get_by_uuid.return_value = None
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException) as exc_info:
            get_campaign_by_uuid(mock_repo, fake_uuid)

        assert fake_uuid in str(exc_info.value)
        assert "Campaign" in str(exc_info.value)

    @pytest.mark.unit
    def test_get_all_campaigns(self, sample_campaign_bean):
        """Test récupération de toutes les campagnes."""
        mock_repo = MagicMock()
        mock_repo.get_all.return_value = [sample_campaign_bean, sample_campaign_bean]

        result = get_all_campaigns(mock_repo)

        assert len(result) == 2
        mock_repo.get_all.assert_called_once()


class TestCampaignServiceUpdate:
    """Tests pour la mise à jour de campagne."""

    @pytest.mark.unit
    def test_update_campaign_success(self, sample_campaign_bean):
        """Test mise à jour réussie."""
        mock_repo = MagicMock()
        mock_repo.get_by_uuid.return_value = sample_campaign_bean
        updated_bean = CampaignBean(
            uuid=sample_campaign_bean.uuid,
            type_id=1,  # Changé
            status_id=1,  # Changé
            installation_id=sample_campaign_bean.installation_id,
            name="Campagne Modifiée",  # Changé
            year=sample_campaign_bean.year,
            semester=sample_campaign_bean.semester,
            start_date=sample_campaign_bean.start_date,
            end_date=sample_campaign_bean.end_date,
            dtri_number=sample_campaign_bean.dtri_number,
            description="Description modifiée",
        )
        mock_repo.update.return_value = updated_bean
        mock_repo.exists_by_name_year_semester.return_value = False

        result = update_campaign(mock_repo, updated_bean)

        assert result.name == "Campagne Modifiée"
        assert result.type_id == 1
        mock_repo.update.assert_called_once()

    @pytest.mark.unit
    def test_update_campaign_conflict(self, sample_campaign_bean):
        """Test qu'une mise à jour créant un doublon lève ConflictException."""
        mock_repo = MagicMock()
        mock_repo.get_by_uuid.return_value = sample_campaign_bean
        
        updated_bean = CampaignBean(
            uuid=sample_campaign_bean.uuid,
            type_id=1,
            status_id=1,
            installation_id=0,
            name="Nom Doublon",  # Changé
            year=sample_campaign_bean.year,
            semester=sample_campaign_bean.semester,
            start_date=None,
            end_date=None,
            dtri_number=None,
            description=None,
        )
        
        # Simule qu'un autre enregistrement avec ce nom existe déjà
        mock_repo.exists_by_name_year_semester.return_value = True

        with pytest.raises(ConflictException):
            update_campaign(mock_repo, updated_bean)

        mock_repo.update.assert_not_called()

    @pytest.mark.unit
    def test_update_campaign_not_found(self):
        """Test que la mise à jour d'une campagne inexistante lève NotFoundException."""
        mock_repo = MagicMock()
        mock_repo.get_by_uuid.return_value = None
        fake_bean = CampaignBean(
            uuid=str(uuid.uuid4()),
            type_id=0,
            status_id=0,
            installation_id=0,
            name="Inexistante",
            year=2025,
            semester="S1",
            start_date=None,
            end_date=None,
            dtri_number=None,
            description=None,
        )

        with pytest.raises(NotFoundException):
            update_campaign(mock_repo, fake_bean)

        mock_repo.update.assert_not_called()


class TestCampaignServiceDelete:
    """Tests pour la suppression de campagne."""

    @pytest.mark.unit
    def test_delete_campaign_success(self, sample_campaign_uuid):
        """Test suppression réussie."""
        mock_repo = MagicMock()
        mock_repo.delete.return_value = True

        result = delete_campaign(mock_repo, sample_campaign_uuid)

        assert result is True
        mock_repo.delete.assert_called_once_with(sample_campaign_uuid)

    @pytest.mark.unit
    def test_delete_campaign_not_found(self):
        """Test que la suppression d'une campagne inexistante lève NotFoundException."""
        mock_repo = MagicMock()
        mock_repo.delete.return_value = False
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException):
            delete_campaign(mock_repo, fake_uuid)
