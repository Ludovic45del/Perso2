import json

import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_get_account_info_pytest(api_client):
    # Arrange
    path = reverse("account")
    response = api_client.get(path)

    # Act
    content = json.loads(response.content.decode())

    # Assert
    assert response.status_code == 200
    assert "admin" == content["username"]
    assert 0 == len(content["groups"])
