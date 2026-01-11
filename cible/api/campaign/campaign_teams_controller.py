"""Controller CampaignTeams - API REST."""
import json

from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

from cible.domain.exceptions import NotFoundException
from cible.domain.campaign.container import get_campaign_container
from cible.domain.campaign.services.campaign_teams_service import (
    create_campaign_team_member,
    delete_campaign_team_member,
    get_campaign_team_member_by_uuid,
    get_campaign_team_members,
    update_campaign_team_member,
)
from cible.mapper.campaign.campaign_teams_mapper import (
    campaign_teams_mapper_api_to_bean,
    campaign_teams_mapper_bean_to_api,
)


class CampaignTeamsController(ViewSet):
    """Controller REST pour les équipes de campagne."""
    lookup_field = "uuid"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = get_campaign_container().campaign_teams_repository()

    @action(detail=False, methods=["get"], url_path="campaign/(?P<campaign_uuid>[^/.]+)")
    def list_by_campaign(self, request, campaign_uuid=None):
        """Liste tous les membres d'une équipe de campagne."""
        try:
            beans = get_campaign_team_members(self.repository, campaign_uuid)
            result = [campaign_teams_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def retrieve(self, request, uuid=None):
        """Récupère un membre d'équipe par UUID."""
        try:
            bean = get_campaign_team_member_by_uuid(self.repository, uuid)
            return JsonResponse(campaign_teams_mapper_bean_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def create(self, request):
        """Crée un nouveau membre d'équipe."""
        try:
            data = json.loads(request.body) if request.body else request.data
            bean = campaign_teams_mapper_api_to_bean(data)
            result = create_campaign_team_member(self.repository, bean)
            return JsonResponse(campaign_teams_mapper_bean_to_api(result), status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def update(self, request, uuid=None):
        """Met à jour un membre d'équipe."""
        try:
            data = json.loads(request.body) if request.body else request.data
            data["uuid"] = uuid
            bean = campaign_teams_mapper_api_to_bean(data)
            result = update_campaign_team_member(self.repository, bean)
            return JsonResponse(campaign_teams_mapper_bean_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def destroy(self, request, uuid=None):
        """Supprime un membre d'équipe."""
        try:
            delete_campaign_team_member(self.repository, uuid)
            return JsonResponse({"success": True}, status=204)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
