from django.http import Http404, JsonResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.stock.services.inventory_service import (
    add_additional_comment_to_basic_parts_catalog,
    add_additional_comment_to_ec_structuring,
    add_additional_comment_to_inventory_lmj,
    add_additional_comment_to_inventory_omega,
    create_inventory_basic_parts_catalog,
    create_inventory_ec_structuring,
    create_inventory_lmj,
    create_inventory_omega,
    delete_inventory_basic_parts_catalog,
    delete_inventory_ec_structuring,
    delete_inventory_lmj,
    delete_inventory_omega,
    get_all_inventory_basic_parts_catalog,
    get_all_inventory_ec_structuring,
    get_all_inventory_lmj,
    get_all_inventory_omega,
)
from cible.mapper.stock.inventory_basic_parts_catalog_mapper import (
    inventory_basic_parts_catalog_mapper_api_to_bean,
)
from cible.mapper.stock.inventory_ec_structuring_mapper import (
    inventory_ec_structuring_mapper_api_to_bean,
)
from cible.mapper.stock.inventory_lmj_mapper import inventory_lmj_mapper_api_to_bean
from cible.mapper.stock.inventory_omega_mapper import inventory_omega_mapper_api_to_bean
from cible.repository.stock.repositories.inventory_repository import InventoryRepository


class InventoryBasicPartsCatalogController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_inventory_basic_parts_catalog(self, request):
        return JsonResponse(
            get_all_inventory_basic_parts_catalog(repository=InventoryRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["post"])
    def create_inventory_basic_parts_catalog(self, request):
        return JsonResponse(
            create_inventory_basic_parts_catalog(
                repository=InventoryRepository(),
                inventory_basic_parts_catalog_bean=(
                    inventory_basic_parts_catalog_mapper_api_to_bean(request.data)
                ),
            ),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["delete"])
    def delete_inventory_basic_parts_catalog(self, request, uuid: str):
        try:
            return JsonResponse(
                delete_inventory_basic_parts_catalog(
                    uuid, repository=InventoryRepository()
                ),
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
            add_additional_comment_to_basic_parts_catalog(
                repository=InventoryRepository(),
                comment=request.data.get("comment"),
                object_uuid=request.data.get("uuid"),
            ),
            safe=False,
            encoder=Encoder,
        )


class InventoryEcStructuringController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_inventory_ec_structuring(self, request):
        return JsonResponse(
            get_all_inventory_ec_structuring(repository=InventoryRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["post"])
    def create_inventory_ec_structuring(self, request):
        return JsonResponse(
            create_inventory_ec_structuring(
                repository=InventoryRepository(),
                inventory_ec_structuring_bean=(
                    inventory_ec_structuring_mapper_api_to_bean(request.data)
                ),
            ),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["delete"])
    def delete_inventory_ec_structuring(self, request, uuid: str):
        try:
            return JsonResponse(
                delete_inventory_ec_structuring(uuid, repository=InventoryRepository()),
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
            add_additional_comment_to_ec_structuring(
                repository=InventoryRepository(),
                comment=request.data.get("comment"),
                object_uuid=request.data.get("uuid"),
            ),
            safe=False,
            encoder=Encoder,
        )


class InventoryLmjController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_inventory_lmj(self, request):
        return JsonResponse(
            get_all_inventory_lmj(repository=InventoryRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["post"])
    def create_inventory_lmj(self, request):
        return JsonResponse(
            create_inventory_lmj(
                repository=InventoryRepository(),
                inventory_lmj_bean=inventory_lmj_mapper_api_to_bean(request.data),
            ),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["delete"])
    def delete_inventory_lmj(self, request, uuid: str):
        try:
            return JsonResponse(
                delete_inventory_lmj(uuid, repository=InventoryRepository()),
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
            add_additional_comment_to_inventory_lmj(
                repository=InventoryRepository(),
                comment=request.data.get("comment"),
                object_uuid=request.data.get("uuid"),
            ),
            safe=False,
            encoder=Encoder,
        )


class InventoryOmegaController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_inventory_omega(self, request):
        return JsonResponse(
            get_all_inventory_omega(repository=InventoryRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["post"])
    def create_inventory_omega(self, request):
        return JsonResponse(
            create_inventory_omega(
                repository=InventoryRepository(),
                inventory_omega_bean=inventory_omega_mapper_api_to_bean(request.data),
            ),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["delete"])
    def delete_inventory_omega(self, request, uuid: str):
        try:
            return JsonResponse(
                delete_inventory_omega(uuid, repository=InventoryRepository()),
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
            add_additional_comment_to_inventory_omega(
                repository=InventoryRepository(),
                comment=request.data.get("comment"),
                object_uuid=request.data.get("uuid"),
            ),
            safe=False,
            encoder=Encoder,
        )
