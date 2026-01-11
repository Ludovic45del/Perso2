"""
Tests unitaires pour le service FsecDocuments.

Vérifie la logique métier pure sans dépendance à la BD.
"""
import uuid
from datetime import date
from unittest.mock import MagicMock

import pytest

from cible.domain.fsec.models.fsec_documents_bean import FsecDocumentsBean
from cible.domain.fsec.services.fsec_documents_service import (
    create_fsec_document,
    delete_fsec_document,
    get_fsec_document_by_uuid,
    get_fsec_documents,
    update_fsec_document,
)
from cible.domain.exceptions import NotFoundException


@pytest.fixture
def sample_document_bean():
    """Fixture pour un document de test."""
    return FsecDocumentsBean(
        uuid=str(uuid.uuid4()),
        fsec_id=str(uuid.uuid4()),
        subtype_id=0,
        name="Document_Test.pdf",
        path="P:\\LMJ\\2025\\FSEC_Test\\CAO\\Document_Test.pdf",
        date=date(2025, 1, 15),
    )


@pytest.fixture
def mock_documents_repository():
    """Fixture pour un mock de repository."""
    return MagicMock()


class TestFsecDocumentsServiceCreate:
    """Tests pour la création de document."""

    @pytest.mark.unit
    def test_create_document_success(self, sample_document_bean, mock_documents_repository):
        """Test création réussie d'un document."""
        mock_documents_repository.create.return_value = sample_document_bean

        result = create_fsec_document(mock_documents_repository, sample_document_bean)

        assert result.uuid == sample_document_bean.uuid
        assert result.name == sample_document_bean.name
        mock_documents_repository.create.assert_called_once_with(sample_document_bean)


class TestFsecDocumentsServiceGet:
    """Tests pour la récupération de document."""

    @pytest.mark.unit
    def test_get_document_by_uuid_success(self, sample_document_bean, mock_documents_repository):
        """Test récupération réussie par UUID."""
        mock_documents_repository.get_by_uuid.return_value = sample_document_bean

        result = get_fsec_document_by_uuid(mock_documents_repository, sample_document_bean.uuid)

        assert result.uuid == sample_document_bean.uuid
        mock_documents_repository.get_by_uuid.assert_called_once_with(sample_document_bean.uuid)

    @pytest.mark.unit
    def test_get_document_by_uuid_not_found(self, mock_documents_repository):
        """Test qu'un UUID inexistant lève NotFoundException."""
        mock_documents_repository.get_by_uuid.return_value = None
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException) as exc_info:
            get_fsec_document_by_uuid(mock_documents_repository, fake_uuid)

        assert fake_uuid in str(exc_info.value)
        assert "FsecDocument" in str(exc_info.value)

    @pytest.mark.unit
    def test_get_documents_by_fsec(self, sample_document_bean, mock_documents_repository):
        """Test récupération de tous les documents d'un FSEC."""
        mock_documents_repository.get_by_fsec_id.return_value = [
            sample_document_bean,
            sample_document_bean,
            sample_document_bean,
        ]
        fsec_id = str(uuid.uuid4())

        result = get_fsec_documents(mock_documents_repository, fsec_id)

        assert len(result) == 3
        mock_documents_repository.get_by_fsec_id.assert_called_once_with(fsec_id)


class TestFsecDocumentsServiceUpdate:
    """Tests pour la mise à jour de document."""

    @pytest.mark.unit
    def test_update_document_success(self, sample_document_bean, mock_documents_repository):
        """Test mise à jour réussie."""
        mock_documents_repository.get_by_uuid.return_value = sample_document_bean
        updated_bean = FsecDocumentsBean(
            uuid=sample_document_bean.uuid,
            fsec_id=sample_document_bean.fsec_id,
            subtype_id=1,
            name="Document_Modifie.pdf",
            path="P:\\LMJ\\2025\\FSEC_Test\\CAO\\Document_Modifie.pdf",
            date=date(2025, 2, 20),
        )
        mock_documents_repository.update.return_value = updated_bean

        result = update_fsec_document(mock_documents_repository, updated_bean)

        assert result.name == "Document_Modifie.pdf"
        assert result.subtype_id == 1
        mock_documents_repository.update.assert_called_once()

    @pytest.mark.unit
    def test_update_document_not_found(self, mock_documents_repository):
        """Test que la mise à jour d'un document inexistant lève NotFoundException."""
        mock_documents_repository.get_by_uuid.return_value = None
        fake_bean = FsecDocumentsBean(
            uuid=str(uuid.uuid4()),
            fsec_id=str(uuid.uuid4()),
            subtype_id=0,
            name="Inexistant.pdf",
            path="",
            date=None,
        )

        with pytest.raises(NotFoundException):
            update_fsec_document(mock_documents_repository, fake_bean)

        mock_documents_repository.update.assert_not_called()


class TestFsecDocumentsServiceDelete:
    """Tests pour la suppression de document."""

    @pytest.mark.unit
    def test_delete_document_success(self, mock_documents_repository):
        """Test suppression réussie."""
        mock_documents_repository.delete.return_value = True
        doc_uuid = str(uuid.uuid4())

        result = delete_fsec_document(mock_documents_repository, doc_uuid)

        assert result is True
        mock_documents_repository.delete.assert_called_once_with(doc_uuid)

    @pytest.mark.unit
    def test_delete_document_not_found(self, mock_documents_repository):
        """Test que la suppression d'un document inexistant lève NotFoundException."""
        mock_documents_repository.delete.return_value = False
        fake_uuid = str(uuid.uuid4())

        with pytest.raises(NotFoundException):
            delete_fsec_document(mock_documents_repository, fake_uuid)
