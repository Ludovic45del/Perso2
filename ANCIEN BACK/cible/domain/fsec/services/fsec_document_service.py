from cible.domain.fsec.interface.i_fsec_document_repository import (
    IFsecDocumentRepository,
)
from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean


def get_documents_by_fsec_uuid(
    uuid: str, repository: IFsecDocumentRepository
) -> list[FsecDocumentBean]:
    return repository.get_documents_by_fsec_uuid(uuid)
