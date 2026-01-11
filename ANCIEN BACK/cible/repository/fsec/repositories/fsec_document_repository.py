from cible.domain.fsec.interface.i_fsec_document_repository import (
    IFsecDocumentRepository,
)
from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.mapper.fsec.fsec_document_mapper import fsec_document_mapper_entity_to_bean
from cible.repository.fsec.models.fsec_documents import FsecDocumentEntity


class FsecDocumentRepository(IFsecDocumentRepository):

    def get_documents_by_fsec_uuid(self, uuid) -> list[FsecDocumentBean]:
        docs = FsecDocumentEntity.objects.filter(fsec=uuid)
        if len(docs) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: fsec_document_mapper_entity_to_bean(x),
                    docs,
                )
            )
