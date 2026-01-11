"""Controller GasSteps - API REST pour les étapes GAZ."""
import json

from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

from cible.domain.exceptions import NotFoundException
from cible.domain.steps.services.steps_service import (
    create_step,
    delete_step,
    get_step_by_uuid,
    get_steps_by_fsec_version_id,
    update_step,
)
from cible.mapper.steps.airtightness_test_lp_step_mapper import (
    airtightness_test_lp_step_mapper_api_to_bean,
    airtightness_test_lp_step_mapper_bean_to_api,
)
from cible.mapper.steps.depressurization_step_mapper import (
    depressurization_step_mapper_api_to_bean,
    depressurization_step_mapper_bean_to_api,
)
from cible.mapper.steps.gas_filling_bp_step_mapper import (
    gas_filling_bp_step_mapper_api_to_bean,
    gas_filling_bp_step_mapper_bean_to_api,
)
from cible.mapper.steps.gas_filling_hp_step_mapper import (
    gas_filling_hp_step_mapper_api_to_bean,
    gas_filling_hp_step_mapper_bean_to_api,
)
from cible.mapper.steps.permeation_step_mapper import (
    permeation_step_mapper_api_to_bean,
    permeation_step_mapper_bean_to_api,
)
from cible.mapper.steps.repressurization_step_mapper import (
    repressurization_step_mapper_api_to_bean,
    repressurization_step_mapper_bean_to_api,
)
from cible.repository.steps.repositories.airtightness_test_lp_step_repository import (
    AirtightnessTestLpStepRepository,
)
from cible.repository.steps.repositories.depressurization_step_repository import (
    DepressurizationStepRepository,
)
from cible.repository.steps.repositories.gas_filling_bp_step_repository import (
    GasFillingBpStepRepository,
)
from cible.repository.steps.repositories.gas_filling_hp_step_repository import (
    GasFillingHpStepRepository,
)
from cible.repository.steps.repositories.permeation_step_repository import (
    PermeationStepRepository,
)
from cible.repository.steps.repositories.repressurization_step_repository import (
    RepressurizationStepRepository,
)


class BaseGasStepController(ViewSet):
    """Base Controller for Gas Steps to avoid duplication."""
    lookup_field = "uuid"
    repository = None
    step_name = ""
    mapper_to_api = None
    mapper_from_api = None

    @action(detail=False, methods=["get"], url_path="fsec/(?P<fsec_version_id>[^/.]+)")
    def get_by_fsec(self, request, fsec_version_id=None):
        try:
            bean = get_steps_by_fsec_version_id(self.repository, fsec_version_id)
            if bean:
                return JsonResponse(self.mapper_to_api(bean))
            return JsonResponse({"error": "Not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def retrieve(self, request, uuid=None):
        try:
            bean = get_step_by_uuid(self.repository, uuid, self.step_name)
            return JsonResponse(self.mapper_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def create(self, request):
        try:
            data = json.loads(request.body) if request.body else request.data
            bean = self.mapper_from_api(data)
            result = create_step(self.repository, bean)
            return JsonResponse(self.mapper_to_api(result), status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def update(self, request, uuid=None):
        try:
            data = json.loads(request.body) if request.body else request.data
            data["uuid"] = uuid
            bean = self.mapper_from_api(data)
            result = update_step(self.repository, bean, self.step_name)
            return JsonResponse(self.mapper_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def destroy(self, request, uuid=None):
        try:
            delete_step(self.repository, uuid, self.step_name)
            return JsonResponse({"success": True}, status=204)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


class AirtightnessTestLpStepController(BaseGasStepController):
    """Controller REST pour les tests d'étanchéité LP."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = AirtightnessTestLpStepRepository()
        self.step_name = "AirtightnessTestLpStep"
        self.mapper_to_api = airtightness_test_lp_step_mapper_bean_to_api
        self.mapper_from_api = airtightness_test_lp_step_mapper_api_to_bean


class GasFillingBpStepController(BaseGasStepController):
    """Controller REST pour remplissage gaz BP."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = GasFillingBpStepRepository()
        self.step_name = "GasFillingBpStep"
        self.mapper_to_api = gas_filling_bp_step_mapper_bean_to_api
        self.mapper_from_api = gas_filling_bp_step_mapper_api_to_bean


class GasFillingHpStepController(BaseGasStepController):
    """Controller REST pour remplissage gaz HP."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = GasFillingHpStepRepository()
        self.step_name = "GasFillingHpStep"
        self.mapper_to_api = gas_filling_hp_step_mapper_bean_to_api
        self.mapper_from_api = gas_filling_hp_step_mapper_api_to_bean


class PermeationStepController(BaseGasStepController):
    """Controller REST pour perméation."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = PermeationStepRepository()
        self.step_name = "PermeationStep"
        self.mapper_to_api = permeation_step_mapper_bean_to_api
        self.mapper_from_api = permeation_step_mapper_api_to_bean


class DepressurizationStepController(BaseGasStepController):
    """Controller REST pour dépressurisation."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = DepressurizationStepRepository()
        self.step_name = "DepressurizationStep"
        self.mapper_to_api = depressurization_step_mapper_bean_to_api
        self.mapper_from_api = depressurization_step_mapper_api_to_bean


class RepressurizationStepController(BaseGasStepController):
    """Controller REST pour repressurisation."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = RepressurizationStepRepository()
        self.step_name = "RepressurizationStep"
        self.mapper_to_api = repressurization_step_mapper_bean_to_api
        self.mapper_from_api = repressurization_step_mapper_api_to_bean
