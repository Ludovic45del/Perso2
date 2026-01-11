"""
Tests d'intégration pour l'API FSEC.

Ces tests vérifient le flux complet : Controller → Service → Repository → BD.
"""
import json
import uuid

import pytest
from django.test import Client

from cible.repository.fsec.models.fsec_entity import FsecEntity
from cible.repository.fsec.models.fsec_status_entity import FsecStatusEntity
from cible.repository.fsec.models.fsec_category_entity import FsecCategoryEntity
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
    # Campaign referentials
    CampaignTypesEntity.objects.get_or_create(id=0, defaults={"label": "Campagne DAM"})
    CampaignStatusEntity.objects.get_or_create(id=0, defaults={"label": "Brouillon"})
    CampaignInstallationsEntity.objects.get_or_create(id=0, defaults={"label": "LMJ"})
    
    # FSEC referentials
    FsecStatusEntity.objects.get_or_create(id=0, defaults={"label": "Brouillon"})
    FsecStatusEntity.objects.get_or_create(id=1, defaults={"label": "En cours"})
    FsecCategoryEntity.objects.get_or_create(id=0, defaults={"label": "Standard"})


@pytest.fixture
def sample_campaign(setup_referentials):
    """Crée une campagne de test."""
    campaign = CampaignEntity.objects.create(
        name="Campagne FSEC Test",
        year=2025,
        semester="S1",
        type_id_id=0,
        status_id_id=0,
        installation_id_id=0,
    )
    return campaign


@pytest.fixture
def fsec_data(sample_campaign):
    """Données pour créer un FSEC."""
    return {
        "name": "FSEC Intégration Test",
        "campaign_id": str(sample_campaign.uuid),
        "status_id": 0,
        "category_id": 0,
        "rack_id": None,
        "comments": "FSEC créé en test d'intégration",
        "delivery_date": "2025-03-15",
        "shooting_date": None,
    }


@pytest.mark.django_db
class TestFsecApiCreate:
    """Tests d'intégration pour la création de FSEC."""

    def test_create_fsec_success(self, api_client, setup_referentials, fsec_data):
        """Test création réussie d'un FSEC via l'API."""
        response = api_client.post(
            "/api/v1/fsecs/",
            data=json.dumps(fsec_data),
            content_type="application/json",
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == fsec_data["name"]
        assert "version_uuid" in data
        assert data["is_active"] is True

        # Vérifier en BD
        assert FsecEntity.objects.filter(version_uuid=data["version_uuid"]).exists()


@pytest.mark.django_db
class TestFsecApiRead:
    """Tests d'intégration pour la lecture de FSEC."""

    def test_list_fsecs(self, api_client, setup_referentials, fsec_data):
        """Test récupération de la liste des FSECs."""
        # Créer un FSEC
        api_client.post(
            "/api/v1/fsecs/",
            data=json.dumps(fsec_data),
            content_type="application/json",
        )

        response = api_client.get("/api/v1/fsecs/")

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1

    def test_retrieve_fsec_by_version_uuid(self, api_client, setup_referentials, fsec_data):
        """Test récupération d'un FSEC par version_uuid."""
        create_response = api_client.post(
            "/api/v1/fsecs/",
            data=json.dumps(fsec_data),
            content_type="application/json",
        )
        version_uuid = create_response.json()["version_uuid"]

        response = api_client.get(f"/api/v1/fsecs/{version_uuid}/")

        assert response.status_code == 200
        data = response.json()
        assert data["version_uuid"] == version_uuid

    def test_retrieve_fsec_not_found(self, api_client, setup_referentials):
        """Test qu'un UUID inexistant retourne 404."""
        fake_uuid = str(uuid.uuid4())
        response = api_client.get(f"/api/v1/fsecs/{fake_uuid}/")

        assert response.status_code == 404

    def test_list_fsecs_by_campaign(self, api_client, setup_referentials, fsec_data, sample_campaign):
        """Test liste FSEC par campagne."""
        # Créer un FSEC
        api_client.post(
            "/api/v1/fsecs/",
            data=json.dumps(fsec_data),
            content_type="application/json",
        )

        response = api_client.get(f"/api/v1/fsecs/campaign/{sample_campaign.uuid}/")

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1


@pytest.mark.django_db
class TestFsecApiUpdate:
    """Tests d'intégration pour la mise à jour de FSEC."""

    def test_update_fsec_success(self, api_client, setup_referentials, fsec_data):
        """Test mise à jour réussie d'un FSEC."""
        create_response = api_client.post(
            "/api/v1/fsecs/",
            data=json.dumps(fsec_data),
            content_type="application/json",
        )
        version_uuid = create_response.json()["version_uuid"]

        updated_data = fsec_data.copy()
        updated_data["name"] = "FSEC Modifié"
        updated_data["comments"] = "Commentaire mis à jour"

        response = api_client.put(
            f"/api/v1/fsecs/{version_uuid}/",
            data=json.dumps(updated_data),
            content_type="application/json",
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "FSEC Modifié"


@pytest.mark.django_db
class TestFsecApiDelete:
    """Tests d'intégration pour la suppression de FSEC."""

    def test_delete_fsec_success(self, api_client, setup_referentials, fsec_data):
        """Test suppression réussie d'un FSEC."""
        create_response = api_client.post(
            "/api/v1/fsecs/",
            data=json.dumps(fsec_data),
            content_type="application/json",
        )
        version_uuid = create_response.json()["version_uuid"]

        response = api_client.delete(f"/api/v1/fsecs/{version_uuid}/")

        assert response.status_code == 204

        # Vérifier suppression en BD
        assert not FsecEntity.objects.filter(version_uuid=version_uuid).exists()

    def test_delete_fsec_not_found(self, api_client, setup_referentials):
        """Test que la suppression d'un UUID inexistant retourne 404."""
        fake_uuid = str(uuid.uuid4())
        response = api_client.delete(f"/api/v1/fsecs/{fake_uuid}/")

        assert response.status_code == 404
