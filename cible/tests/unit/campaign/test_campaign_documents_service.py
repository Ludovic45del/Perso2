"""
Tests unitaires pour le service CampaignDocuments.

Ces tests vérifient la logique métier pure sans dépendance à la BD.
Utilise des mocks pour isoler le service des repositories.
"""
import uuid
from datetime import date
from unittest.mock import MagicMock

import pytest

from cible.domain.campaign.models.campaign_documents_bean import CampaignDocumentsBean
from cible.domain.campaign.services.campaign_documents_service import (
    create_campaign_document,
    delete_campaign_document,
    get_campaign_document_by_uuid,
    get_campaign_documents,
    update_campaign_document,
)
from cible.domain.exceptions import NotFoundException


@pytest.fixture
def sample_document_bean():
    """Fixture pour un document de test."""
    return CampaignDocumentsBean(
        uuid=str(uuid.uuid4()),
        campaign_uuid=str(uuid.uuid4()),
        subtype_id=0,
        file_type_id=0,
        name="Document_Test.pdf",
        path="P:\\LMJ\\2025\\Campagne_Test\\Documentaire\\Document_Test.pdf",
        date=date(2025, 1, 15),
    )


@pytest.fixture
def mock_documents_repository():
    """Fixture pour un mock de repository."""
    return MagicMock()


class TestCampaignDocumentsServiceCreate:
    """Tests pour la création de document."""

    @pytest.mark.unit
    def test_create_document_success(self, sample_document_bean, mock_documents_repository):
        """Test création réussie d'un document."""
        mock_documents_repository.create.return_value = sample_document_bean

        result = create_campaign_document(mock_documents_repository, sample_document_bean)

        assert result.uuid == sample_document_bean.uuid
        assert result.name == sample_document_bean.name
        mock_documents_repository.create.assert_called_once_with(sample_document_bean)


class TestCampaignDocumentsServiceGet:
    """Tests pour la récupération de document."""

    @pytest.mark.unit
    def test_get_document_by_uuid_success(self, sample_document_bean, mock_documents_repository):
        """Test récupération réussie par UUID."""
        mock_documents_repository.get_by_uuid.return_value = sample_document_bean

        result = get_campaign_document_by_uuid(mock_documents_repository, sample_document_bean.uuid)

        assert result.uuid == sample_document_bean.uuid
        mock_documents_repository.get_by_uuid.assert_called_once_with(sample_document_bean.uuid)

    @pytest.mark.unit
    def test_get_document_by_uuid_not_found(self, mock_documents_repository):
        """Test qu'un UUID inexistant lève NotFoundException."""
        mock_documents_repository.get_by_uuid.return_value = None
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException) as exc_info:
            get_campaign_document_by_uuid(mock_documents_repository, fake_uuid)

        assert fake_uuid in str(exc_info.value)
        assert "CampaignDocument" in str(exc_info.value)

    @pytest.mark.unit
    def test_get_documents_by_campaign(self, sample_document_bean, mock_documents_repository):
        """Test récupération de tous les documents d'une campagne."""
        mock_documents_repository.get_by_campaign_uuid.return_value = [
            sample_document_bean,
            sample_document_bean,
            sample_document_bean,
        ]
        campaign_uuid = str(uuid.uuid4())

        result = get_campaign_documents(mock_documents_repository, campaign_uuid)

        assert len(result) == 3
        mock_documents_repository.get_by_campaign_uuid.assert_called_once_with(campaign_uuid)


class TestCampaignDocumentsServiceUpdate:
    """Tests pour la mise à jour de document."""

    @pytest.mark.unit
    def test_update_document_success(self, sample_document_bean, mock_documents_repository):
        """Test mise à jour réussie."""
        mock_documents_repository.get_by_uuid.return_value = sample_document_bean
        updated_bean = CampaignDocumentsBean(
            uuid=sample_document_bean.uuid,
            campaign_uuid=sample_document_bean.campaign_uuid,
            subtype_id=1,
            file_type_id=1,
            name="Document_Modifie.pdf",
            path="P:\\LMJ\\2025\\Campagne_Test\\Documentaire\\Document_Modifie.pdf",
            date=date(2025, 2, 20),
        )
        mock_documents_repository.update.return_value = updated_bean

        result = update_campaign_document(mock_documents_repository, updated_bean)

        assert result.name == "Document_Modifie.pdf"
        assert result.subtype_id == 1
        mock_documents_repository.update.assert_called_once()

    @pytest.mark.unit
    def test_update_document_not_found(self, mock_documents_repository):
        """Test que la mise à jour d'un document inexistant lève NotFoundException."""
        mock_documents_repository.get_by_uuid.return_value = None
        fake_bean = CampaignDocumentsBean(
            uuid=str(uuid.uuid4()),
            campaign_uuid=str(uuid.uuid4()),
            subtype_id=0,
            file_type_id=0,
            name="Inexistant.pdf",
            path="",
            date=None,
        )

        with pytest.raises(NotFoundException):
            update_campaign_document(mock_documents_repository, fake_bean)

        mock_documents_repository.update.assert_not_called()


class TestCampaignDocumentsServiceDelete:
    """Tests pour la suppression de document."""

    @pytest.mark.unit
    def test_delete_document_success(self, mock_documents_repository):
        """Test suppression réussie."""
        mock_documents_repository.delete.return_value = True
        doc_uuid = str(uuid.uuid4())

        result = delete_campaign_document(mock_documents_repository, doc_uuid)

        assert result is True
        mock_documents_repository.delete.assert_called_once_with(doc_uuid)

    @pytest.mark.unit
    def test_delete_document_not_found(self, mock_documents_repository):
        """Test que la suppression d'un document inexistant lève NotFoundException."""
        mock_documents_repository.delete.return_value = False
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException):
            delete_campaign_document(mock_documents_repository, fake_uuid)
