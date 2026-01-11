import json

import pytest
from django.urls import reverse

from cible.repository.campaign.models.campaign import CampaignEntity
from cible.repository.campaign.models.campaign_documents import CampaignDocumentEntity
from cible.repository.campaign.models.campaign_team import CampaignTeamEntity
from cible.repository.campaign.models.referential.campaign_document_subtype import (
    CampaignDocumentSubtypeEntity,
)
from cible.repository.campaign.models.referential.campaign_document_type import (
    CampaignDocumentTypeEntity,
)
from cible.repository.campaign.models.referential.campaign_installation import (
    CampaignInstallationEntity,
)
from cible.repository.campaign.models.referential.campaign_role import (
    CampaignRoleEntity,
)
from cible.repository.campaign.models.referential.campaign_status import (
    CampaignStatusEntity,
)
from cible.repository.campaign.models.referential.campaign_type import (
    CampaignTypeEntity,
)


def create_campaign_one():

    campaign_type = CampaignTypeEntity.objects.create(
        id=0, label="Campagne DAM", color="#b6c9fd"
    )
    installation = CampaignInstallationEntity.objects.create(
        id=0, label="LMJ", color="#6a84a6"
    )
    status = CampaignStatusEntity.objects.create(
        id=0, label="Brouillon", color="#c3c3c3"
    )
    doctype = CampaignDocumentTypeEntity.objects.create(id=0, label="DOCUMENTAIRE")
    subtype = CampaignDocumentSubtypeEntity.objects.create(
        id=0, label="VTRI", type=doctype
    )

    campaign = CampaignEntity.objects.create(
        uuid="4a701663-3036-4a33-9006-a32d44110c01",
        type=campaign_type,
        status=status,
        installation=installation,
        name="Campagne1",
        year=2024,
        semester="S2",
        start_date="2025-02-12",
        end_date="2025-02-13",
        dtri_number=1234,
        description="Je suis une trèèèèèèèèès longue description",
    )

    CampaignDocumentEntity.objects.create(
        uuid="4a701663-3036-4a33-9006-a32d44110c03",
        campaign_uuid=campaign,
        subtype=subtype,
        name="nom",
        path="C://",
        date="2025-01-01",
    )

    role_moe = CampaignRoleEntity.objects.create(id=0, label="MOE")

    CampaignTeamEntity.objects.create(
        uuid="4a701663-3036-4a33-9006-a32d44110c06",
        campaign_uuid=campaign,
        role=role_moe,
        name="EQUIPIER1",
    )

    return campaign


def create_campaign_two():

    campaign_type = CampaignTypeEntity.objects.create(
        id=1, label="Campagne Installation", color="#b6c9fd"
    )
    installation = CampaignInstallationEntity.objects.create(
        id=1, label="OMEGA", color="#6a84a6"
    )
    status = CampaignStatusEntity.objects.create(
        id=1, label="Terminée", color="#c3c3c3"
    )
    doctype = CampaignDocumentTypeEntity.objects.create(id=1, label="CAO")
    subtype = CampaignDocumentSubtypeEntity.objects.create(
        id=1, label="Autres Documents", type=doctype
    )

    campaign = CampaignEntity.objects.create(
        uuid="4a701663-3036-4a33-9006-a32d44110c02",
        type=campaign_type,
        status=status,
        installation=installation,
        name="Campagne2",
        year=2025,
        semester="S1",
        start_date="2025-02-12",
        end_date="2026-02-13",
        dtri_number=5678,
        description="Courte description",
    )

    CampaignDocumentEntity.objects.create(
        uuid="4a701663-3036-4a33-9006-a32d44110c04",
        campaign_uuid=campaign,
        subtype=subtype,
        name="Doc",
        path="C://doc.doc",
        date="2025-01-01",
    )

    role_iec = CampaignRoleEntity.objects.create(id=1, label="IEC")

    CampaignTeamEntity.objects.create(
        uuid="4a701663-3036-4a33-9006-a32d44110c07",
        campaign_uuid=campaign,
        role=role_iec,
        name="EQUIPIER2",
    )

    return campaign


