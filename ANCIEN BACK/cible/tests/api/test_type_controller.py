import json

import pytest
from django.urls import reverse

from cible.repository.campaign.models.referential.campaign_type import (
    CampaignTypeEntity,
)


@pytest.mark.django_db
def test_get_installations(api_client):
    # Arrange
    CampaignTypeEntity(id=0, label="Campagne DAM", color="#b6c9fd").save()
    CampaignTypeEntity(id=1, label="Campagne d'installation", color="#fdb9e3 ").save()
    CampaignTypeEntity(id=2, label="Campagne d'ouverture", color="#fcc6b6 ").save()

    path = reverse("campaign_types_view")
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert 3 == len(content)
