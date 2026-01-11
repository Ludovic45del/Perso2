from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.campaign.services.campaign_team_service import (
    get_campaign_team_by_campaign,
)
from cible.repository.campaign.repositories.campaign_team_repository import (
    CampaignTeamRepository,
)


class CampaignTeamController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_campaign_team_by_campaign(self, request, campaign_uuid):
        return JsonResponse(
            get_campaign_team_by_campaign(
                campaign_uuid, repository=CampaignTeamRepository()
            ),
            safe=False,
            encoder=Encoder,
        )
