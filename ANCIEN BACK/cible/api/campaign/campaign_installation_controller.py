from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.campaign.services.campaign_installation_service import (
    get_campaign_installations,
)
from cible.repository.campaign.repositories.campaign_installation_repository import (
    CampaignInstallationRepository,
)


class CampaignInstallationController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_campaign_installations(self, request):
        return JsonResponse(
            get_campaign_installations(repository=CampaignInstallationRepository()),
            safe=False,
            encoder=Encoder,
        )
