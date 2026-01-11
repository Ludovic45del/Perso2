import abc

from cible.domain.stock.models.inventory_basic_parts_catalog_bean import (
    InventoryBasicPartsCatalogBean,
)
from cible.domain.stock.models.inventory_ec_structuring_bean import (
    InventoryEcStructuringBean,
)
from cible.domain.stock.models.inventory_lmj_bean import InventoryLmjBean
from cible.domain.stock.models.inventory_omega_bean import InventoryOmegaBean


class IInventoryRepository:

    @abc.abstractmethod
    def get_all_inventory_basic_parts_catalog(
        self,
    ) -> list[InventoryBasicPartsCatalogBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_all_inventory_ec_structuring(self) -> list[InventoryEcStructuringBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_all_inventory_lmj(self) -> list[InventoryLmjBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_all_inventory_omega(self) -> list[InventoryOmegaBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_inventory_basic_parts_catalog(
        self, uuid
    ) -> list[InventoryBasicPartsCatalogBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_inventory_basic_parts_catalog(
        self, inventory_basic_parts_catalog_bean: InventoryBasicPartsCatalogBean
    ) -> list[InventoryBasicPartsCatalogBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_inventory_ec_structuring(self, uuid) -> list[InventoryEcStructuringBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_inventory_ec_structuring(
        self, inventory_ec_structuring_bean: InventoryEcStructuringBean
    ) -> list[InventoryEcStructuringBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_inventory_lmj(self, uuid) -> list[InventoryLmjBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_inventory_lmj(
        self, inventory_lmj_bean: InventoryLmjBean
    ) -> list[InventoryLmjBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_inventory_omega(self, uuid) -> list[InventoryOmegaBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_inventory_omega(
        self, inventory_omega_bean: InventoryOmegaBean
    ) -> list[InventoryOmegaBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_inventory_basic_parts_catalog_from_excel_sheet(
        self, inventory_basic_parts_catalog_bean: InventoryBasicPartsCatalogBean
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def create_inventory_ec_structuring_from_excel_sheet(
        self, inventory_ec_structuring_bean: InventoryEcStructuringBean
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def create_inventory_lmj_from_excel_sheet(
        self, inventory_lmj_bean: InventoryLmjBean
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def create_inventory_omega_from_excel_sheet(
        self, inventory_omega_bean: InventoryOmegaBean
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def add_additional_comment_to_basic_parts_catalog(
        self, comment: str, object_uuid: str
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def add_additional_comment_to_ec_structuring(
        self, comment: str, object_uuid: str
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def add_additional_comment_to_inventory_lmj(
        self, comment: str, object_uuid: str
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def add_additional_comment_to_inventory_omega(
        self, comment: str, object_uuid: str
    ) -> None:
        raise NotImplementedError
