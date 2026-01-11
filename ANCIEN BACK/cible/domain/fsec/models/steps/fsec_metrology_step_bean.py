from dataclasses import dataclass
from typing import Optional

from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.domain.fsec.models.referential.fsec_rack_bean import FsecRackBean
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.referential.metrology_machine_bean import (
    MetrologyMachineBean,
)
from cible.domain.fsec.models.steps.fsec_base_step_bean import FsecBaseStep
from cible.domain.fsec.models.steps.fsec_documents_manager import FsecDocumentsManager
from cible.domain.fsec.models.steps.fsec_teams_manager import FsecTeamManager


@dataclass
class FsecMetrologyStepBean(FsecBaseStep, FsecTeamManager, FsecDocumentsManager):
    machine: MetrologyMachineBean
    comments: str
    date: str
    rack: Optional[FsecRackBean] = None
    fsecTeam: list[FsecTeamBean] = None
    fsecDocuments: list[FsecDocumentBean] = None

    REQUIRED_ROLES = {4: "METROLOGUE"}
    REQUIRED_SUBTYPES_DOCS = {6: "Visrad réalisé", 7: "Fichier métro", 14: "FDM"}

    def get_next_step(self) -> FsecStatusBean | None:
        pass

    def get_previous_step(self) -> FsecStatusBean | None:
        return None

    def is_valid(self) -> bool:
        return True
