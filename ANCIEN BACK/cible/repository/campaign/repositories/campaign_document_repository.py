from cible.domain.campaign.interface.i_campaign_document_repository import (
    ICampaignDocumentRepository,
)
from cible.domain.campaign.models.campaign_document_bean import CampaignDocumentBean
from cible.domain.campaign.models.referential.campaign_document_subtype_bean import (
    CampaignDocumentSubtypeBean,
)
from cible.domain.campaign.models.referential.campaign_document_type_bean import (
    CampaignDocumentTypeBean,
)
from cible.mapper.campaign.campaign_document_mapper import (
    campaign_document_mapper_entity_to_bean,
)
from cible.repository.campaign.models.campaign_documents import CampaignDocumentEntity
from cible.repository.campaign.models.referential.campaign_document_type import (
    CampaignDocumentTypeEntity,
)


class CampaignDocumentRepository(ICampaignDocumentRepository):

    def get_campaign_documents_by_campaign_name(
        self, campaign
    ) -> list[CampaignDocumentBean]:

        campaigns_documents = CampaignDocumentEntity.objects.filter(
            campaign_uuid=campaign.uuid
        )
        if len(campaigns_documents) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: campaign_document_mapper_entity_to_bean(x),
                    campaigns_documents,
                )
            )

    def get_campaign_documents_type(self) -> list[CampaignDocumentTypeBean]:
        types = CampaignDocumentTypeEntity.objects.prefetch_related("subtypes").all()
        if not types:
            return []

        return [
            CampaignDocumentTypeBean(
                id=type_entity.id,
                label=type_entity.label,
                subtype=[
                    CampaignDocumentSubtypeBean(id=subtype.id, label=subtype.label)
                    for subtype in type_entity.subtypes.all()
                ],
            )
            for type_entity in types
        ]
