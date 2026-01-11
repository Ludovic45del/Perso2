from dataclasses import dataclass

from cible.domain.fsec.models.referential.fsec_document_subtype_bean import (
    FsecDocumentSubtypeBean,
)


@dataclass
class FsecDocumentTypeBean:
    id: int
    label: str
    subtype: list[FsecDocumentSubtypeBean] = None
