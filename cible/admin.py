from django.contrib import admin

# Campaign Entities
from cible.repository.campaign.models.campaign_entity import CampaignEntity
from cible.repository.campaign.models.campaign_types_entity import CampaignTypesEntity
from cible.repository.campaign.models.campaign_status_entity import CampaignStatusEntity
from cible.repository.campaign.models.campaign_installations_entity import CampaignInstallationsEntity
from cible.repository.campaign.models.campaign_roles_entity import CampaignRolesEntity
from cible.repository.campaign.models.campaign_document_types_entity import CampaignDocumentTypesEntity
from cible.repository.campaign.models.campaign_document_subtypes_entity import CampaignDocumentSubtypesEntity
from cible.repository.campaign.models.campaign_teams_entity import CampaignTeamsEntity
from cible.repository.campaign.models.campaign_documents_entity import CampaignDocumentsEntity

# FSEC Entities
from cible.repository.fsec.models.fsec_entity import FsecEntity
from cible.repository.fsec.models.fsec_category_entity import FsecCategoryEntity
from cible.repository.fsec.models.fsec_status_entity import FsecStatusEntity
from cible.repository.fsec.models.fsec_rack_entity import FsecRackEntity
from cible.repository.fsec.models.fsec_roles_entity import FsecRolesEntity
from cible.repository.fsec.models.fsec_document_types_entity import FsecDocumentTypesEntity
from cible.repository.fsec.models.fsec_document_subtypes_entity import FsecDocumentSubtypesEntity
from cible.repository.fsec.models.fsec_teams_entity import FsecTeamsEntity
from cible.repository.fsec.models.fsec_documents_entity import FsecDocumentsEntity

# Steps Entities
from cible.repository.steps.models.assembly_bench_entity import AssemblyBenchEntity
from cible.repository.steps.models.metrology_machine_entity import MetrologyMachineEntity
from cible.repository.steps.models.assembly_step_entity import AssemblyStepEntity
from cible.repository.steps.models.metrology_step_entity import MetrologyStepEntity
from cible.repository.steps.models.sealing_step_entity import SealingStepEntity
from cible.repository.steps.models.pictures_step_entity import PicturesStepEntity
from cible.repository.steps.models.airtightness_test_lp_step_entity import AirtightnessTestLpStepEntity
from cible.repository.steps.models.gas_filling_bp_step_entity import GasFillingBpStepEntity
from cible.repository.steps.models.gas_filling_hp_step_entity import GasFillingHpStepEntity
from cible.repository.steps.models.permeation_step_entity import PermeationStepEntity
from cible.repository.steps.models.depressurization_step_entity import DepressurizationStepEntity
from cible.repository.steps.models.repressurization_step_entity import RepressurizationStepEntity


# Campaign Admin Classes
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("uuid", "year", "installation_id", "name", "type_id", "semester")


class CampaignTypesAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "color")


class CampaignStatusAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "color")


class CampaignInstallationsAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "color")


class CampaignRolesAdmin(admin.ModelAdmin):
    list_display = ("id", "label")


class CampaignDocumentTypesAdmin(admin.ModelAdmin):
    list_display = ("id", "label")


class CampaignDocumentSubtypesAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "type_id")


class CampaignTeamsAdmin(admin.ModelAdmin):
    list_display = ("uuid", "campaign_uuid", "role_id", "name")


class CampaignDocumentsAdmin(admin.ModelAdmin):
    list_display = ("uuid", "campaign_uuid", "subtype_id", "name", "date")


# FSEC Admin Classes
class FsecAdmin(admin.ModelAdmin):
    list_display = ("version_uuid", "fsec_uuid", "name", "campaign_id", "status_id", "category_id", "is_active")


class FsecCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "color")


class FsecStatusAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "color")


class FsecRackAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "color", "is_full")


class FsecRolesAdmin(admin.ModelAdmin):
    list_display = ("id", "label")


class FsecTeamsAdmin(admin.ModelAdmin):
    list_display = ("uuid", "fsec_id", "role_id", "name")


class FsecDocumentsAdmin(admin.ModelAdmin):
    list_display = ("uuid", "fsec_id", "subtype_id", "name", "date")


# Steps Admin Classes
class AssemblyBenchAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "color")


class MetrologyMachineAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "color")


class AssemblyStepAdmin(admin.ModelAdmin):
    list_display = ("uuid", "fsec_version_id", "start_date", "end_date")


class MetrologyStepAdmin(admin.ModelAdmin):
    list_display = ("uuid", "fsec_version_id", "machine_id", "date")


class SealingStepAdmin(admin.ModelAdmin):
    list_display = ("uuid", "fsec_version_id", "interface_io")


class PicturesStepAdmin(admin.ModelAdmin):
    list_display = ("uuid", "fsec_version_id", "last_updated")


# Register Campaign Models
admin.site.register(CampaignEntity, CampaignAdmin)
admin.site.register(CampaignTypesEntity, CampaignTypesAdmin)
admin.site.register(CampaignStatusEntity, CampaignStatusAdmin)
admin.site.register(CampaignInstallationsEntity, CampaignInstallationsAdmin)
admin.site.register(CampaignRolesEntity, CampaignRolesAdmin)
admin.site.register(CampaignDocumentTypesEntity, CampaignDocumentTypesAdmin)
admin.site.register(CampaignDocumentSubtypesEntity, CampaignDocumentSubtypesAdmin)
admin.site.register(CampaignTeamsEntity, CampaignTeamsAdmin)
admin.site.register(CampaignDocumentsEntity, CampaignDocumentsAdmin)

# Register FSEC Models
admin.site.register(FsecEntity, FsecAdmin)
admin.site.register(FsecCategoryEntity, FsecCategoryAdmin)
admin.site.register(FsecStatusEntity, FsecStatusAdmin)
admin.site.register(FsecRackEntity, FsecRackAdmin)
admin.site.register(FsecRolesEntity, FsecRolesAdmin)
admin.site.register(FsecDocumentTypesEntity)
admin.site.register(FsecDocumentSubtypesEntity)
admin.site.register(FsecTeamsEntity, FsecTeamsAdmin)
admin.site.register(FsecDocumentsEntity, FsecDocumentsAdmin)

# Register Steps Models
admin.site.register(AssemblyBenchEntity, AssemblyBenchAdmin)
admin.site.register(MetrologyMachineEntity, MetrologyMachineAdmin)
admin.site.register(AssemblyStepEntity, AssemblyStepAdmin)
admin.site.register(MetrologyStepEntity, MetrologyStepAdmin)
admin.site.register(SealingStepEntity, SealingStepAdmin)
admin.site.register(PicturesStepEntity, PicturesStepAdmin)
admin.site.register(AirtightnessTestLpStepEntity)
admin.site.register(GasFillingBpStepEntity)
admin.site.register(GasFillingHpStepEntity)
admin.site.register(PermeationStepEntity)
admin.site.register(DepressurizationStepEntity)
admin.site.register(RepressurizationStepEntity)
