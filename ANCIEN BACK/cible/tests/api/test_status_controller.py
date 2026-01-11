import json

import pytest
from django.urls import reverse

from cible.repository.campaign.models.referential.campaign_status import (
    CampaignStatusEntity,
)


@pytest.mark.django_db
def test_get_statuses(api_client):
    # Arrange
    CampaignStatusEntity(id=0, label="Brouillon", color="#c3c3c3").save()
    CampaignStatusEntity(id=1, label="Définition terminée", color="#ecce18").save()
    CampaignStatusEntity(id=2, label="En réalisation", color="#7a8ce0").save()
    CampaignStatusEntity(id=3, label="En Terminée", color="#a2d82b").save()

    path = reverse("campaign_status_view")
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert 4 == len(content)
