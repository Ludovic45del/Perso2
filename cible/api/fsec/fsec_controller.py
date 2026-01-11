"""Controller FSEC - API REST."""
import json
import logging

from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

from cible.domain.exceptions import ConflictException, NotFoundException
from cible.domain.fsec.container import get_fsec_container
from cible.domain.fsec.services.fsec_service import (
    create_fsec,
    create_new_version,
    delete_fsec,
    get_active_fsec,
    get_all_active_fsecs,
    get_all_fsecs,
    get_fsec_by_version_uuid,
    get_fsec_versions,
    get_fsecs_by_campaign,
    update_fsec,
)
from cible.domain.fsec.services import workflow_service, validation_service
from cible.mapper.fsec.fsec_mapper import (
    fsec_mapper_api_to_bean,
    fsec_mapper_bean_to_api,
)

logger = logging.getLogger(__name__)


class FsecController(ViewSet):
    """Controller REST pour les FSECs."""
    lookup_field = "version_uuid"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = get_fsec_container().fsec_repository()

    def list(self, request):
        """Liste tous les FSECs (GET /)."""
        try:
            beans = get_all_fsecs(self.repository)
            result = [fsec_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    def retrieve(self, request, version_uuid=None):
        """Récupère un FSEC par version_uuid (GET /:version_uuid/)."""
        try:
            bean = get_fsec_by_version_uuid(self.repository, version_uuid)
            return JsonResponse(fsec_mapper_bean_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def create(self, request):
        """Crée un nouveau FSEC (POST /)."""
        try:
            data = json.loads(request.body) if request.body else request.data
            bean = fsec_mapper_api_to_bean(data)
            result = create_fsec(self.repository, bean)
            return JsonResponse(fsec_mapper_bean_to_api(result), status=201)
        except ConflictException as e:
            return JsonResponse({"error": str(e)}, status=409)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def update(self, request, version_uuid=None):
        """Met à jour un FSEC (PUT /:version_uuid/)."""
        try:
            data = json.loads(request.body) if request.body else request.data
            data["version_uuid"] = version_uuid
            bean = fsec_mapper_api_to_bean(data)
            result = update_fsec(self.repository, bean)
            return JsonResponse(fsec_mapper_bean_to_api(result))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def destroy(self, request, version_uuid=None):
        """Supprime un FSEC (DELETE /:version_uuid/)."""
        try:
            delete_fsec(self.repository, version_uuid)
            return JsonResponse({"success": True}, status=204)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # Custom Actions
    @action(detail=False, methods=["get"], url_path="active")
    def list_active_fsecs(self, request):
        """Liste tous les FSECs actifs."""
        try:
            beans = get_all_active_fsecs(self.repository)
            result = [fsec_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="campaign/(?P<campaign_id>[^/.]+)")
    def list_by_campaign(self, request, campaign_id=None):
        """Liste tous les FSECs d'une campagne."""
        try:
            beans = get_fsecs_by_campaign(self.repository, campaign_id)
            result = [fsec_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="versions/(?P<fsec_uuid>[^/.]+)")
    def get_versions(self, request, fsec_uuid=None):
        """Récupère toutes les versions d'un FSEC."""
        try:
            beans = get_fsec_versions(self.repository, fsec_uuid)
            result = [fsec_mapper_bean_to_api(bean) for bean in beans]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="active/(?P<fsec_uuid>[^/.]+)")
    def get_active(self, request, fsec_uuid=None):
        """Récupère la version active d'un FSEC."""
        try:
            bean = get_active_fsec(self.repository, fsec_uuid)
            return JsonResponse(fsec_mapper_bean_to_api(bean))
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    @action(detail=False, methods=["post"], url_path="version/(?P<fsec_uuid>[^/.]+)")
    def create_version(self, request, fsec_uuid=None):
        """Crée une nouvelle version d'un FSEC existant."""
        try:
            data = json.loads(request.body) if request.body else request.data
            bean = fsec_mapper_api_to_bean(data)
            result = create_new_version(self.repository, fsec_uuid, bean)
            return JsonResponse(fsec_mapper_bean_to_api(result), status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # Workflow Management Actions
    @action(detail=True, methods=["get"], url_path="workflow-progress")
    def get_workflow_progress(self, request, version_uuid=None):
        """
        Récupère la progression workflow d'un FSEC.
        GET /fsecs/:version_uuid/workflow-progress/
        """
        try:
            bean = get_fsec_by_version_uuid(self.repository, version_uuid)
            if not bean.current_step:
                return JsonResponse({"error": "FSEC n'a pas de step actuel défini"}, status=400)

            progress = workflow_service.get_workflow_progress(bean.current_step)
            return JsonResponse(progress)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=True, methods=["get"], url_path="validation-status")
    def get_validation_status(self, request, version_uuid=None):
        """
        Récupère le statut de validation d'un FSEC (rôles + documents).
        GET /fsecs/:version_uuid/validation-status/
        Query params:
        - assigned_roles: comma-separated list of role codes
        - validated_docs: comma-separated list of document subtypes
        """
        try:
            bean = get_fsec_by_version_uuid(self.repository, version_uuid)
            if not bean.current_step:
                return JsonResponse({"error": "FSEC n'a pas de step actuel défini"}, status=400)

            # Parse query params
            assigned_roles = request.GET.get("assigned_roles", "").split(",") if request.GET.get("assigned_roles") else []
            validated_docs = request.GET.get("validated_docs", "").split(",") if request.GET.get("validated_docs") else []

            # Filter empty strings
            assigned_roles = [r.strip() for r in assigned_roles if r.strip()]
            validated_docs = [d.strip() for d in validated_docs if d.strip()]

            validation_status = validation_service.get_step_validation_status(
                bean.current_step,
                assigned_roles,
                validated_docs
            )
            return JsonResponse(validation_status)
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=True, methods=["post"], url_path="can-advance")
    def check_can_advance(self, request, version_uuid=None):
        """
        Vérifie si un FSEC peut avancer au step suivant.
        POST /fsecs/:version_uuid/can-advance/
        Body: {
            "current_step_validated": true/false,
            "assigned_roles": ["role1", "role2"],
            "validated_docs": ["doc1", "doc2"]
        }
        """
        try:
            bean = get_fsec_by_version_uuid(self.repository, version_uuid)
            if not bean.current_step:
                return JsonResponse({"error": "FSEC n'a pas de step actuel défini"}, status=400)

            data = json.loads(request.body) if request.body else request.data
            current_step_validated = data.get("current_step_validated", False)
            assigned_roles = data.get("assigned_roles", [])
            validated_docs = data.get("validated_docs", [])

            # Check roles and docs
            roles_ok, missing_roles = validation_service.check_required_roles(
                bean.current_step, assigned_roles
            )
            docs_ok, missing_docs = validation_service.check_required_documents(
                bean.current_step, validated_docs
            )

            # Check if can advance
            can_advance, blocking_reasons = workflow_service.can_advance_to_next_step(
                bean,
                current_step_validated,
                roles_ok,
                docs_ok
            )

            return JsonResponse({
                "can_advance": can_advance,
                "blocking_reasons": blocking_reasons,
                "current_step": bean.current_step,
                "next_step": workflow_service.get_next_step(bean.current_step),
                "validation_details": {
                    "roles_satisfied": roles_ok,
                    "missing_roles": missing_roles,
                    "documents_satisfied": docs_ok,
                    "missing_documents": missing_docs,
                }
            })
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=True, methods=["post"], url_path="advance")
    def advance_workflow(self, request, version_uuid=None):
        """
        Avance le FSEC au step suivant du workflow.
        POST /fsecs/:version_uuid/advance/
        Body: {
            "current_step_validated": true,
            "assigned_roles": ["role1", "role2"],
            "validated_docs": ["doc1", "doc2"]
        }
        """
        try:
            bean = get_fsec_by_version_uuid(self.repository, version_uuid)
            if not bean.current_step:
                return JsonResponse({"error": "FSEC n'a pas de step actuel défini"}, status=400)

            data = json.loads(request.body) if request.body else request.data
            current_step_validated = data.get("current_step_validated", False)
            assigned_roles = data.get("assigned_roles", [])
            validated_docs = data.get("validated_docs", [])

            # Check roles and docs
            roles_ok, missing_roles = validation_service.check_required_roles(
                bean.current_step, assigned_roles
            )
            docs_ok, missing_docs = validation_service.check_required_documents(
                bean.current_step, validated_docs
            )

            # Check if can advance
            can_advance, blocking_reasons = workflow_service.can_advance_to_next_step(
                bean,
                current_step_validated,
                roles_ok,
                docs_ok
            )

            if not can_advance:
                return JsonResponse({
                    "error": "Cannot advance to next step",
                    "blocking_reasons": blocking_reasons
                }, status=400)

            # Advance to next step
            previous_step = bean.current_step
            bean = workflow_service.advance_step(bean)

            # Save updated FSEC
            result = update_fsec(self.repository, bean)

            return JsonResponse({
                "success": True,
                "message": f"FSEC advanced from {previous_step} to {result.current_step}",
                "fsec": fsec_mapper_bean_to_api(result)
            })
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=True, methods=["post"], url_path="validate-step")
    def validate_current_step(self, request, version_uuid=None):
        """
        Valide le step actuel d'un FSEC.
        POST /fsecs/:version_uuid/validate-step/
        Body: {
            "assigned_roles": ["role1", "role2"],
            "validated_docs": ["doc1", "doc2"],
            "step_is_validated": true
        }
        """
        try:
            bean = get_fsec_by_version_uuid(self.repository, version_uuid)
            if not bean.current_step:
                return JsonResponse({"error": "FSEC n'a pas de step actuel défini"}, status=400)

            data = json.loads(request.body) if request.body else request.data
            assigned_roles = data.get("assigned_roles", [])
            validated_docs = data.get("validated_docs", [])
            step_is_validated = data.get("step_is_validated", False)

            # Validate step completion
            is_complete, blocking_reasons = validation_service.validate_step_completion(
                bean.current_step,
                assigned_roles,
                validated_docs,
                step_is_validated
            )

            return JsonResponse({
                "step": bean.current_step,
                "is_complete": is_complete,
                "blocking_reasons": blocking_reasons,
                "validation_status": validation_service.get_step_validation_status(
                    bean.current_step,
                    assigned_roles,
                    validated_docs
                )
            })
        except NotFoundException as e:
            return JsonResponse({"error": str(e)}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
