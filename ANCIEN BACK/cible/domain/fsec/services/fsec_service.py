from uuid import UUID

from cible.api.fsec.models.fsec_api import FsecApi
from cible.domain.fsec.interface.i_fsec_document_repository import (
    IFsecDocumentRepository,
)
from cible.domain.fsec.interface.i_fsec_repository import IFsecRepository
from cible.domain.fsec.interface.i_fsec_team_repository import IFsecTeamRepository
from cible.domain.fsec.interface.referential.i_fsec_rack_repository import (
    IFsecRackRepository,
)
from cible.domain.fsec.models.fsec_active_bean import FsecActiveBean
from cible.domain.fsec.models.fsec_base_bean import FsecBaseBean
from cible.domain.fsec.models.fsec_bean import FsecBean
from cible.domain.fsec.models.referential.fsec_rack_bean import FsecRackBean
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.steps.fsec_assembly_step_bean import FsecAssemblyStepBean
from cible.domain.fsec.models.steps.fsec_metrology_step_bean import (
    FsecMetrologyStepBean,
)
from cible.exceptions.conflict_exception import ConflictException
from cible.exceptions.missing_data_exception import MissingDataException
from cible.exceptions.rack_exception import RackException
from cible.exceptions.update_conflict_exception import UpdateConflictException
from cible.mapper.fsec.fsec_document_mapper import fsec_document_mapper_entity_to_bean
from cible.mapper.fsec.fsec_team_mapper import fsec_team_mapper_entity_to_bean


def get_all_fsecs(repository: IFsecRepository) -> list[FsecApi]:
    return repository.get_all_fsecs()


def get_fsec_by_uuid(
    uuid: str,
    repository: IFsecRepository,
    team_repository: IFsecTeamRepository,
    document_repository: IFsecDocumentRepository,
) -> FsecBean:
    fsec_bean = repository.get_fsec_by_uuid(uuid)

    team = team_repository.get_team_by_fsec_uuid(uuid)
    docs = document_repository.get_documents_by_fsec_uuid(uuid)

    fsec_bean.set_team(team)
    fsec_bean.set_documents(docs)

    return fsec_bean


def _validate_mandatory_fields(fsec: FsecBaseBean):
    mandatory_fields = {
        "nom": fsec.designStep.name,
        "campagne": fsec.designStep.campaign,
        "category": fsec.category,
    }

    for field, value in mandatory_fields.items():
        if value is None:
            raise MissingDataException(field)


def _check_fsec_conflict(repository: IFsecRepository, fsec: FsecBean):
    campaign = fsec.designStep.campaign
    fsec_exists = repository.does_fsec_exist_by_name_and_campaign(
        fsec.designStep.name, UUID(campaign.uuid)
    )

    if fsec_exists:
        raise ConflictException(
            "fsec",
            f"{campaign.year}-{campaign.installation.label}_{campaign.name} "
            f"- {fsec.designStep.name}",
        )


def _check_fsec_conflict_for_update(repository: IFsecRepository, fsec: FsecActiveBean):
    _does_fsec_exist(fsec, repository)
    _does_fsec_name_available(fsec, repository)


def _does_fsec_exist(fsec, repository):
    campaign = fsec.designStep.campaign
    fsec_exists = repository.does_fsec_exist_by_version_uuid(fsec.versionUuid)
    if not fsec_exists:
        raise UpdateConflictException(
            "fsec",
            f"{campaign.year}-{campaign.installation.label}_{campaign.name} "
            f"- {fsec.designStep.name}",
        )


def _does_fsec_name_available(fsec, repository):
    campaign = fsec.designStep.campaign
    is_name_used = repository.does_fsec_name_used(
        UUID(fsec.versionUuid), fsec.designStep.name, UUID(campaign.uuid)
    )
    if is_name_used:
        raise ConflictException(
            "fsec",
            f"{campaign.year}-{campaign.installation.label}_{campaign.name} "
            f"- {fsec.designStep.name}",
        )


def create_fsec(repository: IFsecRepository, fsec: FsecBean) -> FsecApi:
    _validate_mandatory_fields(fsec)

    if fsec.toBeDuplicated:
        buffer_name = repository.calculate_fsec_increment(fsec.designStep.name)
        if buffer_name != 0:
            fsec.designStep.name = buffer_name

    _check_fsec_conflict(repository, fsec)

    fsec.status = (
        FsecStatusBean(id=1) if fsec.designStep.is_valid() else FsecStatusBean(id=0)
    )

    return repository.create_fsec(fsec)


def _update_rack_status(
    rack_repository: IFsecRackRepository, rack: FsecRackBean, rack_limit: int
):
    if rack:
        occupancy = rack_repository.get_rack_occupancy(rack_id=rack.id)
        rack.isFull = occupancy >= rack_limit
        rack_repository.update_rack(rack)


def update_fsec(
    fsec_repository: IFsecRepository,
    rack_repository: IFsecRackRepository,
    fsec: FsecActiveBean,
) -> FsecActiveBean:
    _validate_mandatory_fields(fsec)
    _check_fsec_conflict_for_update(fsec_repository, fsec)

    rack_limit = 10  # Capacité max des racks

    old_fsec = fsec_repository.get_fsec_base_by_uuid(fsec.versionUuid)
    old_rack = old_fsec.rack if old_fsec else None
    new_rack = fsec.rack

    if old_rack != new_rack:
        if new_rack:
            if rack_repository.get_rack_occupancy(new_rack.id) >= rack_limit:
                raise RackException(new_rack.label)
        _update_rack_status(rack_repository, old_rack, rack_limit + 1)
        _update_rack_status(rack_repository, new_rack, rack_limit - 1)

    fsec_bean, teams, docs = fsec_repository.update_fsec(fsec)

    team_beans = [fsec_team_mapper_entity_to_bean(team) for team in teams]
    document_beans = [fsec_document_mapper_entity_to_bean(doc) for doc in docs]
    fsec_bean.set_team(team_beans)
    fsec_bean.set_documents(document_beans)

    return fsec_bean


def delete_fsec(version_uuid: str, repository: IFsecRepository) -> None:
    return repository.delete_fsec(version_uuid)


def get_all_fsecs_by_campaign_uuid(
    repository: IFsecRepository, campaign_uuid: str
) -> list[FsecApi]:
    return repository.get_all_fsecs_by_campaign_uuid(campaign_uuid)


def return_to_assembly_step(
    repository: IFsecRepository, assembly_step: FsecAssemblyStepBean, fsec_uuid: str
) -> FsecBean:
    return repository.return_to_assembly_step(assembly_step, fsec_uuid)


def return_to_metrology_step(
    repository: IFsecRepository, metrology_step: FsecMetrologyStepBean, fsec_uuid: str
) -> FsecBean:
    return repository.return_to_metrology_step(metrology_step, fsec_uuid)


def change_depressurization_status(repository: IFsecRepository, fsec_uuid: str) -> None:
    return repository.change_depressurization_status(fsec_uuid)


def return_to_repressurization_step(
    repository: IFsecRepository, fsec_uuid: str
) -> FsecBean:
    return repository.return_to_repressurization_step(fsec_uuid)


def return_to_re_assembly_step(repository: IFsecRepository, fsec_uuid: str) -> FsecBean:
    return repository.return_to_re_assembly_step(fsec_uuid)
