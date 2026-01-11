from django.http import Http404, JsonResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.stock.services.structuring_service import (
    add_additional_comment_to_special_structuring,
    add_additional_comment_to_structuring,
    create_special_structuring,
    create_structuring,
    delete_special_structuring,
    delete_structuring,
    get_all_special_structuring,
    get_all_structuring,
)
from cible.mapper.stock.special_structuring_mapper import (
    special_structuring_mapper_api_to_bean,
)
from cible.mapper.stock.structuring_mapper import structuring_mapper_api_to_bean
from cible.repository.stock.repositories.structuring_repository import (
    StructuringRepository,
)


class StructuringController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_structuring(self, request):
        return JsonResponse(
            get_all_structuring(repository=StructuringRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["post"])
    def create_structuring(self, request):
        return JsonResponse(
            create_structuring(
                repository=StructuringRepository(),
                structuring_bean=structuring_mapper_api_to_bean(request.data),
            ),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["delete"])
    def delete_structuring(self, request, uuid: str):
        try:
            return JsonResponse(
                delete_structuring(uuid, repository=StructuringRepository()),
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
            add_additional_comment_to_structuring(
                repository=StructuringRepository(),
                comment=request.data.get("comment"),
                object_uuid=request.data.get("uuid"),
            ),
            safe=False,
            encoder=Encoder,
        )


class SpecialStructuringController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_special_structuring(self, request):
        return JsonResponse(
            get_all_special_structuring(repository=StructuringRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["post"])
    def create_special_structuring(self, request):
        return JsonResponse(
            create_special_structuring(
                repository=StructuringRepository(),
                special_structuring_bean=special_structuring_mapper_api_to_bean(
                    request.data
                ),
            ),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["delete"])
    def delete_special_structuring(self, request, uuid: str):
        try:
            return JsonResponse(
                delete_special_structuring(uuid, repository=StructuringRepository()),
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
            add_additional_comment_to_special_structuring(
                repository=StructuringRepository(),
                comment=request.data.get("comment"),
                object_uuid=request.data.get("uuid"),
            ),
            safe=False,
            encoder=Encoder,
        )
