"""Tests unitaires pour les nouveaux steps (Design, Usable, Installed)."""
import uuid
from datetime import date
from unittest.mock import MagicMock

import pytest

from cible.domain.steps.models.design_step_bean import DesignStepBean
from cible.domain.steps.models.installed_step_bean import InstalledStepBean
from cible.domain.steps.models.usable_step_bean import UsableStepBean
from cible.domain.steps.services.steps_service import create_step


@pytest.fixture
def sample_design_step_bean(sample_fsec_version_uuid):
    """Bean DesignStep de test."""
    return DesignStepBean(
        uuid=str(uuid.uuid4()),
        fsec_version_id=sample_fsec_version_uuid,
        comments="Design validé par MOE",
    )


@pytest.fixture
def sample_usable_step_bean(sample_fsec_version_uuid):
    """Bean UsableStep de test."""
    return UsableStepBean(
        uuid=str(uuid.uuid4()),
        fsec_version_id=sample_fsec_version_uuid,
        delivery_date=date(2025, 4, 1),
    )


@pytest.fixture
def sample_installed_step_bean(sample_fsec_version_uuid):
    """Bean InstalledStep de test."""
    return InstalledStepBean(
        uuid=str(uuid.uuid4()),
        fsec_version_id=sample_fsec_version_uuid,
        shooting_date=date(2025, 5, 20),
        preshooting_pressure=0.005,
        experience_srxx="SR250520",
    )


class TestNewStepsService:
    """Tests pour les nouveaux types de steps."""

    @pytest.mark.unit
    def test_create_design_step(self, sample_design_step_bean):
        """Test création DesignStep."""
        mock_repo = MagicMock()
        mock_repo.create.return_value = sample_design_step_bean

        result = create_step(mock_repo, sample_design_step_bean)

        assert result.uuid == sample_design_step_bean.uuid
        assert result.comments == "Design validé par MOE"
        mock_repo.create.assert_called_once_with(sample_design_step_bean)

    @pytest.mark.unit
    def test_create_usable_step(self, sample_usable_step_bean):
        """Test création UsableStep."""
        mock_repo = MagicMock()
        mock_repo.create.return_value = sample_usable_step_bean

        result = create_step(mock_repo, sample_usable_step_bean)

        assert result.uuid == sample_usable_step_bean.uuid
        assert result.delivery_date == date(2025, 4, 1)
        mock_repo.create.assert_called_once_with(sample_usable_step_bean)

    @pytest.mark.unit
    def test_create_installed_step(self, sample_installed_step_bean):
        """Test création InstalledStep."""
        mock_repo = MagicMock()
        mock_repo.create.return_value = sample_installed_step_bean

        result = create_step(mock_repo, sample_installed_step_bean)

        assert result.uuid == sample_installed_step_bean.uuid
        assert result.shooting_date == date(2025, 5, 20)
        assert result.preshooting_pressure == 0.005
        assert result.experience_srxx == "SR250520"
        mock_repo.create.assert_called_once_with(sample_installed_step_bean)
