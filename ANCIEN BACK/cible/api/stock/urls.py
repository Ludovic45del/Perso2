from django.urls import path

from cible.api.stock import (
    consumables_controller,
    inventory_controller,
    structuring_controller,
    transfert_controller,
)
from cible.api.stock.file_upload_controller import FileUploadController

urlpatterns = [
    path(
        "get-all-consumables-glues",
        consumables_controller.ConsumablesGluesController.as_view(
            {"get": "get_all_consumables_glues"}
        ),
        name="consumables_view",
    ),
    path(
        "consumables-glues/<uuid:uuid>",
        consumables_controller.ConsumablesGluesController.as_view(
            {
                "delete": "delete_consumables_glues",
            }
        ),
        name="consumables_view",
    ),
    path(
        "consumables-glues",
        consumables_controller.ConsumablesGluesController.as_view(
            {
                "post": "create_consumables_glues",
                "put": "add_additional_comment",
            }
        ),
        name="consumables_view",
    ),
    path(
        "get-all-other-consumables",
        consumables_controller.OtherConsumablesController.as_view(
            {"get": "get_all_other_consumables"}
        ),
        name="consumables_view",
    ),
    path(
        "other-consumables/<uuid:uuid>",
        consumables_controller.OtherConsumablesController.as_view(
            {
                "delete": "delete_other_consumables",
            }
        ),
        name="consumables_view",
    ),
    path(
        "other-consumables",
        consumables_controller.OtherConsumablesController.as_view(
            {
                "post": "create_other_consumables",
                "put": "add_additional_comment",
            }
        ),
        name="consumables_view",
    ),
    path(
        "get-all-structuring",
        structuring_controller.StructuringController.as_view(
            {"get": "get_all_structuring"}
        ),
        name="structuring_view",
    ),
    path(
        "structuring/<uuid:uuid>",
        structuring_controller.StructuringController.as_view(
            {
                "delete": "delete_structuring",
            }
        ),
        name="structuring_view",
    ),
    path(
        "structuring",
        structuring_controller.StructuringController.as_view(
            {
                "post": "create_structuring",
                "put": "add_additional_comment",
            }
        ),
        name="structuring_view",
    ),
    path(
        "get-all-special-structuring",
        structuring_controller.SpecialStructuringController.as_view(
            {"get": "get_all_special_structuring"}
        ),
        name="structuring_view",
    ),
    path(
        "special-structuring/<uuid:uuid>",
        structuring_controller.SpecialStructuringController.as_view(
            {
                "delete": "delete_special_structuring",
            }
        ),
        name="structuring_view",
    ),
    path(
        "special-structuring",
        structuring_controller.SpecialStructuringController.as_view(
            {
                "post": "create_special_structuring",
                "put": "add_additional_comment",
            }
        ),
        name="structuring_view",
    ),
    path(
        "get-all-transfers",
        transfert_controller.TransfersController.as_view({"get": "get_all_transfers"}),
        name="transfers_view",
    ),
    path(
        "transfers",
        transfert_controller.TransfersController.as_view(
            {
                "post": "create_transfers",
            }
        ),
        name="transfers_view",
    ),
    path(
        "get-all-inventory-basic-parts-catalog",
        inventory_controller.InventoryBasicPartsCatalogController.as_view(
            {"get": "get_all_inventory_basic_parts_catalog"}
        ),
        name="inventory_view",
    ),
    path(
        "inventory-basic-parts-catalog/<uuid:uuid>",
        inventory_controller.InventoryBasicPartsCatalogController.as_view(
            {
                "delete": "delete_inventory_basic_parts_catalog",
            }
        ),
        name="inventory_view",
    ),
    path(
        "inventory-basic-parts-catalog",
        inventory_controller.InventoryBasicPartsCatalogController.as_view(
            {
                "post": "create_inventory_basic_parts_catalog",
                "put": "add_additional_comment",
            }
        ),
        name="inventory_view",
    ),
    path(
        "get-all-inventory-ec-structuring",
        inventory_controller.InventoryEcStructuringController.as_view(
            {"get": "get_all_inventory_ec_structuring"}
        ),
        name="inventory_view",
    ),
    path(
        "inventory-ec-structuring/<uuid:uuid>",
        inventory_controller.InventoryEcStructuringController.as_view(
            {
                "delete": "delete_inventory_ec_structuring",
            }
        ),
        name="inventory_view",
    ),
    path(
        "inventory-ec-structuring",
        inventory_controller.InventoryEcStructuringController.as_view(
            {
                "post": "create_inventory_ec_structuring",
                "put": "add_additional_comment",
            }
        ),
        name="inventory_view",
    ),
    path(
        "get-all-inventory-lmj",
        inventory_controller.InventoryLmjController.as_view(
            {"get": "get_all_inventory_lmj"}
        ),
        name="inventory_view",
    ),
    path(
        "inventory-lmj/<uuid:uuid>",
        inventory_controller.InventoryLmjController.as_view(
            {
                "delete": "delete_inventory_lmj",
            }
        ),
        name="inventory_view",
    ),
    path(
        "inventory-lmj",
        inventory_controller.InventoryLmjController.as_view(
            {
                "post": "create_inventory_lmj",
                "put": "add_additional_comment",
            }
        ),
        name="inventory_view",
    ),
    path(
        "get-all-inventory-omega",
        inventory_controller.InventoryOmegaController.as_view(
            {"get": "get_all_inventory_omega"}
        ),
        name="inventory_view",
    ),
    path(
        "inventory-omega/<uuid:uuid>",
        inventory_controller.InventoryOmegaController.as_view(
            {
                "delete": "delete_inventory_omega",
            }
        ),
        name="inventory_view",
    ),
    path(
        "inventory-omega",
        inventory_controller.InventoryOmegaController.as_view(
            {
                "post": "create_inventory_omega",
                "put": "add_additional_comment",
            }
        ),
        name="inventory_view",
    ),
    path(
        "upload-file",
        FileUploadController.as_view(
            {
                "post": "upload_and_process_excel_file",
            }
        ),
        name="file_upload_view",
    ),
]
