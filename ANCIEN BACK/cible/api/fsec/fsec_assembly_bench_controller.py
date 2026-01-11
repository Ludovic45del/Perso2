from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.fsec.services.fsec_assembly_bench_service import get_all_benches
from cible.repository.fsec.repositories.referential.fsec_assembly_bench_repository import (
    FsecAssemblyBenchRepository,
)


class FsecAssemblyBenchController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_benches(self, request):
        return JsonResponse(
            get_all_benches(repository=FsecAssemblyBenchRepository()),
            safe=False,
            encoder=Encoder,
        )
