import json

import pytest
from django.urls import reverse

from cible.repository.campaign.models.referential.campaign_installation import (
    CampaignInstallationEntity,
)


@pytest.mark.django_db
def test_get_installations(api_client):
    # Arrange
    CampaignInstallationEntity(id=0, label="LMJ", color="#6a84a6").save()
    CampaignInstallationEntity(id=1, label="OMEGA", color="#e0365c ").save()

    path = reverse("campaign_installation_view")
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert 2 == len(content)
