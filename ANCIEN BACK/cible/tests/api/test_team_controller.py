import json

import pytest
from django.urls import reverse

from cible.repository.campaign.models.campaign import CampaignEntity
from cible.repository.campaign.models.campaign_team import CampaignTeamEntity
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


@pytest.mark.django_db
def test_get_teams(api_client):
    # Arrange
    role_moe = CampaignRoleEntity.objects.create(id=0, label="MOE")
    role_rce = CampaignRoleEntity.objects.create(id=1, label="RCE")
    campaign_type = CampaignTypeEntity.objects.create(
        id=0, label="Campagne DAM", color="#b6c9fd"
    )
    installation = CampaignInstallationEntity.objects.create(
        id=0, label="LMJ", color="#6a84a6"
    )
    status = CampaignStatusEntity.objects.create(
        id=0, label="Brouillon", color="#c3c3c3"
    )

    campaign = CampaignEntity.objects.create(
        uuid="4a70166330364a339006a32d44110c03",
        type=campaign_type,
        status=status,
        installation=installation,
        name="AAAAUGH",
        year=2025,
        semester="S1",
    )

    CampaignTeamEntity(
        uuid="4a70166330364a339006a32d44110c06",
        campaign_uuid=campaign,
        role=role_moe,
        name="USER1",
    ).save()
    CampaignTeamEntity(
        uuid="4a70166330364a339006a32d44110c05",
        campaign_uuid=campaign,
        role=role_rce,
        name="USER2",
    ).save()

    path = reverse("campaign_team_view", args={campaign.uuid})
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert 2 == len(content)
