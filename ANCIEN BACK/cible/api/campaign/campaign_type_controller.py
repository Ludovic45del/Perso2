from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.campaign.services.campaign_type_service import get_campaign_types
from cible.repository.campaign.repositories.campaign_type_repository import (
    CampaignTypeRepository,
)


class CampaignTypeController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_campaign_types(self, request):
        return JsonResponse(
            get_campaign_types(repository=CampaignTypeRepository()),
            safe=False,
            encoder=Encoder,
        )
