from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.fsec.services.fsec_category_service import get_fsec_categories
from cible.repository.fsec.repositories.fsec_category_repository import (
    FsecCategoryRepository,
)


class FsecCategoryController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_fsec_categories(self, request):
        return JsonResponse(
            get_fsec_categories(repository=FsecCategoryRepository()),
            safe=False,
            encoder=Encoder,
        )
