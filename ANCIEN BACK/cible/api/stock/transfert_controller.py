from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.stock.services.transfers_service import (
    create_transfers,
    get_all_transfers,
)
from cible.mapper.stock.transfers_mapper import transfers_mapper_api_to_bean
from cible.repository.stock.repositories.transfers_repository import TransfersRepository


class TransfersController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_transfers(self, request):
        return JsonResponse(
            get_all_transfers(repository=TransfersRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["post"])
    def create_transfers(self, request):
        return JsonResponse(
            create_transfers(
                repository=TransfersRepository(),
                transfers_bean=transfers_mapper_api_to_bean(request.data),
            ),
            safe=False,
            encoder=Encoder,
        )
