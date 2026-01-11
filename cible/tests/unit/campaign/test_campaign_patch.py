"""
Tests unitaires pour le PATCH Campaign.
"""
from unittest.mock import MagicMock

import pytest

from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.domain.campaign.services.campaign_service import patch_campaign


class TestCampaignServicePatch:
    """Tests patch_campaign."""

    @pytest.mark.unit
    def test_patch_campaign_success(self):
        """Test qu'un PATCH ne modifie QUE les champs fournis."""
        mock_repo = MagicMock()
        
        # Bean existant complet
        existing_bean = CampaignBean(
            uuid="123",
            name="Old Name",
            year=2024,
            description="Important Description", # Ne doit PAS être perdu
            semester="S1"
        )
        mock_repo.get_by_uuid.return_value = existing_bean
        mock_repo.exists_duplicate.return_value = False  # No conflict
        
        # On update juste le nom
        partial_data = {"name": "New Name"}
        
        # Le repo.update doit être appelé avec le bean fusionné
        patch_campaign(mock_repo, "123", partial_data)
        
        # Vérification
        mock_repo.update.assert_called_once()
        updated_bean = mock_repo.update.call_args[0][0]
        
        assert updated_bean.name == "New Name"         # Modifié
        assert updated_bean.year == 2024               # Conservé
        assert updated_bean.description == "Important Description" # CONSERVÉ ! (Bug fixé)
