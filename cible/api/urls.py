"""API URLs - Router principal pour les endpoints REST."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

# Campaign Controllers
from cible.api.campaign.campaign_controller import CampaignController
from cible.api.campaign.campaign_teams_controller import CampaignTeamsController
from cible.api.campaign.campaign_documents_controller import CampaignDocumentsController

# FSEC Controllers
from cible.api.fsec.fsec_controller import FsecController
from cible.api.fsec.fsec_teams_controller import FsecTeamsController
from cible.api.fsec.fsec_documents_controller import FsecDocumentsController

# Referential Controllers
from cible.api.referential.referential_controller import ReferentialController

# Steps Controllers
from cible.api.steps.design_step_controller import DesignStepController
from cible.api.steps.assembly_step_controller import AssemblyStepController
from cible.api.steps.metrology_step_controller import MetrologyStepController
from cible.api.steps.sealing_step_controller import SealingStepController
from cible.api.steps.pictures_step_controller import PicturesStepController
from cible.api.steps.usable_step_controller import UsableStepController
from cible.api.steps.installed_step_controller import InstalledStepController
from cible.api.steps.shot_step_controller import ShotStepController
from cible.api.steps.gas_steps_controller import (
    AirtightnessTestLpStepController,
    GasFillingBpStepController,
    GasFillingHpStepController,
    PermeationStepController,
    DepressurizationStepController,
    RepressurizationStepController,
)

# Create router
router = DefaultRouter()

# Campaign routes
router.register(r"campaigns", CampaignController, basename="campaigns")
router.register(r"campaign-teams", CampaignTeamsController, basename="campaign-teams")
router.register(r"campaign-documents", CampaignDocumentsController, basename="campaign-documents")

# FSEC routes
router.register(r"fsecs", FsecController, basename="fsecs")
router.register(r"fsec-teams", FsecTeamsController, basename="fsec-teams")
router.register(r"fsec-documents", FsecDocumentsController, basename="fsec-documents")

# Referential routes
router.register(r"referentials", ReferentialController, basename="referentials")

# Steps routes (Sans Gaz workflow - 8 steps)
router.register(r"design-steps", DesignStepController, basename="design-steps")
router.register(r"assembly-steps", AssemblyStepController, basename="assembly-steps")
router.register(r"metrology-steps", MetrologyStepController, basename="metrology-steps")
router.register(r"sealing-steps", SealingStepController, basename="sealing-steps")
router.register(r"pictures-steps", PicturesStepController, basename="pictures-steps")
router.register(r"usable-steps", UsableStepController, basename="usable-steps")
router.register(r"installed-steps", InstalledStepController, basename="installed-steps")
router.register(r"shot-steps", ShotStepController, basename="shot-steps")

# Gas Steps routes
router.register(r"airtightness-test-lp-steps", AirtightnessTestLpStepController, basename="airtightness-test-lp-steps")
router.register(r"gas-filling-bp-steps", GasFillingBpStepController, basename="gas-filling-bp-steps")
router.register(r"gas-filling-hp-steps", GasFillingHpStepController, basename="gas-filling-hp-steps")
router.register(r"permeation-steps", PermeationStepController, basename="permeation-steps")
router.register(r"depressurization-steps", DepressurizationStepController, basename="depressurization-steps")
router.register(r"repressurization-steps", RepressurizationStepController, basename="repressurization-steps")

urlpatterns = [
    path("", include(router.urls)),
]
