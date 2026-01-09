"""
Fixtures partagées pour tous les tests CIBLE.

Ce module fournit :
- Fixtures de données de test (Beans)
- Mocks des repositories
- Helpers pour le setup/teardown
"""
import uuid
from datetime import date, datetime
from typing import Generator
from unittest.mock import MagicMock, patch

import pytest

# ============================================================================
# CAMPAIGN DOMAIN FIXTURES
# ============================================================================

@pytest.fixture
def sample_campaign_uuid() -> str:
    """UUID fixe pour les tests reproductibles."""
    return "981b3cfb-2fba-4a30-ad2d-cbdd73f3334a"


@pytest.fixture
def sample_campaign_bean():
    """Bean Campaign de test."""
    from cible.domain.campaign.models.campaign_bean import CampaignBean
    return CampaignBean(
        uuid="981b3cfb-2fba-4a30-ad2d-cbdd73f3334a",
        type_id=0,
        status_id=0,
        installation_id=0,
        name="Campagne Test E2E",
        year=2025,
        semester="S1",
        start_date=date(2025, 1, 15),
        end_date=date(2025, 6, 30),
        dtri_number=12345,
        description="Campagne créée pour test E2E",
    )


@pytest.fixture
def mock_campaign_repository():
    """Mock du repository Campaign."""
    mock = MagicMock()
    mock.exists_by_name_year_semester.return_value = False
    return mock


# ============================================================================
# FSEC DOMAIN FIXTURES
# ============================================================================

@pytest.fixture
def sample_fsec_version_uuid() -> str:
    """UUID version FSEC fixe pour tests."""
    return "981b3cfb-2fba-4b30-ad2d-cbdd73f3334a"


@pytest.fixture
def sample_fsec_bean(sample_campaign_uuid):
    """Bean FSEC de test lié à une campagne."""
    from cible.domain.fsec.models.fsec_bean import FsecBean
    return FsecBean(
        version_uuid="981b3cfb-2fba-4b30-ad2d-cbdd73f3334a",
        fsec_uuid="981b3cfb-2fba-4b30-ad2d-cbdd73f3334a",
        campaign_id=sample_campaign_uuid,
        status_id=0,
        category_id=0,
        rack_id=0,
        name="FSEC Test E2E",
        comments="FSEC créé pour test E2E",
        is_active=True,
        delivery_date=date(2025, 3, 1),
        shooting_date=None,
        preshooting_pressure=None,
        experience_srxx=None,
        localisation=None,
        depressurization_failed=None,
    )


@pytest.fixture
def mock_fsec_repository():
    """Mock du repository FSEC."""
    mock = MagicMock()
    mock.exists_by_campaign_and_name.return_value = False
    return mock


# ============================================================================
# STEPS DOMAIN FIXTURES
# ============================================================================

@pytest.fixture
def sample_assembly_step_bean(sample_fsec_version_uuid):
    """Bean AssemblyStep de test."""
    from cible.domain.steps.models.assembly_step_bean import AssemblyStepBean
    return AssemblyStepBean(
        uuid=str(uuid.uuid4()),
        fsec_version_id=sample_fsec_version_uuid,
        hydrometric_temperature=22.5,
        start_date=date(2025, 2, 1),
        end_date=date(2025, 2, 15),
        comments="Assemblage terminé",
        assembly_bench_ids=[0, 1],
    )


@pytest.fixture
def sample_metrology_step_bean(sample_fsec_version_uuid):
    """Bean MetrologyStep de test."""
    from cible.domain.steps.models.metrology_step_bean import MetrologyStepBean
    return MetrologyStepBean(
        uuid=str(uuid.uuid4()),
        fsec_version_id=sample_fsec_version_uuid,
        machine_id=0,
        date=date(2025, 2, 20),
        comments="Métrologie OK",
    )


@pytest.fixture
def sample_sealing_step_bean(sample_fsec_version_uuid):
    """Bean SealingStep de test."""
    from cible.domain.steps.models.sealing_step_bean import SealingStepBean
    return SealingStepBean(
        uuid=str(uuid.uuid4()),
        fsec_version_id=sample_fsec_version_uuid,
        interface_io="INTERFACE_01",
        comments="Scellement validé",
    )


@pytest.fixture
def sample_pictures_step_bean(sample_fsec_version_uuid):
    """Bean PicturesStep de test."""
    from cible.domain.steps.models.pictures_step_bean import PicturesStepBean
    return PicturesStepBean(
        uuid=str(uuid.uuid4()),
        fsec_version_id=sample_fsec_version_uuid,
        last_updated=date(2025, 3, 1),
        comments="Photos prises",
    )


# ============================================================================
# GAS STEPS FIXTURES
# ============================================================================

@pytest.fixture
def sample_airtightness_step_bean(sample_fsec_version_uuid):
    """Bean AirtightnessTestLpStep de test."""
    from cible.domain.steps.models.airtightness_test_lp_step_bean import (
        AirtightnessTestLpStepBean,
    )
    return AirtightnessTestLpStepBean(
        uuid=str(uuid.uuid4()),
        fsec_version_id=sample_fsec_version_uuid,
        leak_rate_dtri="0.001",
        gas_type="Helium",
        experiment_pressure=1.5,
        airtightness_test_duration=120.0,
        operator="Jean Dupont",
        date_of_fulfilment=date(2025, 3, 5),
    )


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def create_mock_entity(bean, entity_class):
    """Crée un mock d'entity à partir d'un bean."""
    mock_entity = MagicMock(spec=entity_class)
    for key, value in bean.__dict__.items():
        setattr(mock_entity, key, value)
    return mock_entity
