import abc

from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean


class IFsecDocumentRepository:

    @abc.abstractmethod
    def get_documents_by_fsec_uuid(self, uuid) -> list[FsecDocumentBean]:
        raise NotImplementedError
