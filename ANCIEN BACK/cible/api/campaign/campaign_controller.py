from django.http import Http404, JsonResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.campaign.services.campaign_service import (
    create_campaign,
    delete_campaign,
    get_all_campaigns,
    get_campaign_by_name,
    update_campaign,
)
from cible.exceptions.conflict_exception import ConflictException
from cible.exceptions.date_exception import DateException
from cible.exceptions.missing_data_exception import MissingDataException
from cible.mapper.campaign.campaign_mapper import campaign_mapper_api_to_bean
from cible.repository.campaign.repositories.campaign_repository import (
    CampaignRepository,
)


class CampaignController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_all_campaigns(self, request):
        return JsonResponse(
            get_all_campaigns(repository=CampaignRepository()),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=True, methods=["get"])
    def get_campaign_by_name(self, request, campaign_name):
        try:
            return JsonResponse(
                get_campaign_by_name(campaign_name, repository=CampaignRepository()),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Aucune campagne trouvée"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["post"])
    def create_campaign(self, request):
        try:
            return JsonResponse(
                create_campaign(
                    repository=CampaignRepository(),
                    campaign=campaign_mapper_api_to_bean(request.data),
                ),
                safe=False,
                encoder=Encoder,
            )
        except ConflictException as conflict:
            return Response(
                {
                    "message": (
                        "La combinaison nom-semestre-année"
                        f" existe déjà : {conflict.value}"
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )
        except DateException:
            return Response(
                {"message": "La date de début doit être inférieure à la date de fin"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except MissingDataException as missing_data:
            return Response(
                {"message": (missing_data.args[0])},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["put"])
    def update_campaign(self, request):
        try:
            return JsonResponse(
                update_campaign(
                    repository=CampaignRepository(),
                    campaign=campaign_mapper_api_to_bean(request.data),
                ),
                safe=False,
                encoder=Encoder,
            )
        except ValueError as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["delete"])
    def delete_campaign(self, request, uuid):
        try:
            return JsonResponse(
                delete_campaign(uuid, repository=CampaignRepository()),
                safe=False,
                encoder=Encoder,
            )
        except Http404:
            return Response(
                {"message": "Aucune campagne trouvée pour la suppression"},
                status=status.HTTP_404_NOT_FOUND,
            )
