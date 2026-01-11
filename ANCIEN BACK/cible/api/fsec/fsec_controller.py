from django.http import Http404, JsonResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.fsec.services.fsec_service import (
    change_depressurization_status,
    create_fsec,
    delete_fsec,
    get_all_fsecs,
    get_all_fsecs_by_campaign_uuid,
    get_fsec_by_uuid,
    return_to_assembly_step,
    return_to_metrology_step,
    return_to_re_assembly_step,
    return_to_repressurization_step,
    update_fsec,
)
from cible.exceptions.conflict_exception import ConflictException
from cible.exceptions.missing_data_exception import MissingDataException
from cible.exceptions.rack_exception import RackException
from cible.mapper.fsec.fsec_mapper import (
    fsec_mapper_api_to_active_bean,
    fsec_mapper_creation_api_to_bean,
)
from cible.mapper.fsec.steps.assembly_step_mapper import (
    fsec_assembly_mapper_api_to_bean,
)
from cible.mapper.fsec.steps.metrology_step_mapper import (
    fsec_metrology_workflow_mapper_api_to_bean,
)
from cible.repository.fsec.repositories.fsec_document_repository import (
    FsecDocumentRepository,
)
from cible.repository.fsec.repositories.fsec_repository import FsecRepository
from cible.repository.fsec.repositories.fsec_team_repository import FsecTeamRepository
from cible.repository.fsec.repositories.referential.fsec_rack_repository import (
    FsecRackRepository,
)


class FsecController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_fsecs(self, request):
        return JsonResponse(
            get_all_fsecs(repository=FsecRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=True, methods=["post"])
    def create_fsec(self, request):
        try:
            return JsonResponse(
                create_fsec(
                    repository=FsecRepository(),
                    fsec=fsec_mapper_creation_api_to_bean(request.data),
                ),
                safe=False,
                encoder=Encoder,
            )

        except MissingDataException as missing_data:
            return JsonResponse(
                {"message": (missing_data.args[0])},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except ConflictException as conflict:
            return Response(
                {
                    "message": (
                        "La combinaison campagne nom de fsec"
                        f" existe déjà : {conflict.value}"
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

    @action(detail=False, methods=["get"])
    def get_fsec_by_uuid(self, request, uuid):
        try:
            return JsonResponse(
                get_fsec_by_uuid(
                    uuid,
                    repository=FsecRepository(),
                    team_repository=FsecTeamRepository(),
                    document_repository=FsecDocumentRepository(),
                ),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Aucune FSEC trouvée"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["put"])
    def update_fsec(self, request):
        try:
            return JsonResponse(
                update_fsec(
                    fsec_repository=FsecRepository(),
                    rack_repository=FsecRackRepository(),
                    fsec=fsec_mapper_api_to_active_bean(request.data),
                ),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Aucune FSEC trouvée"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ConflictException as conflict:
            return JsonResponse(
                {
                    "message": (
                        "La combinaison campagne nom de fsec"
                        f" existe déjà : {conflict.value}"
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )
        except RackException as rack_exception:
            return JsonResponse(
                {
                    "message": rack_exception.args[0],
                },
                status=status.HTTP_409_CONFLICT,
            )
        except MissingDataException as missing_data:
            return JsonResponse(
                {"message": (missing_data.args[0])},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["delete"])
    def delete_fsec(self, request, uuid):
        try:
            return JsonResponse(
                delete_fsec(uuid, repository=FsecRepository()),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Aucune FSEC trouvée pour la suppression"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["get"])
    def get_all_fsecs_by_campaign_uuid(self, request, campaign_uuid):

        try:
            return JsonResponse(
                get_all_fsecs_by_campaign_uuid(
                    repository=FsecRepository(), campaign_uuid=campaign_uuid
                ),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Aucune FSEC trouvée pour la suppression"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["post"])
    def return_to_assembly_step(self, request, fsec_uuid):
        try:
            return JsonResponse(
                return_to_assembly_step(
                    repository=FsecRepository(),
                    assembly_step=fsec_assembly_mapper_api_to_bean(request.data),
                    fsec_uuid=fsec_uuid,
                ),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Impossible de retourner à l'étape d'Assemblage"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["post"])
    def return_to_metrology_step(self, request, fsec_uuid):
        try:
            return JsonResponse(
                return_to_metrology_step(
                    repository=FsecRepository(),
                    metrology_step=fsec_metrology_workflow_mapper_api_to_bean(
                        request.data
                    ),
                    fsec_uuid=fsec_uuid,
                ),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Impossible de retourner à l'étape de la Métrologie"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["post"])
    def change_depressurization_status(self, request, fsec_uuid):
        try:
            return JsonResponse(
                change_depressurization_status(
                    repository=FsecRepository(), fsec_uuid=fsec_uuid
                ),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Une erreur est survenue lors du changement de statut"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["post"])
    def return_to_repressurization_step(self, request, fsec_uuid):
        try:
            return JsonResponse(
                return_to_repressurization_step(
                    repository=FsecRepository(), fsec_uuid=fsec_uuid
                ),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Impossible de retourner à l'étape de la Repressurisation"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["post"])
    def return_to_re_assembly_step(self, request, fsec_uuid):
        try:
            return JsonResponse(
                return_to_re_assembly_step(
                    repository=FsecRepository(), fsec_uuid=fsec_uuid
                ),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Impossible de retourner à l'étape de la Réassemblage"},
                status=status.HTTP_404_NOT_FOUND,
            )
