from dataclasses import dataclass
from typing import Optional

from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.steps.fsec_base_step_bean import FsecBaseStep
from cible.domain.fsec.models.steps.fsec_documents_manager import FsecDocumentsManager


@dataclass
class FsecInstalledStepBean(FsecBaseStep, FsecDocumentsManager):
    shootingDate: Optional[str] = None
    preshootingPressure: float = None
    experienceSRxx: str = None
    fsecDocuments: list[FsecDocumentBean] = None

    REQUIRED_SUBTYPES_DOCS = {12: "Fichiers PALS", 13: "FDT"}

    def get_next_step(self) -> FsecStatusBean | None:
        pass

    def get_previous_step(self) -> FsecStatusBean | None:
        return None

    def is_valid(self) -> bool:
        return True
