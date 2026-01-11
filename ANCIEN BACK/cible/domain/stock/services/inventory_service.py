from cible.domain.stock.interface.i_inventory_repository import IInventoryRepository
from cible.domain.stock.models.inventory_basic_parts_catalog_bean import (
    InventoryBasicPartsCatalogBean,
)
from cible.domain.stock.models.inventory_ec_structuring_bean import (
    InventoryEcStructuringBean,
)
from cible.domain.stock.models.inventory_lmj_bean import InventoryLmjBean
from cible.domain.stock.models.inventory_omega_bean import InventoryOmegaBean


def get_all_inventory_basic_parts_catalog(
    repository: IInventoryRepository,
) -> list[InventoryBasicPartsCatalogBean]:
    return repository.get_all_inventory_basic_parts_catalog()


def get_all_inventory_ec_structuring(
    repository: IInventoryRepository,
) -> list[InventoryEcStructuringBean]:
    return repository.get_all_inventory_ec_structuring()


def get_all_inventory_lmj(repository: IInventoryRepository) -> list[InventoryLmjBean]:
    return repository.get_all_inventory_lmj()


def get_all_inventory_omega(
    repository: IInventoryRepository,
) -> list[InventoryOmegaBean]:
    return repository.get_all_inventory_omega()


def delete_inventory_basic_parts_catalog(
    uuid: str, repository: IInventoryRepository
) -> list[InventoryBasicPartsCatalogBean]:
    return repository.delete_inventory_basic_parts_catalog(uuid)


def create_inventory_basic_parts_catalog(
    repository: IInventoryRepository,
    inventory_basic_parts_catalog_bean: InventoryBasicPartsCatalogBean,
) -> list[InventoryBasicPartsCatalogBean]:
    return repository.create_inventory_basic_parts_catalog(
        inventory_basic_parts_catalog_bean
    )


def delete_inventory_ec_structuring(
    uuid: str, repository: IInventoryRepository
) -> list[InventoryEcStructuringBean]:
    return repository.delete_inventory_ec_structuring(uuid)


def create_inventory_ec_structuring(
    repository: IInventoryRepository,
    inventory_ec_structuring_bean: InventoryEcStructuringBean,
) -> list[InventoryEcStructuringBean]:
    return repository.create_inventory_ec_structuring(inventory_ec_structuring_bean)


def delete_inventory_lmj(
    uuid: str, repository: IInventoryRepository
) -> list[InventoryLmjBean]:
    return repository.delete_inventory_lmj(uuid)


def create_inventory_lmj(
    repository: IInventoryRepository, inventory_lmj_bean: InventoryLmjBean
) -> list[InventoryLmjBean]:
    return repository.create_inventory_lmj(inventory_lmj_bean)


def delete_inventory_omega(
    uuid: str, repository: IInventoryRepository
) -> list[InventoryOmegaBean]:
    return repository.delete_inventory_omega(uuid)


def create_inventory_omega(
    repository: IInventoryRepository, inventory_omega_bean: InventoryOmegaBean
) -> list[InventoryOmegaBean]:
    return repository.create_inventory_omega(inventory_omega_bean)


def create_inventory_basic_parts_catalog_from_excel_sheet(
    repository: IInventoryRepository,
    inventory_basic_parts_catalog_bean: InventoryBasicPartsCatalogBean,
) -> None:
    return repository.create_inventory_basic_parts_catalog_from_excel_sheet(
        inventory_basic_parts_catalog_bean
    )


def create_inventory_ec_structuring_from_excel_sheet(
    repository: IInventoryRepository,
    inventory_ec_structuring_bean: InventoryEcStructuringBean,
) -> None:
    return repository.create_inventory_ec_structuring_from_excel_sheet(
        inventory_ec_structuring_bean
    )


def create_inventory_lmj_from_excel_sheet(
    repository: IInventoryRepository, inventory_lmj_bean: InventoryLmjBean
) -> None:
    return repository.create_inventory_lmj_from_excel_sheet(inventory_lmj_bean)


def create_inventory_omega_from_excel_sheet(
    repository: IInventoryRepository, inventory_omega_bean: InventoryOmegaBean
) -> None:
    return repository.create_inventory_omega_from_excel_sheet(inventory_omega_bean)


def add_additional_comment_to_basic_parts_catalog(
    repository: IInventoryRepository, comment: str, object_uuid: str
) -> None:
    return repository.add_additional_comment_to_basic_parts_catalog(
        comment, object_uuid
    )


def add_additional_comment_to_ec_structuring(
    repository: IInventoryRepository, comment: str, object_uuid: str
) -> None:
    return repository.add_additional_comment_to_ec_structuring(comment, object_uuid)


def add_additional_comment_to_inventory_lmj(
    repository: IInventoryRepository, comment: str, object_uuid: str
) -> None:
    return repository.add_additional_comment_to_inventory_lmj(comment, object_uuid)


def add_additional_comment_to_inventory_omega(
    repository: IInventoryRepository, comment: str, object_uuid: str
) -> None:
    return repository.add_additional_comment_to_inventory_omega(comment, object_uuid)
