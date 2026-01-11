from cible.domain.fsec.models.steps.fsec_sealing_step_bean import FsecSealingStepBean
from cible.repository.fsec.models.steps.sealing_step import SealingStepEntity


def sealing_step_mapper_bean_to_entity(
    sealing_step_bean: FsecSealingStepBean,
) -> SealingStepEntity:
    return SealingStepEntity(
        interface_io=sealing_step_bean.interfaceIO,
        comments=sealing_step_bean.comments,
    )


def sealing_step_mapper_entity_to_bean(
    sealing_step_entity: SealingStepEntity,
) -> FsecSealingStepBean:
    return FsecSealingStepBean(
        interfaceIO=sealing_step_entity.interface_io,
        comments=sealing_step_entity.comments,
        versionUuid=str(sealing_step_entity.fsec_version.version_uuid),
    )
