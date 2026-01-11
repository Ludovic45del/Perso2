import json

import pytest
from django.urls import reverse

from cible.repository.campaign.models.referential.campaign_role import (
    CampaignRoleEntity,
)


@pytest.mark.django_db
def test_get_roles(api_client):
    # Arrange
    CampaignRoleEntity(id=0, label="MOE").save()
    CampaignRoleEntity(id=1, label="RCE").save()
    CampaignRoleEntity(id=2, label="IEC").save()

    path = reverse("campaign_roles_view")
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert 3 == len(content)


@pytest.mark.django_db
def test_campaign_role_str():
    role = CampaignRoleEntity.objects.create(id=0, label="MOE")
    assert str(role) == "MOE"
