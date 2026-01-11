from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.fsec.services.fsec_status_service import get_fsec_status
from cible.repository.fsec.repositories.fsec_status_repository import (
    FsecStatusRepository,
)


class FsecStatusController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["post"])
    def get_fsec_status(self, request):
        return JsonResponse(
            get_fsec_status(repository=FsecStatusRepository(), category=request.data),
            safe=False,
            encoder=Encoder,
        )
