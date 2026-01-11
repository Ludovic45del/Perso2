from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet

from cible.api.encoder_util import Encoder
from cible.domain.campaign.services.campaign_document_service import (
    get_campaign_documents_by_campaign_name,
    get_campaign_documents_type,
)
from cible.repository.campaign.repositories.campaign_document_repository import (
    CampaignDocumentRepository,
)


class CampaignDocumentController(ViewSet):
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["get"])
    def get_campaign_documents_by_campaign_name(self, request, campaign_name):
        return JsonResponse(
            get_campaign_documents_by_campaign_name(
                campaign_name, repository=CampaignDocumentRepository()
            ),
            safe=False,
            encoder=Encoder,
        )

    @action(detail=False, methods=["get"])
    def get_campaign_documents_type(self, request):
        return JsonResponse(
            get_campaign_documents_type(repository=CampaignDocumentRepository()),
            safe=False,
            encoder=Encoder,
        )
