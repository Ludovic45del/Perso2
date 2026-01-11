"""
Tests d'intégration pour l'API Campaign.

Ces tests vérifient le flux complet : Controller → Service → Repository → BD.
Utilise pytest-django avec une vraie base de données de test.
"""
import json
import uuid

import pytest
from django.test import Client

from cible.repository.campaign.models.campaign_entity import CampaignEntity
from cible.repository.campaign.models.campaign_types_entity import CampaignTypesEntity
from cible.repository.campaign.models.campaign_status_entity import CampaignStatusEntity
from cible.repository.campaign.models.campaign_installations_entity import CampaignInstallationsEntity


@pytest.fixture
def api_client():
    """Client HTTP pour les tests API."""
    return Client()


@pytest.fixture
def setup_referentials(db):
    """Crée les données référentielles nécessaires."""
    # Types
    CampaignTypesEntity.objects.get_or_create(id=0, defaults={"label": "Campagne DAM"})
    CampaignTypesEntity.objects.get_or_create(id=1, defaults={"label": "Campagne d'installation"})
    
    # Status
    CampaignStatusEntity.objects.get_or_create(id=0, defaults={"label": "Brouillon"})
    CampaignStatusEntity.objects.get_or_create(id=1, defaults={"label": "En cours"})
    
    # Installations
    CampaignInstallationsEntity.objects.get_or_create(id=0, defaults={"label": "LMJ"})
    CampaignInstallationsEntity.objects.get_or_create(id=1, defaults={"label": "OMEGA"})


@pytest.fixture
def campaign_data():
    """Données pour créer une campagne."""
    return {
        "name": "Campagne Intégration Test",
        "year": 2025,
        "semester": "S1",
        "type_id": 0,
        "status_id": 0,
        "installation_id": 0,
        "start_date": "2025-01-15",
        "end_date": "2025-06-30",
        "dtri_number": 12345,
        "description": "Campagne créée en test d'intégration",
    }


@pytest.mark.django_db
class TestCampaignApiCreate:
    """Tests d'intégration pour la création de campagne."""

    def test_create_campaign_success(self, api_client, setup_referentials, campaign_data):
        """Test création réussie d'une campagne via l'API."""
        response = api_client.post(
            "/api/v1/campaigns/",
            data=json.dumps(campaign_data),
            content_type="application/json",
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == campaign_data["name"]
        assert data["year"] == campaign_data["year"]
        assert "uuid" in data

        # Vérifier en BD
        assert CampaignEntity.objects.filter(uuid=data["uuid"]).exists()

    def test_create_campaign_duplicate_fails(self, api_client, setup_referentials, campaign_data):
        """Test qu'un doublon (name/year/semester) retourne 409."""
        # Première création
        api_client.post(
            "/api/v1/campaigns/",
            data=json.dumps(campaign_data),
            content_type="application/json",
        )

        # Doublon
        response = api_client.post(
            "/api/v1/campaigns/",
            data=json.dumps(campaign_data),
            content_type="application/json",
        )

        assert response.status_code == 409


@pytest.mark.django_db
class TestCampaignApiRead:
    """Tests d'intégration pour la lecture de campagne."""

    def test_list_campaigns(self, api_client, setup_referentials, campaign_data):
        """Test récupération de la liste des campagnes."""
        # Créer une campagne
        api_client.post(
            "/api/v1/campaigns/",
            data=json.dumps(campaign_data),
            content_type="application/json",
        )

        response = api_client.get("/api/v1/campaigns/")

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["name"] == campaign_data["name"]

    def test_retrieve_campaign_by_uuid(self, api_client, setup_referentials, campaign_data):
        """Test récupération d'une campagne par UUID."""
        create_response = api_client.post(
            "/api/v1/campaigns/",
            data=json.dumps(campaign_data),
            content_type="application/json",
        )
        campaign_uuid = create_response.json()["uuid"]

        response = api_client.get(f"/api/v1/campaigns/{campaign_uuid}/")

        assert response.status_code == 200
        data = response.json()
        assert data["uuid"] == campaign_uuid
        assert data["name"] == campaign_data["name"]

    def test_retrieve_campaign_not_found(self, api_client, setup_referentials):
        """Test qu'un UUID inexistant retourne 404."""
        fake_uuid = str(uuid.uuid4())
        response = api_client.get(f"/api/v1/campaigns/{fake_uuid}/")

        assert response.status_code == 404


@pytest.mark.django_db
class TestCampaignApiUpdate:
    """Tests d'intégration pour la mise à jour de campagne."""

    def test_update_campaign_success(self, api_client, setup_referentials, campaign_data):
        """Test mise à jour réussie d'une campagne."""
        create_response = api_client.post(
            "/api/v1/campaigns/",
            data=json.dumps(campaign_data),
            content_type="application/json",
        )
        campaign_uuid = create_response.json()["uuid"]

        updated_data = campaign_data.copy()
        updated_data["name"] = "Campagne Modifiée"
        updated_data["description"] = "Description mise à jour"

        response = api_client.put(
            f"/api/v1/campaigns/{campaign_uuid}/",
            data=json.dumps(updated_data),
            content_type="application/json",
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Campagne Modifiée"
        assert data["description"] == "Description mise à jour"

    def test_patch_campaign_status(self, api_client, setup_referentials, campaign_data):
        """Test mise à jour partielle du statut."""
        create_response = api_client.post(
            "/api/v1/campaigns/",
            data=json.dumps(campaign_data),
            content_type="application/json",
        )
        campaign_uuid = create_response.json()["uuid"]

        response = api_client.patch(
            f"/api/v1/campaigns/{campaign_uuid}/",
            data=json.dumps({"status_id": 1}),
            content_type="application/json",
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status_id"] == 1


@pytest.mark.django_db
class TestCampaignApiDelete:
    """Tests d'intégration pour la suppression de campagne."""

    def test_delete_campaign_success(self, api_client, setup_referentials, campaign_data):
        """Test suppression réussie d'une campagne."""
        create_response = api_client.post(
            "/api/v1/campaigns/",
            data=json.dumps(campaign_data),
            content_type="application/json",
        )
        campaign_uuid = create_response.json()["uuid"]

        response = api_client.delete(f"/api/v1/campaigns/{campaign_uuid}/")

        assert response.status_code == 204

        # Vérifier suppression en BD
        assert not CampaignEntity.objects.filter(uuid=campaign_uuid).exists()

    def test_delete_campaign_not_found(self, api_client, setup_referentials):
        """Test que la suppression d'un UUID inexistant retourne 404."""
        fake_uuid = str(uuid.uuid4())
        response = api_client.delete(f"/api/v1/campaigns/{fake_uuid}/")

        assert response.status_code == 404
