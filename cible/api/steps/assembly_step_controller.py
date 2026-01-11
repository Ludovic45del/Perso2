"""Controller AssemblyStep - API REST."""
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
from cible.mapper.steps.assembly_step_mapper import (
    assembly_step_mapper_api_to_bean,
    assembly_step_mapper_bean_to_api,
)
from cible.repository.steps.repositories.assembly_step_repository import (
    AssemblyStepRepository,
)


class AssemblyStepController(ViewSet):
    """Controller REST pour les étapes d'assemblage."""
    lookup_field = "uuid"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = AssemblyStepRepository()
        self.step_name = "AssemblyStep"

    @action(detail=False, methods=["get"], url_path="fsec/(?P<fsec_version_id>[^/.]+)")
    def list_by_fsec(self, request, fsec_version_id=None):
        """Liste toutes les étapes d'assemblage d'un FSEC."""
        try:
            beans = get_steps_by_fsec_version_id(self.repository, fsec_version_id)
            result = [assembly_step_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def retrieve(self, request, uuid=None):
        """Récupère une étape d'assemblage par UUID (GET /:uuid/)."""
        try:
            bean = get_step_by_uuid(self.repository, uuid, self.step_name)
            return JsonResponse(assembly_step_mapper_bean_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def create(self, request):
        """Crée une nouvelle étape d'assemblage (POST /)."""
        try:
            data = json.loads(request.body) if request.body else request.data
            bean = assembly_step_mapper_api_to_bean(data)
            result = create_step(self.repository, bean)
            return JsonResponse(assembly_step_mapper_bean_to_api(result), status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def update(self, request, uuid=None):
        """Met à jour une étape d'assemblage (PUT /:uuid/)."""
        try:
            data = json.loads(request.body) if request.body else request.data
            data["uuid"] = uuid
            bean = assembly_step_mapper_api_to_bean(data)
            result = update_step(self.repository, bean, self.step_name)
            return JsonResponse(assembly_step_mapper_bean_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def destroy(self, request, uuid=None):
        """Supprime une étape d'assemblage (DELETE /:uuid/)."""
        try:
            delete_step(self.repository, uuid, self.step_name)
            return JsonResponse({"success": True}, status=204)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
