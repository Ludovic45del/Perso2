import re
import uuid

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from cible.domain.campaign.interface.i_campaign_repository import ICampaignRepository
from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.mapper.campaign.campaign_document_mapper import (
    campaign_document_mapper_bean_to_entity,
)
from cible.mapper.campaign.campaign_mapper import (
    campaign_data_mapper_entity_to_bean,
    campaign_mapper_bean_to_entity,
    campaign_mapper_entity_to_bean,
)
from cible.mapper.campaign.campaign_team_mapper import (
    campaign_team_mapper_bean_to_entity,
)
from cible.repository.campaign.models.campaign import CampaignEntity
from cible.repository.campaign.models.campaign_documents import CampaignDocumentEntity
from cible.repository.campaign.models.campaign_team import CampaignTeamEntity
from cible.repository.campaign.models.referential.campaign_document_subtype import (
    CampaignDocumentSubtypeEntity,
)
from cible.repository.campaign.models.referential.campaign_installation import (
    CampaignInstallationEntity,
)
from cible.repository.campaign.models.referential.campaign_role import (
    CampaignRoleEntity,
)
from cible.repository.campaign.models.referential.campaign_status import (
    CampaignStatusEntity,
)
from cible.repository.campaign.models.referential.campaign_type import (
    CampaignTypeEntity,
)


class CampaignRepository(ICampaignRepository):

    def get_all_campaigns(self) -> list[CampaignBean]:
        campaigns = CampaignEntity.objects.all()
        if len(campaigns) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: campaign_mapper_entity_to_bean(x),
                    campaigns,
                )
            )

    def get_campaign_by_name(self, campaign_name) -> CampaignBean:
        split_name = re.split("[-|_]", campaign_name)
        installation: int
        if split_name[1] == "LMJ":
            installation = 0
        else:
            installation = 1
        installation_entity = CampaignInstallationEntity.objects.get(id=installation)
        campaign = get_object_or_404(
            CampaignEntity,
            name__iexact=split_name[2],
            year=split_name[0],
            installation=installation_entity,
        )
        return campaign_mapper_entity_to_bean(campaign)

    @transaction.atomic
    def create_campaign(self, campaign_bean: CampaignBean) -> CampaignBean:

        if campaign_bean.toBeDuplicated:
            campaign_bean.uuid = str(uuid.uuid4())

        campaign = campaign_mapper_bean_to_entity(campaign_bean)

        campaign.save()

        if campaign_bean.toBeDuplicated:
            for team in campaign_bean.campaignTeam:
                team_entity = campaign_team_mapper_bean_to_entity(team)
                team_entity.uuid = uuid.uuid4()
                team_entity.campaign_uuid = campaign
                team_entity.save()
                campaign.campaignteamentity_set.add(team_entity)
        else:
            for team in campaign_bean.campaignTeam:
                team_entity = campaign_team_mapper_bean_to_entity(team)
                team_entity.campaign_uuid = campaign
                team_entity.save()
                campaign.campaignteamentity_set.add(team_entity)

        for documents in campaign_bean.campaignDocuments:
            if documents.type and documents.subtype:
                documents_entity = campaign_document_mapper_bean_to_entity(documents)
                documents_entity.campaign_uuid = campaign
                documents_entity.save()
                campaign.campaigndocumententity_set.add(documents_entity)

        return campaign_mapper_entity_to_bean(campaign)

    def delete_campaign(self, uuid) -> None:
        campaign = get_object_or_404(CampaignEntity, uuid=uuid)
        campaign.delete()

    @transaction.atomic
    def update_campaign(self, updated_campaign: CampaignBean) -> CampaignBean:
        try:
            campaign = CampaignEntity.objects.get(uuid=updated_campaign.uuid)
        except ObjectDoesNotExist:
            raise ValueError(
                f"Aucune campagne trouvée avec l'identifiant {updated_campaign.uuid}"
            )

        try:
            campaign.type = CampaignTypeEntity.objects.get(id=updated_campaign.type.id)
            campaign.status = CampaignStatusEntity.objects.get(
                id=updated_campaign.status.id
            )
            campaign.installation = CampaignInstallationEntity.objects.get(
                id=updated_campaign.installation.id
            )
        except ObjectDoesNotExist as e:
            raise ValueError(f"Une entité liée est introuvable : {str(e)}")

        try:
            campaign.name = updated_campaign.name
            campaign.year = updated_campaign.year
            campaign.semester = updated_campaign.semester
            campaign.description = updated_campaign.description
            campaign.last_updated = timezone.now()
            campaign.start_date = updated_campaign.startDate
            campaign.end_date = updated_campaign.endDate
            campaign.dtri_number = updated_campaign.dtriNumber
            campaign.save()
        except Exception:
            raise ValueError(
                f"Erreur lors de la mise à jour de la campagne : {campaign.name}"
            )

        # Mettre à jour les équipes de la campagne
        campaign.campaignteamentity_set.all().delete()
        campaign_team_entities = []
        for team in updated_campaign.campaignTeam:
            try:
                team_entity = CampaignTeamEntity(uuid=team.uuid, name=team.name)
                team_entity.role = get_object_or_404(
                    CampaignRoleEntity, id=team.role.id
                )
                team_entity.campaign_uuid = campaign
                team_entity.save()
                campaign.campaignteamentity_set.add(team_entity)
                campaign_team_entities.append(team_entity)
            except Exception:
                raise ValueError(
                    f"Erreur lors de la mise à jour d'une équipe : {team.name}"
                )

        # Mettre à jour les documents de la campagne
        campaign.campaigndocumententity_set.all().delete()
        campaign_document_entities = []
        for document in updated_campaign.campaignDocuments:
            if document.type:
                try:
                    document_entity = CampaignDocumentEntity(
                        uuid=document.uuid,
                        name=document.name,
                        path=document.path,
                        date=(
                            document.date
                            if document.date is not None
                            else timezone.now()
                        ),
                    )
                    document_entity.subtype = get_object_or_404(
                        CampaignDocumentSubtypeEntity, id=document.subtype.id
                    )
                    document_entity.campaign_uuid = campaign
                    document_entity.save()
                    campaign.campaigndocumententity_set.add(document_entity)
                    campaign_document_entities.append(document_entity)
                except Exception:
                    raise ValueError(
                        f"Erreur lors de la mise à jour d'un document : {document.name}"
                    )

        return campaign_data_mapper_entity_to_bean(
            campaign, campaign_document_entities, campaign_team_entities
        )

    def does_campaign_exist_by_name_year_and_semester(
        self, name, year, semester
    ) -> bool:
        return CampaignEntity.objects.filter(
            name=name, year=year, semester=semester
        ).exists()

    def calculate_campaign_increment(self, name) -> str:

        base_name = name.rstrip("0123456789")
        existing_names = CampaignEntity.objects.filter(
            name__startswith=base_name
        ).values_list("name", flat=True)

        if existing_names.__len__() == 0:
            return 0
        else:
            max_num = 0
            for name in existing_names:
                suffix = name[len(base_name) :]
                if suffix.isdigit():
                    num = int(suffix)
                    if num > max_num:
                        max_num = num
            return f"{base_name}{max_num + 1}"
