import json

import pytest
from django.urls import reverse

from cible.repository.campaign.models.campaign import CampaignEntity
from cible.repository.campaign.models.referential.campaign_installation import (
    CampaignInstallationEntity,
)
from cible.repository.campaign.models.referential.campaign_status import (
    CampaignStatusEntity,
)
from cible.repository.campaign.models.referential.campaign_type import (
    CampaignTypeEntity,
)
from cible.repository.fsec.models.fsec import FsecEntity
from cible.repository.fsec.models.referential.fsec_category import FsecCategoryEntity
from cible.repository.fsec.models.referential.fsec_status import FsecStatusEntity


def create_main_category() -> FsecCategoryEntity:
    tapped_category = FsecCategoryEntity.objects.all().filter(label="Sans Gaz")

    if not tapped_category:
        return FsecCategoryEntity.objects.create(
            id=0, label="Sans Gaz", color="#b6c9fd"
        )
    else:
        return tapped_category[0]


def create_fsec_one():
    campaign_type = CampaignTypeEntity.objects.create(
        id=0, label="Campagne DAM", color="#b6c9fd"
    )
    installation = CampaignInstallationEntity.objects.create(
        id=0, label="LMJ", color="#6a84a6"
    )
    campaign_status = CampaignStatusEntity.objects.create(
        id=0, label="Brouillon", color="#c3c3c3"
    )

    campaign = CampaignEntity.objects.create(
        uuid="4a701663-3036-4a33-9006-a32d44110c01",
        type=campaign_type,
        status=campaign_status,
        installation=installation,
        name="Campagne1",
        year=2024,
        semester="S2",
        start_date="2025-02-12",
        end_date="2025-02-13",
        dtri_number=1234,
        description="Je suis une trèèèèèèèèès longue description",
    )

    fsec_status = FsecStatusEntity.objects.create(id=8, label="Tirée", color="#c3c3c3")

    category = create_main_category()

    return FsecEntity.objects.create(
        version_uuid="4a701663-3036-4a33-9006-a32d44110c01",
        fsec_uuid="4a701663-3036-4a33-9006-a32d44110c02",
        status=fsec_status,
        category=category,
        name="Fsec1",
        comments="Je suis un commentaire ! Oui oui !",
        campaign=campaign,
        last_updated="2025-01-01T23:23:23",
        is_active=True,
        created_at="2025-01-01T11:11:11",
        delivery_date="2025-01-02",
        shooting_date="2025-01-03",
        preshooting_pressure=1.5,
        experience_srxx="xx_darkExperience_xx",
        localisation="ici",
    )


def create_fsec_two():
    campaign_type = CampaignTypeEntity.objects.create(
        id=1, label="Campagne Installation", color="#b6c9fd"
    )
    installation = CampaignInstallationEntity.objects.create(
        id=1, label="OMEGA", color="#6a84a6"
    )
    campaign_status = CampaignStatusEntity.objects.create(
        id=1, label="Terminée", color="#c3c3c3"
    )

    campaign = CampaignEntity.objects.create(
        uuid="4a701663-3036-4a33-9006-a32d44110c02",
        type=campaign_type,
        status=campaign_status,
        installation=installation,
        name="Campagne2",
        year=2025,
        semester="S1",
        start_date="2025-02-12",
        end_date="2026-02-13",
        dtri_number=5678,
        description="Courte description",
    )

    fsec_status = FsecStatusEntity.objects.create(id=6, label="Photo", color="#c3c3c3")

    category = create_main_category()

    return FsecEntity.objects.create(
        version_uuid="4a701663-3036-4a33-9006-a32d44110c03",
        fsec_uuid="4a701663-3036-4a33-9006-a32d44110c04",
        status=fsec_status,
        category=category,
        name="Fsec2",
        comments="Je suis.... Un commentaiiiire !",
        campaign=campaign,
        last_updated="2025-01-01T14:14:14",
        is_active=True,
        created_at="2025-01-01T08:08:08",
        delivery_date="2025-01-02",
        shooting_date="2025-01-03",
        preshooting_pressure=1.5,
        experience_srxx="xx_darkExperience2_xx",
        localisation="là bas",
    )


@pytest.mark.django_db
def test_get_all_fsecs(api_client):
    create_fsec_one()
    create_fsec_two()

    path = reverse("fsec_view")
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert 2 == len(content)


# @pytest.mark.django_db
# def test_get_fsec_by_uuid(api_client):
#
#     fsec = create_fsec_one()
#
#     path = reverse("fsec_view", args={fsec.version_uuid})
#     response = api_client.get(path)
#
#     # Act
#     content = json.loads(response.content.decode())
#
#     # Assert
#     assert response.status_code == 200
#     assert fsec.version_uuid == content["versionUuid"]
#     assert fsec.name == content["name"]
#     assert fsec.fsec_uuid == content["fsecUuid"]
#     assert fsec.comments == content["comments"]
#     assert fsec.status.id == content["status"]["id"]
#     assert fsec.category.id == content["category"]["id"]
#     assert fsec.campaign.uuid == content["campaign"]["uuid"]


# @pytest.mark.django_db
# def test_get_fsec_by_uuid_fail(api_client):
#
#     create_fsec_one()
#
#     fsec_full_uuid = "4a701663-3036-4a33-9006-a32d44110c00"
#
#     path = reverse("fsec_view", args={fsec_full_uuid})
#     response = api_client.get(path)
#
#     # Act
#     # Assert
#     assert response.status_code == 404


# @pytest.mark.django_db
# def test_create_fsec(api_client):
#
#     fsec = {
#         "versionUuid":"4a701663-3036-4a33-9006-a32d44110c02",
#         "category": {"id":0, "label":"Sans Gaz", "color":"#b6c9fd"},
#         "status": {"id":0, "label":"Sans Gaz", "color":"#b6c9fd"},
#         "fsecUuid":"4a701663-3036-4a33-9006-a32d44110c03",
#         "name": "FSEC_NEW",
#         "lastUpdated": "2025-01-01T14:14:14",
#         "comments": "Wooooooooohoooooo une nouvelle FSEC",
#         "campaign": {
#             "uuid": "4a701663-3036-4a33-9006-a32d44110c01",
#             "type": {"id": 0, "label": "Campagne d'installation", "color": "#b6c9fd"},
#             "status": {"id": 0, "label": "OMEGA", "color": "#6a84a6"},
#             "installation": {"id": 0, "label": "En réalisation", "color": "#c3c3c3"},
#             "name": "MARIO",
#             "year": 2025,
#             "semester": "S1",
#         } ,
#
#     }
#
#     path = reverse("fsec_view")
#     response = api_client.post(path, data=fsec)
#
#     # Act
#     # Assert
#     assert response.status_code == 200
