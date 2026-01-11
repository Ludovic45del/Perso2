"""Controller Referential - API REST pour les référentiels FSEC."""
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet

from cible.repository.fsec.models.fsec_category_entity import FsecCategoryEntity
from cible.repository.fsec.models.fsec_status_entity import FsecStatusEntity
from cible.repository.fsec.models.fsec_rack_entity import FsecRackEntity
from cible.repository.fsec.models.fsec_roles_entity import FsecRolesEntity
from cible.repository.fsec.models.fsec_document_types_entity import FsecDocumentTypesEntity
from cible.repository.fsec.models.fsec_document_subtypes_entity import FsecDocumentSubtypesEntity
from cible.repository.steps.models.assembly_bench_entity import AssemblyBenchEntity
from cible.repository.steps.models.metrology_machine_entity import MetrologyMachineEntity


class ReferentialController(ViewSet):
    """Controller REST pour les référentiels."""

    @action(detail=False, methods=["get"], url_path="fsec-categories")
    def list_fsec_categories(self, request):
        """Liste toutes les catégories FSEC."""
        try:
            entities = FsecCategoryEntity.objects.all()
            result = [
                {
                    "id": entity.id,
                    "label": entity.label,
                    "color": entity.color,
                }
                for entity in entities
            ]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="fsec-statuses")
    def list_fsec_statuses(self, request):
        """Liste tous les statuts FSEC."""
        try:
            entities = FsecStatusEntity.objects.all()
            result = [
                {
                    "id": entity.id,
                    "label": entity.label,
                    "color": entity.color,
                }
                for entity in entities
            ]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="fsec-racks")
    def list_fsec_racks(self, request):
        """Liste tous les racks FSEC."""
        try:
            entities = FsecRackEntity.objects.all()
            result = [
                {
                    "id": entity.id,
                    "label": entity.label,
                    "color": entity.color,
                    "is_full": entity.is_full,
                }
                for entity in entities
            ]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="fsec-roles")
    def list_fsec_roles(self, request):
        """Liste tous les rôles FSEC."""
        try:
            entities = FsecRolesEntity.objects.all()
            result = [
                {
                    "id": entity.id,
                    "label": entity.label,
                }
                for entity in entities
            ]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="fsec-document-types")
    def list_fsec_document_types(self, request):
        """Liste tous les types de documents FSEC."""
        try:
            entities = FsecDocumentTypesEntity.objects.all()
            result = [
                {
                    "id": entity.id,
                    "label": entity.label,
                }
                for entity in entities
            ]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="fsec-document-subtypes")
    def list_fsec_document_subtypes(self, request):
        """
        Liste tous les sous-types de documents FSEC.
        Query params:
        - type_id: filter by document type ID
        """
        try:
            type_id = request.GET.get("type_id")
            if type_id:
                entities = FsecDocumentSubtypesEntity.objects.filter(type_id=type_id)
            else:
                entities = FsecDocumentSubtypesEntity.objects.all()

            result = [
                {
                    "id": entity.id,
                    "label": entity.label,
                    "type_id": entity.type_id.id if entity.type_id else None,
                }
                for entity in entities
            ]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="assembly-benches")
    def list_assembly_benches(self, request):
        """Liste tous les bancs d'assemblage."""
        try:
            entities = AssemblyBenchEntity.objects.all()
            result = [
                {
                    "id": entity.id,
                    "label": entity.label,
                    "color": entity.color,
                }
                for entity in entities
            ]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="metrology-machines")
    def list_metrology_machines(self, request):
        """Liste toutes les machines de métrologie."""
        try:
            entities = MetrologyMachineEntity.objects.all()
            result = [
                {
                    "id": entity.id,
                    "label": entity.label,
                    "color": entity.color,
                }
                for entity in entities
            ]
            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="workflow-steps")
    def list_workflow_steps(self, request):
        """Liste tous les steps du workflow Sans Gaz."""
        from cible.domain.fsec.services import workflow_service

        try:
            steps = workflow_service.get_all_steps()
            return JsonResponse(steps, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="required-roles")
    def get_required_roles(self, request):
        """
        Retourne les rôles requis par step.
        Query params:
        - step: nom du step (optionnel)
        """
        from cible.domain.fsec.constants import REQUIRED_ROLES

        try:
            step = request.GET.get("step")
            if step:
                roles = REQUIRED_ROLES.get(step, [])
                return JsonResponse({"step": step, "required_roles": roles})
            else:
                return JsonResponse(REQUIRED_ROLES)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @action(detail=False, methods=["get"], url_path="required-documents")
    def get_required_documents(self, request):
        """
        Retourne les documents requis par step.
        Query params:
        - step: nom du step (optionnel)
        """
        from cible.domain.fsec.constants import REQUIRED_SUBTYPES_DOCS

        try:
            step = request.GET.get("step")
            if step:
                docs = REQUIRED_SUBTYPES_DOCS.get(step, [])
                return JsonResponse({"step": step, "required_documents": docs})
            else:
                return JsonResponse(REQUIRED_SUBTYPES_DOCS)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
