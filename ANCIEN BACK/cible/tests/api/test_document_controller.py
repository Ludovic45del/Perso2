import datetime
import json

import pytest
from django.urls import reverse

from cible.repository.campaign.models.campaign import CampaignEntity
from cible.repository.campaign.models.campaign_documents import CampaignDocumentEntity
from cible.repository.campaign.models.referential.campaign_document_subtype import (
    CampaignDocumentSubtypeEntity,
)
from cible.repository.campaign.models.referential.campaign_document_type import (
    CampaignDocumentTypeEntity,
)
from cible.repository.campaign.models.referential.campaign_installation import (
    CampaignInstallationEntity,
)
from cible.repository.campaign.models.referential.campaign_status import (
    CampaignStatusEntity,
)
from cible.repository.campaign.models.referential.campaign_type import (
    CampaignTypeEntity,
)


@pytest.mark.django_db
def test_get_documents_by_campaign_uuid(api_client):
    # Arrange

    campaign_type1 = CampaignTypeEntity.objects.create(
        id=1, label="Campagne ABCD", color="#b6c9fd"
    )
    installation1 = CampaignInstallationEntity.objects.create(
        id=1, label="OMEGA", color="#6a84a6"
    )
    status1 = CampaignStatusEntity.objects.create(
        id=3, label="Terminée", color="#c3c3c3"
    )
    type_doc1 = CampaignDocumentTypeEntity.objects.create(id=2, label="ASSEMBLAGE")
    type_cao1 = CampaignDocumentTypeEntity.objects.create(id=3, label="METROLOGIE")
    subtype_doc1 = CampaignDocumentSubtypeEntity.objects.create(
        id=4, label="DOC", type=type_doc1
    )
    subtype_cao1 = CampaignDocumentSubtypeEntity.objects.create(
        id=5, label="CAO", type=type_cao1
    )

    campaign1 = CampaignEntity.objects.create(
        uuid="4a70166330364a339006a32d44110c02",
        type=campaign_type1,
        status=status1,
        installation=installation1,
        name="BRRRRRAAAAH",
        year=2026,
        semester="S2",
    )

    campaign_type2 = CampaignTypeEntity.objects.create(
        id=0, label="Campagne DAM", color="#b6c9fd"
    )
    installation2 = CampaignInstallationEntity.objects.create(
        id=0, label="LMJ", color="#6a84a6"
    )
    status2 = CampaignStatusEntity.objects.create(
        id=0, label="Brouillon", color="#c3c3c3"
    )
    type_doc2 = CampaignDocumentTypeEntity.objects.create(id=0, label="DOCUMENTAIRE")
    type_cao2 = CampaignDocumentTypeEntity.objects.create(id=1, label="CAO")
    subtype_doc2 = CampaignDocumentSubtypeEntity.objects.create(
        id=6, label="DOC", type=type_doc2
    )
    subtype_cao2 = CampaignDocumentSubtypeEntity.objects.create(
        id=7, label="CAO", type=type_cao2
    )

    campaign2 = CampaignEntity.objects.create(
        uuid="4a70166330364a339006a32d44110c03",
        type=campaign_type2,
        status=status2,
        installation=installation2,
        name="AAAAUGH",
        year=2025,
        semester="S1",
    )

    CampaignDocumentEntity(
        uuid="4a70166330364a339006a32d44110c04",
        campaign_uuid=campaign1,
        subtype=subtype_doc1,
        name="USER1",
        path="C://doc1.pdf",
        date=datetime.datetime.now(),
    ).save()
    CampaignDocumentEntity(
        uuid="4a70166330364a339006a32d44110c05",
        campaign_uuid=campaign1,
        subtype=subtype_cao1,
        name="USER2",
        path="C://doc2.pdf",
        date=datetime.datetime.now(),
    ).save()
    CampaignDocumentEntity(
        uuid="4a70166330364a339006a32d44110c06",
        campaign_uuid=campaign2,
        subtype=subtype_doc2,
        name="USER1",
        path="C://doc3.pdf",
        date=datetime.datetime.now(),
    ).save()
    CampaignDocumentEntity(
        uuid="4a70166330364a339006a32d44110c07",
        campaign_uuid=campaign2,
        subtype=subtype_cao2,
        name="USER2",
        path="C://doc4.pdf",
        date=datetime.datetime.now(),
    ).save()

    name_array = [
        str(campaign1.year),
        "-",
        campaign1.installation.label,
        "_",
        campaign1.name,
    ]
    full_name = "".join(name_array)

    path = reverse("campaign_documents_view", args={full_name})
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert 2 == len(content)


@pytest.mark.django_db
def test_get_all_document_types(api_client):
    # Arrange

    CampaignDocumentTypeEntity(id=0, label="DOCUMENTAIRE").save()
    CampaignDocumentTypeEntity(id=1, label="CAO").save()
    CampaignDocumentTypeEntity(id=2, label="ASSEMBLAGE").save()
    CampaignDocumentTypeEntity(id=3, label="METROLOGIE").save()
    CampaignDocumentTypeEntity(id=4, label="FSEC").save()
    CampaignDocumentTypeEntity(id=5, label="FA").save()
    CampaignDocumentTypeEntity(id=6, label="TRANSPORT").save()
    CampaignDocumentTypeEntity(id=7, label="FICHIERS_PALS").save()

    path = reverse("campaign_documents_view")
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert 8 == len(content)