def create_referential_data():
    CampaignTypeEntity.objects.create(
        id=0, label="Campagne d'installation", color="#b6c9fd"
    )
    CampaignInstallationEntity.objects.create(id=0, label="OMEGA", color="#6a84a6")
    CampaignStatusEntity.objects.create(id=0, label="En réalisation", color="#c3c3c3")


def save_campaign_one():
    campaign_type = CampaignTypeEntity.objects.create(
        id=0, label="Campagne DAM", color="#b6c9fd"
    )
    campaign_installation = CampaignInstallationEntity.objects.create(
        id=0, label="LMJ", color="#6a84a6"
    )
    campaign_status = CampaignStatusEntity.objects.create(
        id=0, label="Brouillon", color="#c3c3c3"
    )
    CampaignEntity(
        uuid="4a701663-3036-4a33-9006-a32d44110c01",
        type=campaign_type,
        status=campaign_status,
        installation=campaign_installation,
        name="CAMPAGNE1",
        year=2024,
        semester="S2",
        start_date="2025-02-12",
        end_date="2025-02-13",
        dtri_number=1234,
        description="Je suis une trèèèèèèèèès longue description",
    ).save()


@pytest.mark.django_db
def test_get_all_campaigns(api_client):
    # Arrange
    create_campaign_one()
    create_campaign_two()

    path = reverse("campaign_view")
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert 2 == len(content)


@pytest.mark.django_db
def test_get_campaign_by_name(api_client):

    campaign = create_campaign_one()
    name_array = [
        str(campaign.year),
        "-",
        campaign.installation.label,
        "_",
        campaign.name,
    ]
    full_name = "".join(name_array)

    path = reverse("campaign_view", args={full_name})
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert campaign.uuid == content["uuid"]
    assert campaign.name == content["name"]
    assert campaign.semester == content["semester"]
    assert campaign.year == content["year"]
    assert campaign.type.id == content["type"]["id"]
    assert campaign.status.id == content["status"]["id"]
    assert campaign.installation.id == content["installation"]["id"]


@pytest.mark.django_db
def test_get_campaign_by_uuid_fail(api_client):

    create_campaign_one()

    campaign_name = "2025-LMJ_TOTO"

    path = reverse("campaign_view", args={campaign_name})
    response = api_client.get(path)

    # Act
    # Assert
    assert response.status_code == 404


@pytest.mark.django_db
def test_create_campaign(api_client):

    create_referential_data()

    campaign = {
        "uuid": "4a701663-3036-4a33-9006-a32d44110c01",
        "type": {"id": 0, "label": "Campagne d'installation", "color": "#b6c9fd"},
        "status": {"id": 0, "label": "OMEGA", "color": "#6a84a6"},
        "installation": {"id": 0, "label": "En réalisation", "color": "#c3c3c3"},
        "name": "MARIO",
        "year": 2025,
        "semester": "S1",
    }

    path = reverse("campaign_view")
    response = api_client.post(path, data=campaign)

    # Act
    # Assert
    assert response.status_code == 200


@pytest.mark.django_db
def test_delete_campaign_by_uuid(api_client):

    campaign = create_campaign_one()

    delete_path = reverse("campaign_delete_view", args={campaign.uuid})
    delete_response = api_client.delete(delete_path)
    get_path = reverse("campaign_view")
    get_response = api_client.get(get_path)

    # Act
    json.loads(delete_response.content.decode())
    get_content = json.loads(get_response.content.decode())

    # Assert
    assert delete_response.status_code == 200
    assert delete_response.status_code == 200
    assert 0 == len(get_content)


@pytest.mark.django_db
def test_delete_campaign_by_uuid_fail(api_client):

    campaign_full_uuid = "4a701663-3036-4a33-9006-a32d44110c00"

    path = reverse("campaign_delete_view", args={campaign_full_uuid})
    response = api_client.delete(path)

    # Act
    # Assert
    assert response.status_code == 404


