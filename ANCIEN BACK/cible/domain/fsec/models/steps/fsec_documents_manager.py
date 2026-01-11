from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.domain.fsec.models.referential.fsec_document_subtype_bean import (
    FsecDocumentSubtypeBean,
)


class FsecDocumentsManager:
    REQUIRED_SUBTYPES_DOCS = {}  # Doit être défini dans la classe enfant

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fsecDocuments = []

    def set_documents(self, docs: list[FsecDocumentBean]):
        if not self.REQUIRED_SUBTYPES_DOCS:
            raise AttributeError(
                f"{self.__class__.__name__} must define REQUIRED_ROLES."
            )

        # Filtrer les équipes présentes dans teams qui ont un rôle dans REQUIRED_ROLES
        filtered_docs = {
            doc.subtype.label: doc
            for doc in docs
            if doc.subtype.label in self.REQUIRED_SUBTYPES_DOCS.values()
        }

        # Ajouter les rôles manquants avec des valeurs par défaut
        for doc_subtype_id, doc_subtype_label in self.REQUIRED_SUBTYPES_DOCS.items():
            if doc_subtype_label not in filtered_docs:
                filtered_docs[doc_subtype_label] = FsecDocumentBean(
                    path="",
                    subtype=FsecDocumentSubtypeBean(
                        id=doc_subtype_id, label=doc_subtype_label
                    ),
                )

        # Convertir en liste et stocker dans fsecTeam
        self.fsecDocuments = list(filtered_docs.values())
