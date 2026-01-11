import uuid

from django.db import transaction
from django.shortcuts import get_object_or_404

from cible.domain.stock.interface.i_inventory_repository import IInventoryRepository
from cible.domain.stock.models.inventory_basic_parts_catalog_bean import (
    InventoryBasicPartsCatalogBean,
)
from cible.domain.stock.models.inventory_ec_structuring_bean import (
    InventoryEcStructuringBean,
)
from cible.domain.stock.models.inventory_lmj_bean import InventoryLmjBean
from cible.domain.stock.models.inventory_omega_bean import InventoryOmegaBean
from cible.mapper.stock.inventory_basic_parts_catalog_mapper import (
    inventory_basic_parts_catalog_mapper_bean_to_entity,
    inventory_basic_parts_catalog_mapper_entity_to_bean,
)
from cible.mapper.stock.inventory_ec_structuring_mapper import (
    inventory_ec_structuring_mapper_bean_to_entity,
    inventory_ec_structuring_mapper_entity_to_bean,
)
from cible.mapper.stock.inventory_lmj_mapper import (
    inventory_lmj_mapper_bean_to_entity,
    inventory_lmj_mapper_entity_to_bean,
)
from cible.mapper.stock.inventory_omega_mapper import (
    inventory_omega_mapper_bean_to_entity,
    inventory_omega_mapper_entity_to_bean,
)
from cible.repository.fsec.models.fsec import FsecEntity
from cible.repository.stock.models.inventory.inventory_basic_parts_catalog import (
    InventoryBasicPartsCatalogEntity,
)
from cible.repository.stock.models.inventory.inventory_ec_structuring import (
    InventoryEcStructuringEntity,
)
from cible.repository.stock.models.inventory.inventory_lmj import InventoryLmjEntity
from cible.repository.stock.models.inventory.inventory_omega import InventoryOmegaEntity


