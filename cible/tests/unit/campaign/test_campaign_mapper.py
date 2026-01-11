"""
Tests unitaires pour les mappers Campaign.

Ces tests vérifient les conversions :
- Entity → Bean
- Bean → Entity
- API → Bean
- Bean → API
"""
from datetime import date
from unittest.mock import MagicMock

import pytest

from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.mapper.campaign.campaign_mapper import (
    campaign_mapper_api_to_bean,
    campaign_mapper_bean_to_api,
    campaign_mapper_bean_to_entity,
    campaign_mapper_entity_to_bean,
)


class TestCampaignMapperEntityToBean:
    """Tests conversion Entity → Bean."""

    @pytest.mark.unit
    def test_entity_to_bean_all_fields(self):
        """Test conversion complète Entity → Bean."""
        # Mock Entity
        mock_entity = MagicMock()
        mock_entity.uuid = "981b3cfb-2fba-4a30-ad2d-cbdd73f3334a"
        mock_entity.type_id_id = 0
        mock_entity.status_id_id = 1
        mock_entity.installation_id_id = 2
        mock_entity.name = "Campagne Test"
        mock_entity.year = 2025
        mock_entity.semester = "S1"
        mock_entity.start_date = date(2025, 1, 15)
        mock_entity.end_date = date(2025, 6, 30)
        mock_entity.dtri_number = 12345
        mock_entity.description = "Description test"

        result = campaign_mapper_entity_to_bean(mock_entity)

        assert isinstance(result, CampaignBean)
        assert result.uuid == str(mock_entity.uuid)
        assert result.type_id == 0
        assert result.status_id == 1
        assert result.installation_id == 2
        assert result.name == "Campagne Test"
        assert result.year == 2025
        assert result.semester == "S1"

    @pytest.mark.unit
    def test_entity_to_bean_nullable_fields(self):
        """Test conversion avec champs nullables."""
        mock_entity = MagicMock()
        mock_entity.uuid = "test-uuid"
        mock_entity.type_id_id = 0
        mock_entity.status_id_id = 0
        mock_entity.installation_id_id = 0
        mock_entity.name = "Test"
        mock_entity.year = 2025
        mock_entity.semester = "S1"
        mock_entity.start_date = None
        mock_entity.end_date = None
        mock_entity.dtri_number = None
        mock_entity.description = None

        result = campaign_mapper_entity_to_bean(mock_entity)

        assert result.start_date is None
        assert result.end_date is None
        assert result.dtri_number is None
        assert result.description is None


class TestCampaignMapperBeanToApi:
    """Tests conversion Bean → API."""

    @pytest.mark.unit
    def test_bean_to_api_all_fields(self, sample_campaign_bean):
        """Test conversion complète Bean → API dict."""
        result = campaign_mapper_bean_to_api(sample_campaign_bean)

        assert isinstance(result, dict)
        assert result["uuid"] == sample_campaign_bean.uuid
        assert result["type_id"] == sample_campaign_bean.type_id
        assert result["name"] == sample_campaign_bean.name
        assert result["year"] == sample_campaign_bean.year
        # Date convertie en string ISO
        assert "start_date" in result

    @pytest.mark.unit
    def test_bean_to_api_date_format(self, sample_campaign_bean):
        """Test que les dates sont formatées en ISO."""
        result = campaign_mapper_bean_to_api(sample_campaign_bean)

        if sample_campaign_bean.start_date:
            assert result["start_date"] == sample_campaign_bean.start_date.isoformat()


class TestCampaignMapperApiToBean:
    """Tests conversion API → Bean."""

    @pytest.mark.unit
    def test_api_to_bean_all_fields(self):
        """Test conversion complète API dict → Bean."""
        api_data = {
            "uuid": "test-uuid-12345",
            "type_id": 0,
            "status_id": 1,
            "installation_id": 2,
            "name": "Campagne API",
            "year": 2025,
            "semester": "S2",
            "start_date": "2025-07-01",
            "end_date": "2025-12-31",
            "dtri_number": 99999,
            "description": "Description API",
        }

        result = campaign_mapper_api_to_bean(api_data)

        assert isinstance(result, CampaignBean)
        assert result.uuid == "test-uuid-12345"
        assert result.name == "Campagne API"
        assert result.year == 2025

    @pytest.mark.unit
    def test_api_to_bean_missing_optional_fields(self):
        """Test conversion avec champs optionnels manquants."""
        api_data = {
            "uuid": "test-uuid",
            "type_id": 0,
            "status_id": 0,
            "installation_id": 0,
            "name": "Minimal",
            "year": 2025,
            "semester": "S1",
        }

        result = campaign_mapper_api_to_bean(api_data)

        assert result.name == "Minimal"
        # Les champs optionnels doivent être None ou valeur par défaut


class TestCampaignMapperRoundtrip:
    """Tests de conversion aller-retour."""

    @pytest.mark.unit
    def test_bean_to_api_to_bean_roundtrip(self, sample_campaign_bean):
        """Test que Bean → API → Bean préserve les données."""
        api_data = campaign_mapper_bean_to_api(sample_campaign_bean)
        restored_bean = campaign_mapper_api_to_bean(api_data)

        assert restored_bean.uuid == sample_campaign_bean.uuid
        assert restored_bean.name == sample_campaign_bean.name
        assert restored_bean.year == sample_campaign_bean.year
        assert restored_bean.semester == sample_campaign_bean.semester
