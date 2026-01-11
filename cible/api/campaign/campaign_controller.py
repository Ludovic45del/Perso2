"""Controller Campaign - API REST."""
import json
import logging

from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

from cible.domain.campaign.services.campaign_service import (
    create_campaign,
    delete_campaign,
    get_all_campaigns,
    get_campaign_by_uuid,
    patch_campaign,
    update_campaign,
)
from cible.domain.campaign.container import get_campaign_container
from cible.domain.exceptions import ConflictException, NotFoundException
from cible.mapper.campaign.campaign_mapper import (
    campaign_mapper_api_to_bean,
    campaign_mapper_bean_to_api,
)
from cible.mapper.utils import parse_date_string

logger = logging.getLogger(__name__)


class CampaignController(ViewSet):
    """Controller REST pour les campagnes."""
    lookup_field = "uuid"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = get_campaign_container().campaign_repository()

    def list(self, request):
        """Liste toutes les campagnes (GET /)."""
        try:
            beans = get_all_campaigns(self.repository)
            result = [campaign_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            logger.exception("Erreur lors de la récupération des campagnes")
            return JsonResponse({"error": "Erreur serveur interne"}, status=500)

    def retrieve(self, request, uuid=None):
        """Récupère une campagne par UUID (GET /:uuid/)."""
        try:
            bean = get_campaign_by_uuid(self.repository, uuid)
            return JsonResponse(campaign_mapper_bean_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            logger.exception("Erreur lors de la récupération de la campagne %s", uuid)
            return JsonResponse({"error": "Erreur serveur interne"}, status=500)

    def create(self, request):
        """Crée une nouvelle campagne (POST /)."""
        try:
            data = self._parse_request_data(request)
            bean = campaign_mapper_api_to_bean(data)
            result = create_campaign(self.repository, bean)
            return JsonResponse(campaign_mapper_bean_to_api(result), status=201)
        except ConflictException as e:
            return JsonResponse({"error": str(e)}, status=409)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            logger.exception("Erreur lors de la création de la campagne")
            return JsonResponse({"error": "Erreur serveur interne"}, status=500)

    def update(self, request, uuid=None):
        """Met à jour une campagne (PUT /:uuid/)."""
        try:
            data = self._parse_request_data(request)
            data["uuid"] = uuid
            bean = campaign_mapper_api_to_bean(data)
            result = update_campaign(self.repository, bean)
            return JsonResponse(campaign_mapper_bean_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except ConflictException as e:
            return JsonResponse({"error": str(e)}, status=409)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            logger.exception("Erreur lors de la mise à jour de la campagne %s", uuid)
            return JsonResponse({"error": "Erreur serveur interne"}, status=500)
            
    def partial_update(self, request, uuid=None):
        """Met à jour partiellement une campagne (PATCH /:uuid/)."""
        try:
            data = self._parse_request_data(request)
            
            for date_field in ["start_date", "end_date"]:
                if date_field in data:
                    data[date_field] = parse_date_string(data[date_field])
                    
            result = patch_campaign(self.repository, uuid, data)
            return JsonResponse(campaign_mapper_bean_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except ConflictException as e:
            return JsonResponse({"error": str(e)}, status=409)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            logger.exception("Erreur lors du patch de la campagne %s", uuid)
            return JsonResponse({"error": "Erreur serveur interne"}, status=500)

    def destroy(self, request, uuid=None):
        """Supprime une campagne (DELETE /:uuid/)."""
        try:
            delete_campaign(self.repository, uuid)
            return HttpResponse(status=204)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            logger.exception("Erreur lors de la suppression de la campagne %s", uuid)
            return JsonResponse({"error": "Erreur serveur interne"}, status=500)

    def _parse_request_data(self, request) -> dict:
        """Parse les données de la requête de manière robuste."""
        if request.body:
            return json.loads(request.body)
        elif hasattr(request, "data") and request.data:
            return dict(request.data)
        return {}
