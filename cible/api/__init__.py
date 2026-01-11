"""API Package - Controllers REST."""
from cible.api.campaign import (
    CampaignController,
    CampaignTeamsController,
    CampaignDocumentsController,
)
from cible.api.fsec import (
    FsecController,
    FsecTeamsController,
    FsecDocumentsController,
)
from cible.api.steps import (
    AssemblyStepController,
    MetrologyStepController,
    SealingStepController,
    PicturesStepController,
    AirtightnessTestLpStepController,
    GasFillingBpStepController,
    GasFillingHpStepController,
    PermeationStepController,
    DepressurizationStepController,
    RepressurizationStepController,
)

__all__ = [
    # Campaign
    "CampaignController",
    "CampaignTeamsController",
    "CampaignDocumentsController",
    # FSEC
    "FsecController",
    "FsecTeamsController",
    "FsecDocumentsController",
    # Steps
    "AssemblyStepController",
    "MetrologyStepController",
    "SealingStepController",
    "PicturesStepController",
    "AirtightnessTestLpStepController",
    "GasFillingBpStepController",
    "GasFillingHpStepController",
    "PermeationStepController",
    "DepressurizationStepController",
    "RepressurizationStepController",
]
