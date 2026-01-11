from dataclasses import dataclass
from typing import Optional

from cible.domain.fsec.models.referential.fsec_document_subtype_bean import (
    FsecDocumentSubtypeBean,
)
from cible.domain.fsec.models.referential.fsec_document_type_bean import (
    FsecDocumentTypeBean,
)


@dataclass
class FsecDocumentBean:
    uuid: str = None
    fsecVersionUuid: str = None
    name: Optional[str] = None
    path: Optional[str] = None
    date: Optional[str] = None
    type: Optional[FsecDocumentTypeBean] = None
    subtype: Optional[FsecDocumentSubtypeBean] = None
