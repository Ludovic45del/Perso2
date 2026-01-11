from django.http import Http404, JsonResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.stock.services.consumables_service import (
    add_additional_comment_to_consumables_glues,
    add_additional_comment_to_other_consumables,
    create_consumables_glues,
    create_other_consumables,
    delete_consumables_glues,
    delete_other_consumables,
    get_all_consumables_glues,
    get_all_other_consumables,
)
from cible.mapper.stock.consumables_glues_mapper import (
    consumables_glues_mapper_api_to_bean,
)
from cible.mapper.stock.other_consumables_mapper import (
    other_consumables_mapper_api_to_bean,
)
from cible.repository.stock.repositories.consumables_repository import (
    ConsumablesRepository,
)


class ConsumablesGluesController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_consumables_glues(self, request):
        return JsonResponse(
            get_all_consumables_glues(repository=ConsumablesRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["post"])
    def create_consumables_glues(self, request):
        return JsonResponse(
            create_consumables_glues(
                repository=ConsumablesRepository(),
                consumables_glues_bean=consumables_glues_mapper_api_to_bean(
                    request.data
                ),
            ),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["delete"])
    def delete_consumables_glues(self, request, uuid: str):
        try:
            return JsonResponse(
                delete_consumables_glues(uuid, repository=ConsumablesRepository()),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return JsonResponse(
                {"message": "Aucun Objet trouvé"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["put"])
    def add_additional_comment(self, request):
        return JsonResponse(
            add_additional_comment_to_consumables_glues(
                repository=ConsumablesRepository(),
                comment=request.data.get("comment"),
                object_uuid=request.data.get("uuid"),
            ),
            safe=False,
            encoder=Encoder,
        )


class OtherConsumablesController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_other_consumables(self, request):
        return JsonResponse(
            get_all_other_consumables(repository=ConsumablesRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["post"])
    def create_other_consumables(self, request):
        return JsonResponse(
            create_other_consumables(
                repository=ConsumablesRepository(),
                other_consumables_bean=other_consumables_mapper_api_to_bean(
                    request.data
                ),
            ),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["delete"])
    def delete_other_consumables(self, request, uuid: str):
        try:
            return JsonResponse(
                delete_other_consumables(uuid, repository=ConsumablesRepository()),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return JsonResponse(
                {"message": "Aucun Objet trouvé"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["put"])
    def add_additional_comment(self, request):
        return JsonResponse(
            add_additional_comment_to_other_consumables(
                repository=ConsumablesRepository(),
                comment=request.data.get("comment"),
                object_uuid=request.data.get("uuid"),
            ),
            safe=False,
            encoder=Encoder,
        )
