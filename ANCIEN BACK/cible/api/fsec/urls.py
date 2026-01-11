from django.urls import path

from cible.api.fsec import fsec_controller
from cible.api.fsec.fsec_assembly_bench_controller import FsecAssemblyBenchController
from cible.api.fsec.fsec_category_controller import FsecCategoryController
from cible.api.fsec.fsec_metrology_machine_controller import (
    FsecMetrologyMachineController,
)
from cible.api.fsec.fsec_rack_controller import FsecRackController
from cible.api.fsec.fsec_status_controller import FsecStatusController

urlpatterns = [
    path(
        "",
        fsec_controller.FsecController.as_view(
            {"get": "get_all_fsecs", "post": "create_fsec", "put": "update_fsec"}
        ),
        name="fsec_view",
    ),
    path(
        "<uuid:uuid>",
        fsec_controller.FsecController.as_view(
            {
                "get": "get_fsec_by_uuid",
            }
        ),
        name="fsec_view",
    ),
    path(
        "category",
        FsecCategoryController.as_view({"get": "get_fsec_categories"}),
        name="fsec_category_view",
    ),
    path(
        "metrology-machine",
        FsecMetrologyMachineController.as_view({"get": "get_all_machines"}),
        name="fsec_metrology_machine_view",
    ),
    path(
        "<uuid:uuid>",
        fsec_controller.FsecController.as_view({"delete": "delete_fsec"}),
        name="fsec_view",
    ),
    path(
        "status",
        FsecStatusController.as_view({"post": "get_fsec_status"}),
        name="fsec_status_view",
    ),
    path(
        "racks",
        FsecRackController.as_view({"get": "get_all_racks_available"}),
        name="fsec_rack_view",
    ),
    path(
        "assembly-bench",
        FsecAssemblyBenchController.as_view({"get": "get_all_benches"}),
        name="fsec_bench_view",
    ),
    path(
        "campaign/<str:campaign_uuid>",
        fsec_controller.FsecController.as_view(
            {"get": "get_all_fsecs_by_campaign_uuid"}
        ),
        name="fsec_view",
    ),
    path(
        "workflow/assembly/<uuid:fsec_uuid>",
        fsec_controller.FsecController.as_view({"post": "return_to_assembly_step"}),
        name="fsec_view",
    ),
    path(
        "workflow/metrology/<uuid:fsec_uuid>",
        fsec_controller.FsecController.as_view({"post": "return_to_metrology_step"}),
        name="fsec_view",
    ),
    path(
        "workflow/depressurization-fail/<uuid:fsec_uuid>",
        fsec_controller.FsecController.as_view(
            {"post": "change_depressurization_status"}
        ),
        name="fsec_view",
    ),
    path(
        "workflow/repressurization/<uuid:fsec_uuid>",
        fsec_controller.FsecController.as_view(
            {"post": "return_to_repressurization_step"}
        ),
        name="fsec_view",
    ),
    path(
        "workflow/reassembly/<uuid:fsec_uuid>",
        fsec_controller.FsecController.as_view({"post": "return_to_re_assembly_step"}),
        name="fsec_view",
    ),
]