class InventoryRepository(IInventoryRepository):

    def get_all_inventory_basic_parts_catalog(
        self,
    ) -> list[InventoryBasicPartsCatalogBean]:
        benches = InventoryBasicPartsCatalogEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_basic_parts_catalog_mapper_entity_to_bean(x),
                    benches,
                )
            )

    def get_all_inventory_ec_structuring(self) -> list[InventoryEcStructuringBean]:
        benches = InventoryEcStructuringEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_ec_structuring_mapper_entity_to_bean(x),
                    benches,
                )
            )

    def get_all_inventory_lmj(self) -> list[InventoryLmjBean]:
        benches = InventoryLmjEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_lmj_mapper_entity_to_bean(x),
                    benches,
                )
            )

    def get_all_inventory_omega(self) -> list[InventoryOmegaBean]:
        benches = InventoryOmegaEntity.objects.all()
        if len(benches) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_omega_mapper_entity_to_bean(x),
                    benches,
                )
            )

    @transaction.atomic
    def delete_inventory_omega(self, object_uuid) -> list[InventoryOmegaBean]:
        inventory_omega = get_object_or_404(InventoryOmegaEntity, uuid=object_uuid)
        inventory_omega.delete()

        updated_list = InventoryOmegaEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_omega_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def delete_inventory_lmj(self, object_uuid) -> list[InventoryLmjBean]:
        inventory_lmj = get_object_or_404(InventoryLmjEntity, uuid=object_uuid)
        inventory_lmj.delete()

        updated_list = InventoryLmjEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_lmj_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def delete_inventory_basic_parts_catalog(
        self, object_uuid
    ) -> list[InventoryBasicPartsCatalogBean]:
        inventory_basic_parts_catalog = get_object_or_404(
            InventoryBasicPartsCatalogEntity, uuid=object_uuid
        )
        inventory_basic_parts_catalog.delete()

        updated_list = InventoryBasicPartsCatalogEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_basic_parts_catalog_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def delete_inventory_ec_structuring(
        self, object_uuid
    ) -> list[InventoryEcStructuringBean]:
        inventory_ec_structuring = get_object_or_404(
            InventoryEcStructuringEntity, uuid=object_uuid
        )
        inventory_ec_structuring.delete()

        updated_list = InventoryEcStructuringEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_ec_structuring_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_inventory_omega(
        self, inventory_omega_bean: InventoryOmegaBean
    ) -> list[InventoryOmegaBean]:
        inventory_omega_entity = inventory_omega_mapper_bean_to_entity(
            inventory_omega_bean
        )
        inventory_omega_entity.uuid = uuid.uuid4()
        inventory_omega_entity.save()

        updated_list = InventoryOmegaEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_omega_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_inventory_ec_structuring(
        self, inventory_ec_structuring_bean: InventoryEcStructuringBean
    ) -> list[InventoryEcStructuringBean]:
        inventory_ec_structuring = inventory_ec_structuring_mapper_bean_to_entity(
            inventory_ec_structuring_bean
        )
        inventory_ec_structuring.uuid = uuid.uuid4()
        inventory_ec_structuring.save()

        updated_list = InventoryEcStructuringEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_ec_structuring_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_inventory_lmj(
        self, inventory_lmj_bean: InventoryLmjBean
    ) -> list[InventoryLmjBean]:
        inventory_lmj_entity = inventory_lmj_mapper_bean_to_entity(inventory_lmj_bean)
        inventory_lmj_entity.uuid = uuid.uuid4()
        inventory_lmj_entity.save()

        updated_list = InventoryLmjEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_lmj_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_inventory_basic_parts_catalog(
        self, inventory_basic_parts_catalog_bean: InventoryBasicPartsCatalogBean
    ) -> list[InventoryBasicPartsCatalogBean]:
        inventory_basic_parts_catalog_entity = (
            inventory_basic_parts_catalog_mapper_bean_to_entity(
                inventory_basic_parts_catalog_bean
            )
        )
        inventory_basic_parts_catalog_entity.uuid = uuid.uuid4()
        inventory_basic_parts_catalog_entity.save()

        updated_list = InventoryBasicPartsCatalogEntity.objects.all()

        if len(updated_list) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: inventory_basic_parts_catalog_mapper_entity_to_bean(x),
                    updated_list,
                )
            )

    @transaction.atomic
    def create_inventory_omega_from_excel_sheet(
        self, inventory_omega_bean: InventoryOmegaBean
    ) -> None:
        inventory_omega_entity = inventory_omega_mapper_bean_to_entity(
            inventory_omega_bean
        )
        inventory_omega_entity.uuid = uuid.uuid4()

        if inventory_omega_bean.fsec:
            fsec = FsecEntity.objects.get(name=inventory_omega_bean.fsec)
            inventory_omega_entity.fsec = fsec

        inventory_omega_entity.save()

    @transaction.atomic
    def create_inventory_ec_structuring_from_excel_sheet(
        self, inventory_ec_structuring_bean: InventoryEcStructuringBean
    ) -> None:
        inventory_ec_structuring_entity = (
            inventory_ec_structuring_mapper_bean_to_entity(
                inventory_ec_structuring_bean
            )
        )
        inventory_ec_structuring_entity.uuid = uuid.uuid4()

        if inventory_ec_structuring_bean.fsec:
            fsec = FsecEntity.objects.get(name=inventory_ec_structuring_bean.fsec)
            inventory_ec_structuring_entity.fsec = fsec

        inventory_ec_structuring_entity.save()

    @transaction.atomic
    def create_inventory_lmj_from_excel_sheet(
        self, inventory_lmj_bean: InventoryLmjBean
    ) -> None:
        inventory_lmj_entity = inventory_lmj_mapper_bean_to_entity(inventory_lmj_bean)
        inventory_lmj_entity.uuid = uuid.uuid4()

        if inventory_lmj_bean.fsec:
            fsec = FsecEntity.objects.get(name=inventory_lmj_bean.fsec)
            inventory_lmj_entity.fsec = fsec

        inventory_lmj_entity.save()

    @transaction.atomic
    def create_inventory_basic_parts_catalog_from_excel_sheet(
        self, inventory_basic_parts_catalog_bean: InventoryBasicPartsCatalogBean
    ) -> None:
        inventory_basic_parts_catalog_entity = (
            inventory_basic_parts_catalog_mapper_bean_to_entity(
                inventory_basic_parts_catalog_bean
            )
        )
        inventory_basic_parts_catalog_entity.uuid = uuid.uuid4()

        if inventory_basic_parts_catalog_bean.fsec:
            fsec = FsecEntity.objects.get(name=inventory_basic_parts_catalog_bean.fsec)
            inventory_basic_parts_catalog_entity.fsec = fsec

        inventory_basic_parts_catalog_entity.save()

    @transaction.atomic
    def add_additional_comment_to_basic_parts_catalog(
        self, comment: str, object_uuid: str
    ) -> None:
        basic_parts_catalog_entity = InventoryBasicPartsCatalogEntity.objects.get(
            uuid=object_uuid
        )

        basic_parts_catalog_entity.additional_comment = comment
        basic_parts_catalog_entity.save()

    @transaction.atomic
    def add_additional_comment_to_ec_structuring(
        self, comment: str, object_uuid: str
    ) -> None:
        ec_structuring_entity = InventoryEcStructuringEntity.objects.get(
            uuid=object_uuid
        )

        ec_structuring_entity.additional_comment = comment
        ec_structuring_entity.save()

    @transaction.atomic
    def add_additional_comment_to_inventory_lmj(
        self, comment: str, object_uuid: str
    ) -> None:
        inventory_lmj_entity = InventoryLmjEntity.objects.get(uuid=object_uuid)

        inventory_lmj_entity.additional_comment = comment
        inventory_lmj_entity.save()

    @transaction.atomic
    def add_additional_comment_to_inventory_omega(
        self, comment: str, object_uuid: str
    ) -> None:
        inventory_omega_entity = InventoryOmegaEntity.objects.get(uuid=object_uuid)

        inventory_omega_entity.additional_comment = comment
        inventory_omega_entity.save()