@pytest.mark.django_db
def test_create_campaign_fail_on_required_fields(api_client):

    create_referential_data()

    campaign = {
        "uuid": "4a701663-3036-4a33-9006-a32d44110c01",
        "type": {"id": 0, "label": "Campagne DAM", "color": "#b6c9fd"},
        "status": {"id": 0, "label": "LMJ", "color": "#6a84a6"},
        "installation": {"id": 0, "label": "En réalisation", "color": "#c3c3c3"},
        "name": "NAME",
        "year": 2025,
        "semester": None,
    }

    path = reverse("campaign_view")
    response = api_client.post(path, data=campaign)

    # Act
    # Assert
    assert response.status_code == 400
    assert (
        response.data["message"]
        == "Le champ semestre est obligatoire et ne peut pas être vide."
    )


@pytest.mark.django_db
def test_create_campaign_fail_on_unique_name(api_client):

    save_campaign_one()

    campaign_json = {
        "uuid": "4a701663-3036-4a33-9006-a32d44110c03",
        "type": {"id": 0, "label": "Campagne DAM", "color": "#b6c9fd"},
        "status": {"id": 0, "label": "LMJ", "color": "#6a84a6"},
        "installation": {"id": 0, "label": "Brouillon", "color": "#c3c3c3"},
        "name": "CAMPAGNE1",
        "year": 2024,
        "semester": "S2",
        "start_date": "2025-02-12",
        "end_date": "2025-02-13",
        "dtri_number": 1234,
        "description": "Je suis une trèèèèèèèèès longue description",
    }

    path = reverse("campaign_view")
    response = api_client.post(path, data=campaign_json)

    # Act
    # Assert
    assert response.status_code == 409
    assert (
        response.data["message"]
        == "La combinaison nom-semestre-année existe déjà : CAMPAGNE1 - S2 - 2024"
    )


@pytest.mark.django_db
def test_create_campaign_fail_date_diff(api_client):

    create_referential_data()

    campaign = {
        "uuid": "4a701663-3036-4a33-9006-a32d44110c02",
        "type": {"id": 0, "label": "Campagne d'installation", "color": "#b6c9fd"},
        "status": {"id": 0, "label": "OMEGA", "color": "#6a84a6"},
        "installation": {"id": 0, "label": "En réalisation", "color": "#c3c3c3"},
        "name": "NAME",
        "year": 2024,
        "semester": "S2",
        "startDate": "2025-02-12T02:00:00.000Z",
        "endDate": "2024-02-12T02:00:00.000Z",
    }

    path = reverse("campaign_view")
    response = api_client.post(path, data=campaign)

    # Act
    # Assert
    assert response.status_code == 400
    assert (
        response.data["message"]
        == "La date de début doit être inférieure à la date de fin"
    )


@pytest.mark.django_db
def test_update_campaign(api_client):

    create_campaign_one()

    campaign = {
        "uuid": "4a701663-3036-4a33-9006-a32d44110c01",
        "type": {"id": 0, "label": "Campagne DAM", "color": "#b6c9fd"},
        "status": {"id": 0, "label": "LMJ", "color": "#6a84a6"},
        "installation": {"id": 0, "label": "Brouillon", "color": "#c3c3c3"},
        "name": "Campgne1",
        "year": 2024,
        "semester": "S2",
        "startDate": "2025-02-12T02:00:00.000Z",
        "endDate": "2025-02-13T02:00:00.000Z",
        "dtriNumber": 1234,
        "description": "Je suis une trèèèèèèèèès longue description",
        "campaignTeam": [
            {
                "name": "EQUIPIER1",
                "role": {"id": 0, "label": "MOE"},
                "campaign_uuid": "4a701663-3036-4a33-9006-a32d44110c02",
                "uuid": "4a701663-3036-4a33-9006-a32d44110c06",
            }
        ],
        "campaignDocuments": [
            {
                "uuid": "4a701663-3036-4a33-9006-a32d44110c03",
                "campaign_uuid": "4a701663-3036-4a33-9006-a32d44110c02",
                "name": "nom",
                "path": "C://",
                "date": "2025-01-01",
                "type": {
                    "id": 0,
                    "label": "DOCUMENTAIRE",
                    "subtype": {"id": 0, "label": "VTRI"},
                },
                "subtype": {"id": 0, "label": "VTRI"},
            }
        ],
    }

    path = reverse("campaign_view")
    response = api_client.put(path, data=campaign)

    # Act
    # Assert
    assert response.status_code == 200
