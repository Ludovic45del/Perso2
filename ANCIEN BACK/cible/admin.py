from django.contrib import admin

from cible.repository.campaign.models.campaign import (
    CampaignEntity,
    CampaignInstallationEntity,
    CampaignStatusEntity,
    CampaignTypeEntity,
)
from cible.repository.campaign.models.campaign_documents import CampaignDocumentEntity
from cible.repository.campaign.models.campaign_team import CampaignTeamEntity
from cible.repository.campaign.models.referential.campaign_document_subtype import (
    CampaignDocumentSubtypeEntity,
)
from cible.repository.campaign.models.referential.campaign_document_type import (
    CampaignDocumentTypeEntity,
)
from cible.repository.campaign.models.referential.campaign_role import (
    CampaignRoleEntity,
)
from cible.repository.fsec.models.fsec import FsecEntity
from cible.repository.fsec.models.fsec_documents import FsecDocumentEntity
from cible.repository.fsec.models.fsec_team import FsecRoleEntity, FsecTeamEntity
from cible.repository.fsec.models.referential.fsec_assembly_bench import (
    FsecAssemblyBenchEntity,
)
from cible.repository.fsec.models.referential.fsec_category import FsecCategoryEntity
from cible.repository.fsec.models.referential.fsec_document_subtype import (
    FsecDocumentSubtypeEntity,
)
from cible.repository.fsec.models.referential.fsec_document_type import (
    FsecDocumentTypeEntity,
)
from cible.repository.fsec.models.referential.fsec_rack import FsecRackEntity
from cible.repository.fsec.models.referential.fsec_status import FsecStatusEntity
from cible.repository.fsec.models.steps.airtightness_test_low_pressure import (
    AirtightnessTestLowPressureEntity,
)
from cible.repository.fsec.models.steps.assembly_step import AssemblyStepEntity
from cible.repository.fsec.models.steps.depressurization import DepressurizationEntity
from cible.repository.fsec.models.steps.gas_filling_high_pressure import (
    GasFillingHighPressureEntity,
)
from cible.repository.fsec.models.steps.gas_filling_low_pressure import (
    GasFillingLowPressureEntity,
)
from cible.repository.fsec.models.steps.metrology_step import MetrologyStepEntity
from cible.repository.fsec.models.steps.permeation import PermeationEntity
from cible.repository.fsec.models.steps.pictures_step import PicturesStepEntity
from cible.repository.fsec.models.steps.repressurization import RepressurizationEntity
from cible.repository.fsec.models.steps.sealing_step import SealingStepEntity
from cible.repository.stock.models.consumables.consumables_glues import (
    ConsumablesGluesEntity,
)
from cible.repository.stock.models.consumables.other_consumables import (
    OtherConsumablesEntity,
)
from cible.repository.stock.models.inventory.inventory_basic_parts_catalog import (
    InventoryBasicPartsCatalogEntity,
)
from cible.repository.stock.models.inventory.inventory_ec_structuring import (
    InventoryEcStructuringEntity,
)
from cible.repository.stock.models.inventory.inventory_lmj import InventoryLmjEntity
from cible.repository.stock.models.inventory.inventory_omega import InventoryOmegaEntity
from cible.repository.stock.models.structuring.special_structuring import (
    SpecialStructuringEntity,
)
from cible.repository.stock.models.structuring.structuring import StructuringEntity
from cible.repository.stock.models.transfers import TransfersEntity


class CampaignAdmin(admin.ModelAdmin):
    list_display = ("uuid", "year", "installation", "name", "type", "semester")


class CampaignTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "label")


class CampaignStatusAdmin(admin.ModelAdmin):
    list_display = ("id", "label")


class CampaignInstallationAdmin(admin.ModelAdmin):
    list_display = ("id", "label")


class CampaignTeamAdmin(admin.ModelAdmin):
    list_display = ("uuid", "name")


class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "label")


class CampaignDocumentTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "label")


class CampaignDocumentAdmin(admin.ModelAdmin):
    list_display = ("uuid", "campaign_uuid", "name", "type", "path", "date")


class CampaignDocumentSubtypeAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "type")


class FsecCategoryAdmin(admin.ModelAdmin):
    list_display = ("label", "id")


class FsecAdmin(admin.ModelAdmin):
    list_display = (
        "version_uuid",
        "fsec_uuid",
        "name",
        "campaign",
        "status",
        "category",
    )


admin.site.register(CampaignEntity, CampaignAdmin)
admin.site.register(CampaignTypeEntity, CampaignTypeAdmin)
admin.site.register(CampaignStatusEntity, CampaignStatusAdmin)
admin.site.register(CampaignInstallationEntity, CampaignInstallationAdmin)
admin.site.register(CampaignTeamEntity, CampaignTeamAdmin)
admin.site.register(CampaignRoleEntity, RoleAdmin)
admin.site.register(CampaignDocumentEntity, CampaignDocumentAdmin)
admin.site.register(CampaignDocumentTypeEntity, CampaignDocumentTypeAdmin)
admin.site.register(CampaignDocumentSubtypeEntity, CampaignDocumentSubtypeAdmin)
admin.site.register(FsecCategoryEntity, FsecCategoryAdmin)
admin.site.register(FsecDocumentSubtypeEntity)
admin.site.register(FsecDocumentTypeEntity)
admin.site.register(FsecDocumentEntity)
admin.site.register(FsecTeamEntity)
admin.site.register(FsecRoleEntity)
admin.site.register(FsecStatusEntity)
admin.site.register(MetrologyStepEntity)
admin.site.register(PicturesStepEntity)
admin.site.register(AssemblyStepEntity)
admin.site.register(SealingStepEntity)
admin.site.register(FsecEntity, FsecAdmin)
admin.site.register(FsecRackEntity)
admin.site.register(FsecAssemblyBenchEntity)
admin.site.register(InventoryOmegaEntity)
admin.site.register(InventoryLmjEntity)
admin.site.register(InventoryEcStructuringEntity)
admin.site.register(InventoryBasicPartsCatalogEntity)
admin.site.register(ConsumablesGluesEntity)
admin.site.register(OtherConsumablesEntity)
admin.site.register(StructuringEntity)
admin.site.register(SpecialStructuringEntity)
admin.site.register(GasFillingLowPressureEntity)
admin.site.register(GasFillingHighPressureEntity)
admin.site.register(RepressurizationEntity)
admin.site.register(DepressurizationEntity)
admin.site.register(PermeationEntity)
admin.site.register(AirtightnessTestLowPressureEntity)
admin.site.register(TransfersEntity)
