from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.fsec.services.metrology_machine_service import get_all_machines
from cible.repository.fsec.repositories.referential.metrology_machine_repository import (
    MetrologyMachineRepository,
)


class FsecMetrologyMachineController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_machines(self, request):
        return JsonResponse(
            get_all_machines(repository=MetrologyMachineRepository()),
            safe=False,
            encoder=Encoder,
        )
