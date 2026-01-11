"""
Tests unitaires pour le service Steps générique.

Vérifie les fonctions CRUD génériques utilisées par tous les steps.
"""
import uuid
from datetime import date
from unittest.mock import MagicMock

import pytest

from cible.domain.steps.services.steps_service import (
    NotFoundException,
    create_step,
    delete_step,
    get_step_by_uuid,
    get_steps_by_fsec_version_id,
    update_step,
)


class TestStepsServiceCreate:
    """Tests création de step."""

    @pytest.mark.unit
    def test_create_step_success(self, sample_assembly_step_bean):
        """Test création réussie d'un step."""
        mock_repo = MagicMock()
        mock_repo.create.return_value = sample_assembly_step_bean

        result = create_step(mock_repo, sample_assembly_step_bean)

        assert result.uuid == sample_assembly_step_bean.uuid
        mock_repo.create.assert_called_once_with(sample_assembly_step_bean)

    @pytest.mark.unit
    def test_create_multiple_steps_types(
        self,
        sample_assembly_step_bean,
        sample_metrology_step_bean,
        sample_sealing_step_bean,
    ):
        """Test création de différents types de steps."""
        for step_bean in [
            sample_assembly_step_bean,
            sample_metrology_step_bean,
            sample_sealing_step_bean,
        ]:
            mock_repo = MagicMock()
            mock_repo.create.return_value = step_bean

            result = create_step(mock_repo, step_bean)

            assert result.uuid == step_bean.uuid
            mock_repo.create.assert_called_once()


class TestStepsServiceGet:
    """Tests récupération de step."""

    @pytest.mark.unit
    def test_get_step_by_uuid_success(self, sample_assembly_step_bean):
        """Test récupération réussie par UUID."""
        mock_repo = MagicMock()
        mock_repo.get_by_uuid.return_value = sample_assembly_step_bean

        result = get_step_by_uuid(mock_repo, sample_assembly_step_bean.uuid, "AssemblyStep")

        assert result.uuid == sample_assembly_step_bean.uuid

    @pytest.mark.unit
    def test_get_step_by_uuid_not_found(self):
        """Test NotFoundException si step inexistant."""
        mock_repo = MagicMock()
        mock_repo.get_by_uuid.return_value = None

        with pytest.raises(NotFoundException) as exc_info:
            get_step_by_uuid(mock_repo, "fake-uuid", "AssemblyStep")

        assert "AssemblyStep" in str(exc_info.value)
        assert "fake-uuid" in str(exc_info.value)

    @pytest.mark.unit
    def test_get_steps_by_fsec_version_id(self, sample_assembly_step_bean):
        """Test récupération par fsec_version_id."""
        mock_repo = MagicMock()
        mock_repo.get_by_fsec_version_id.return_value = [sample_assembly_step_bean]

        result = get_steps_by_fsec_version_id(
            mock_repo, sample_assembly_step_bean.fsec_version_id
        )

        assert len(result) == 1
        mock_repo.get_by_fsec_version_id.assert_called_once()


class TestStepsServiceUpdate:
    """Tests mise à jour de step."""

    @pytest.mark.unit
    def test_update_step_success(self, sample_assembly_step_bean):
        """Test mise à jour réussie."""
        mock_repo = MagicMock()
        mock_repo.get_by_uuid.return_value = sample_assembly_step_bean
        updated_bean = sample_assembly_step_bean
        updated_bean.comments = "Commentaire modifié"
        mock_repo.update.return_value = updated_bean

        result = update_step(mock_repo, updated_bean, "AssemblyStep")

        assert result.comments == "Commentaire modifié"
        mock_repo.update.assert_called_once()

    @pytest.mark.unit
    def test_update_step_not_found(self, sample_assembly_step_bean):
        """Test NotFoundException si step inexistant."""
        mock_repo = MagicMock()
        mock_repo.get_by_uuid.return_value = None

        with pytest.raises(NotFoundException):
            update_step(mock_repo, sample_assembly_step_bean, "AssemblyStep")


class TestStepsServiceDelete:
    """Tests suppression de step."""

    @pytest.mark.unit
    def test_delete_step_success(self, sample_assembly_step_bean):
        """Test suppression réussie."""
        mock_repo = MagicMock()
        mock_repo.delete.return_value = True

        result = delete_step(mock_repo, sample_assembly_step_bean.uuid, "AssemblyStep")

        assert result is True
        mock_repo.delete.assert_called_once()

    @pytest.mark.unit
    def test_delete_step_not_found(self):
        """Test NotFoundException si step inexistant."""
        mock_repo = MagicMock()
        mock_repo.delete.return_value = False

        with pytest.raises(NotFoundException):
            delete_step(mock_repo, "fake-uuid", "AssemblyStep")


class TestStepsServiceGasSteps:
    """Tests spécifiques aux Gas Steps."""

    @pytest.mark.unit
    def test_create_airtightness_step(self, sample_airtightness_step_bean):
        """Test création AirtightnessTestLpStep."""
        mock_repo = MagicMock()
        mock_repo.create.return_value = sample_airtightness_step_bean

        result = create_step(mock_repo, sample_airtightness_step_bean)

        assert result.gas_type == "Helium"
        assert result.experiment_pressure == 1.5
        assert result.operator == "Jean Dupont"
