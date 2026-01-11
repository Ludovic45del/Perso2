"""Controller ShotStep - API REST."""
import json

from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

from cible.domain.steps.services.steps_service import (
    NotFoundException,
    create_step,
    delete_step,
    get_step_by_uuid,
    get_steps_by_fsec_version_id,
    update_step,
)
from cible.mapper.steps.shot_step_mapper import (
    shot_step_mapper_api_to_bean,
    shot_step_mapper_bean_to_api,
)
from cible.repository.steps.repositories.shot_step_repository import (
    ShotStepRepository,
)


class ShotStepController(ViewSet):
    """Controller REST pour les étapes de tir."""
    lookup_field = "uuid"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = ShotStepRepository()
        self.step_name = "ShotStep"

    @action(detail=False, methods=["get"], url_path="fsec/(?P<fsec_version_id>[^/.]+)")
    def list_by_fsec(self, request, fsec_version_id=None):
        """Liste toutes les étapes de tir d'un FSEC."""
        try:
            beans = get_steps_by_fsec_version_id(self.repository, fsec_version_id)
            result = [shot_step_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def retrieve(self, request, uuid=None):
        """Récupère une étape de tir par UUID (GET /:uuid/)."""
        try:
            bean = get_step_by_uuid(self.repository, uuid, self.step_name)
            return JsonResponse(shot_step_mapper_bean_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def create(self, request):
        """Crée une nouvelle étape de tir (POST /)."""
        try:
            data = json.loads(request.body) if request.body else request.data
            bean = shot_step_mapper_api_to_bean(data)
            result = create_step(self.repository, bean)
            return JsonResponse(shot_step_mapper_bean_to_api(result), status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def update(self, request, uuid=None):
        """Met à jour une étape de tir (PUT /:uuid/)."""
        try:
            data = json.loads(request.body) if request.body else request.data
            data["uuid"] = uuid
            bean = shot_step_mapper_api_to_bean(data)
            result = update_step(self.repository, bean, self.step_name)
            return JsonResponse(shot_step_mapper_bean_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def destroy(self, request, uuid=None):
        """Supprime une étape de tir (DELETE /:uuid/)."""
        try:
            delete_step(self.repository, uuid, self.step_name)
            return JsonResponse({"success": True}, status=204)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
