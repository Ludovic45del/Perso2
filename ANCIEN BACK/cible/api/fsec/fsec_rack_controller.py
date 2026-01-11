from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.fsec.services.fsec_rack_service import get_all_racks_available
from cible.repository.fsec.repositories.referential.fsec_rack_repository import (
    FsecRackRepository,
)


class FsecRackController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_racks_available(self, request):
        return JsonResponse(
            get_all_racks_available(repository=FsecRackRepository()),
            safe=False,
            encoder=Encoder,
        )
