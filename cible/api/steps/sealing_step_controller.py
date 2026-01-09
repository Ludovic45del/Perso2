"""Controller SealingStep - API REST."""
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
from cible.mapper.steps.sealing_step_mapper import (
    sealing_step_mapper_api_to_bean,
    sealing_step_mapper_bean_to_api,
)
from cible.repository.steps.repositories.sealing_step_repository import (
    SealingStepRepository,
)


class SealingStepController(ViewSet):
    """Controller REST pour l'étape de scellement."""
    lookup_field = "uuid"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = SealingStepRepository()
        self.step_name = "SealingStep"

    @action(detail=False, methods=["get"], url_path="fsec/(?P<fsec_version_id>[^/.]+)")
    def get_by_fsec(self, request, fsec_version_id=None):
        """Récupère l'étape de scellement d'un FSEC (unique)."""
        try:
            # Note: get_steps_by_fsec_version_id returns Optional[Bean] for single steps
            # or List[Bean] for multiple. Sealing is single.
            bean = get_steps_by_fsec_version_id(self.repository, fsec_version_id)
            if bean is None:
                return JsonResponse({"error": "Not found"}, status=404)
            return JsonResponse(sealing_step_mapper_bean_to_api(bean))
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def retrieve(self, request, uuid=None):
        """Récupère une étape par UUID."""
        try:
            bean = get_step_by_uuid(self.repository, uuid, self.step_name)
            return JsonResponse(sealing_step_mapper_bean_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def create(self, request):
        """Crée une nouvelle étape."""
        try:
            data = json.loads(request.body) if request.body else request.data
            bean = sealing_step_mapper_api_to_bean(data)
            result = create_step(self.repository, bean)
            return JsonResponse(sealing_step_mapper_bean_to_api(result), status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def update(self, request, uuid=None):
        """Met à jour une étape."""
        try:
            data = json.loads(request.body) if request.body else request.data
            data["uuid"] = uuid
            bean = sealing_step_mapper_api_to_bean(data)
            result = update_step(self.repository, bean, self.step_name)
            return JsonResponse(sealing_step_mapper_bean_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def destroy(self, request, uuid=None):
        """Supprime une étape."""
        try:
            delete_step(self.repository, uuid, self.step_name)
            return JsonResponse({"success": True}, status=204)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
