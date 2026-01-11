from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.campaign.services.campaign_status_service import get_campaign_status
from cible.repository.campaign.repositories.campaign_status_repository import (
    CampaignStatusRepository,
)


class CampaignStatusController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_campaign_status(self, request):
        return JsonResponse(
            get_campaign_status(repository=CampaignStatusRepository()),
            safe=False,
            encoder=Encoder,
        )
