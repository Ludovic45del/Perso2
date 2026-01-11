from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.stock.services.file_upload_service import (
    upload_and_process_excel_file,
)
from cible.exceptions.stock_creation_exception import StockCreationException


class FileUploadController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["post"])
    def upload_and_process_excel_file(self, request):
        try:
            return JsonResponse(
                upload_and_process_excel_file(excel_file=request.FILES["file"]),
                safe=False,
                encoder=Encoder,
            )
        except StockCreationException as exception:
            return Response(
                {
                    "message": (
                        "Une erreur est survenue lors de l'import" f': "{exception}"'
                    )
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
