"""
Tests unitaires pour le service FSEC.

Vérifie la logique métier du versioning FSEC.
"""
import uuid
from unittest.mock import MagicMock

import pytest

from cible.domain.fsec.models.fsec_bean import FsecBean
from cible.domain.fsec.services.fsec_service import (
    ConflictException,
    NotFoundException,
    create_fsec,
    create_new_version,
    get_active_fsec,
    get_fsec_versions,
    get_fsec_by_version_uuid,
)


@pytest.fixture
def sample_fsec():
    """Fixture FSEC pour tests."""
    return FsecBean(
        version_uuid=str(uuid.uuid4()),
        fsec_uuid=str(uuid.uuid4()),
        campaign_id=str(uuid.uuid4()),
        status_id=0,
        category_id=0,
        rack_id=None,
        name="FSEC Test",
        comments="Test unitaire",
        is_active=True,
        delivery_date=None,
        shooting_date=None,
        preshooting_pressure=None,
        experience_srxx=None,
        localisation=None,
        depressurization_failed=None,
    )


class TestFsecServiceCreate:
    """Tests création FSEC."""

    @pytest.mark.unit
    def test_create_fsec_success(self, sample_fsec):
        """Test création réussie."""
        mock_repo = MagicMock()
        mock_repo.exists_by_campaign_and_name.return_value = False
        mock_repo.create.return_value = sample_fsec

        result = create_fsec(mock_repo, sample_fsec)

        assert result.name == sample_fsec.name
        assert result.is_active is True
        mock_repo.create.assert_called_once()

    @pytest.mark.unit
    def test_create_fsec_duplicate_raises_conflict(self, sample_fsec):
        """Test doublon lève ConflictException."""
        mock_repo = MagicMock()
        mock_repo.exists_by_campaign_and_name.return_value = True

        with pytest.raises(ConflictException):
            create_fsec(mock_repo, sample_fsec)


class TestFsecServiceVersioning:
    """Tests du système de versioning."""

    @pytest.mark.unit
    def test_create_new_version_deactivates_old(self, sample_fsec):
        """Test qu'une nouvelle version désactive l'ancienne."""
        fsec_uuid = sample_fsec.fsec_uuid
        new_version = FsecBean(
            version_uuid=str(uuid.uuid4()),
            fsec_uuid=fsec_uuid,
            campaign_id=sample_fsec.campaign_id,
            status_id=1,
            category_id=sample_fsec.category_id,
            rack_id=sample_fsec.rack_id,
            name=sample_fsec.name,
            comments="Nouvelle version",
            is_active=True,
            delivery_date=None,
            shooting_date=None,
            preshooting_pressure=None,
            experience_srxx=None,
            localisation=None,
            depressurization_failed=None,
        )

        mock_repo = MagicMock()
        # create_new_version appelle deactivate_all_versions puis create
        mock_repo.create.return_value = new_version

        result = create_new_version(mock_repo, fsec_uuid, new_version)

        assert result.is_active is True
        assert result.fsec_uuid == fsec_uuid
        # Vérifie que les anciennes versions ont été désactivées
        mock_repo.deactivate_all_versions.assert_called_once_with(fsec_uuid)
        mock_repo.create.assert_called_once_with(new_version)

    @pytest.mark.unit
    def test_get_active_version(self, sample_fsec):
        """Test récupération de la version active."""
        mock_repo = MagicMock()
        mock_repo.get_active_by_fsec_uuid.return_value = sample_fsec

        result = get_active_fsec(mock_repo, sample_fsec.fsec_uuid)

        assert result.is_active is True
        mock_repo.get_active_by_fsec_uuid.assert_called_once()

    @pytest.mark.unit
    def test_get_all_versions(self, sample_fsec):
        """Test récupération de toutes les versions."""
        mock_repo = MagicMock()
        mock_repo.get_by_fsec_uuid.return_value = [sample_fsec]

        result = get_fsec_versions(mock_repo, sample_fsec.fsec_uuid)

        assert len(result) == 1
        mock_repo.get_by_fsec_uuid.assert_called_once()


class TestFsecServiceGet:
    """Tests récupération FSEC."""

    @pytest.mark.unit
    def test_get_by_version_uuid_success(self, sample_fsec):
        """Test récupération par version_uuid."""
        mock_repo = MagicMock()
        mock_repo.get_by_version_uuid.return_value = sample_fsec

        result = get_fsec_by_version_uuid(mock_repo, sample_fsec.version_uuid)

        assert result.version_uuid == sample_fsec.version_uuid

    @pytest.mark.unit
    def test_get_by_version_uuid_not_found(self):
        """Test NotFoundException si inexistant."""
        mock_repo = MagicMock()
        mock_repo.get_by_version_uuid.return_value = None

        with pytest.raises(NotFoundException):
            get_fsec_by_version_uuid(mock_repo, "fake-uuid")
