"""Controller CampaignDocuments - API REST."""
import json

from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

from cible.domain.campaign.container import get_campaign_container
from cible.domain.campaign.services.campaign_documents_service import (
    create_campaign_document,
    delete_campaign_document,
    get_campaign_document_by_uuid,
    get_campaign_documents,
    update_campaign_document,
)
from cible.domain.exceptions import NotFoundException
from cible.mapper.campaign.campaign_documents_mapper import (
    campaign_documents_mapper_api_to_bean,
    campaign_documents_mapper_bean_to_api,
)


class CampaignDocumentsController(ViewSet):
    """Controller REST pour les documents de campagne."""
    lookup_field = "uuid"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = get_campaign_container().campaign_documents_repository()

    @action(detail=False, methods=["get"], url_path="campaign/(?P<campaign_uuid>[^/.]+)")
    def list_by_campaign(self, request, campaign_uuid=None):
        """Liste tous les documents d'une campagne."""
        try:
            beans = get_campaign_documents(self.repository, campaign_uuid)
            result = [campaign_documents_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def retrieve(self, request, uuid=None):
        """Récupère un document par UUID."""
        try:
            bean = get_campaign_document_by_uuid(self.repository, uuid)
            return JsonResponse(campaign_documents_mapper_bean_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def create(self, request):
        """Crée un nouveau document."""
        try:
            data = json.loads(request.body) if request.body else request.data
            bean = campaign_documents_mapper_api_to_bean(data)
            result = create_campaign_document(self.repository, bean)
            return JsonResponse(campaign_documents_mapper_bean_to_api(result), status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def update(self, request, uuid=None):
        """Met à jour un document."""
        try:
            data = json.loads(request.body) if request.body else request.data
            data["uuid"] = uuid
            bean = campaign_documents_mapper_api_to_bean(data)
            result = update_campaign_document(self.repository, bean)
            return JsonResponse(campaign_documents_mapper_bean_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def destroy(self, request, uuid=None):
        """Supprime un document."""
        try:
            delete_campaign_document(self.repository, uuid)
            return JsonResponse({"success": True}, status=204)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
