from dataclasses import dataclass
from typing import Optional

from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.steps.fsec_base_step_bean import FsecBaseStep
from cible.domain.fsec.models.steps.fsec_documents_manager import FsecDocumentsManager
from cible.domain.fsec.models.steps.fsec_teams_manager import FsecTeamManager


@dataclass
class FsecPicturesStepBean(FsecBaseStep, FsecTeamManager, FsecDocumentsManager):
    comments: str
    fsecTeam: list[FsecTeamBean] = None
    fsecDocuments: list[FsecDocumentBean] = None
    lastUpdated: Optional[str] = None

    REQUIRED_ROLES = {5: "OPERATEUR_PHOTOS"}
    REQUIRED_SUBTYPES_DOCS = {8: "Vue"}

    def get_next_step(self) -> FsecStatusBean | None:
        pass

    def get_previous_step(self) -> FsecStatusBean | None:
        return None

    def is_valid(self) -> bool:
        return True
