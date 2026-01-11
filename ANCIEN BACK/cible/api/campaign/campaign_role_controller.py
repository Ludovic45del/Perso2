from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.campaign.services.campaign_role_service import get_campaign_roles
from cible.repository.campaign.repositories.campaign_role_repository import (
    CampaignRoleRepository,
)


class CampaignRoleController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_campaign_roles(self, request):
        return JsonResponse(
            get_campaign_roles(repository=CampaignRoleRepository()),
            safe=False,
            encoder=Encoder,
        )
