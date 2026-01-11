"""Controller FsecTeams - API REST."""
import json
import logging

from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

from cible.domain.exceptions import NotFoundException
from cible.domain.fsec.container import get_fsec_container
from cible.domain.fsec.services.fsec_teams_service import (
    create_fsec_team_member,
    delete_fsec_team_member,
    get_fsec_team_member_by_uuid,
    get_fsec_team_members,
    update_fsec_team_member,
)
from cible.mapper.fsec.fsec_teams_mapper import (
    fsec_teams_mapper_api_to_bean,
    fsec_teams_mapper_bean_to_api,
)

logger = logging.getLogger(__name__)


class FsecTeamsController(ViewSet):
    """Controller REST pour les équipes FSEC."""
    lookup_field = "uuid"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = get_fsec_container().fsec_teams_repository()

    @action(detail=False, methods=["get"], url_path="fsec/(?P<fsec_id>[^/.]+)")
    def list_by_fsec(self, request, fsec_id=None):
        """Liste tous les membres d'une équipe FSEC."""
        try:
            beans = get_fsec_team_members(self.repository, fsec_id)
            result = [fsec_teams_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def retrieve(self, request, uuid=None):
        """Récupère un membre d'équipe par UUID."""
        try:
            bean = get_fsec_team_member_by_uuid(self.repository, uuid)
            return JsonResponse(fsec_teams_mapper_bean_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def create(self, request):
        """Crée un nouveau membre d'équipe."""
        try:
            data = json.loads(request.body) if request.body else request.data
            bean = fsec_teams_mapper_api_to_bean(data)
            result = create_fsec_team_member(self.repository, bean)
            return JsonResponse(fsec_teams_mapper_bean_to_api(result), status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def update(self, request, uuid=None):
        """Met à jour un membre d'équipe."""
        try:
            data = json.loads(request.body) if request.body else request.data
            data["uuid"] = uuid
            bean = fsec_teams_mapper_api_to_bean(data)
            result = update_fsec_team_member(self.repository, bean)
            return JsonResponse(fsec_teams_mapper_bean_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def destroy(self, request, uuid=None):
        """Supprime un membre d'équipe."""
        try:
            delete_fsec_team_member(self.repository, uuid)
            return JsonResponse({"success": True}, status=204)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
