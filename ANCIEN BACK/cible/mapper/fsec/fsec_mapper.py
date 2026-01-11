from datetime import datetime
from uuid import UUID

from cible.api.fsec.models.fsec_api import FsecApi
from cible.domain.fsec.models.fsec_active_bean import FsecActiveBean
from cible.domain.fsec.models.fsec_bean import FsecBean
from cible.domain.fsec.models.referential.fsec_category_bean import FsecCategoryBean
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.steps.fsec_design_step_bean import FsecDesignStepBean
from cible.domain.fsec.models.steps.fsec_installed_step_bean import (
    FsecInstalledStepBean,
)
from cible.domain.fsec.models.steps.fsec_sealing_step_bean import FsecSealingStepBean
from cible.domain.fsec.models.steps.fsec_shot_step_bean import FsecShotStepBean
from cible.domain.fsec.models.steps.fsec_usable_step_bean import FsecUsableStepBean
from cible.mapper.campaign.campaign_mapper import (
    campaign_mapper_api_to_bean,
    campaign_mapper_entity_to_bean,
)
from cible.mapper.fsec.fsec_document_mapper import fsec_document_mapper_api_to_bean
from cible.mapper.fsec.fsec_rack_mapper import (
    fsec_rack_mapper_api_to_bean,
    fsec_rack_mapper_bean_to_entity,
    fsec_rack_mapper_entity_to_bean,
)
from cible.mapper.fsec.fsec_team_mapper import fsec_team_mapper_api_to_bean
from cible.mapper.fsec.steps.airtightness_test_low_pressure_mapper import (
    airtightness_test_low_mapper_entity_to_bean,
    airtightness_test_low_pressure_api_to_bean,
)
from cible.mapper.fsec.steps.assembly_step_mapper import (
    assembly_step_mapper_entity_to_bean,
    fsec_assembly_mapper_api_to_bean,
)
from cible.mapper.fsec.steps.depressurization_mapper import (
    depressurization_api_to_bean,
    depressurization_mapper_entity_to_bean,
)
from cible.mapper.fsec.steps.gas_filling_high_pressure_mapper import (
    gas_filling_high_pressure_api_to_bean,
    gas_filling_high_pressure_mapper_entity_to_bean,
)
from cible.mapper.fsec.steps.gas_filling_low_pressure_mapper import (
    gas_filling_low_pressure_api_to_bean,
    gas_filling_low_pressure_mapper_entity_to_bean,
)
from cible.mapper.fsec.steps.metrology_step_mapper import (
    fsec_metrology_mapper_api_to_bean,
    metrology_step_mapper_entity_to_bean,
)
from cible.mapper.fsec.steps.permeation_mapper import (
    permeation_api_to_bean,
    permeation_mapper_entity_to_bean,
)
from cible.mapper.fsec.steps.pictures_step_mapper import (
    fsec_pictures_mapper_api_to_bean,
    pictures_step_mapper_entity_to_bean,
)
from cible.mapper.fsec.steps.repressurization_mapper import (
    repressurization_mapper_api_to_bean,
    repressurization_mapper_entity_to_bean,
)
from cible.mapper.fsec.steps.sealing_step_mapper import (
    sealing_step_mapper_entity_to_bean,
)
from cible.repository.fsec.models.fsec import FsecEntity
from cible.repository.fsec.models.referential.fsec_category import FsecCategoryEntity
from cible.repository.fsec.models.referential.fsec_status import FsecStatusEntity
from cible.repository.fsec.models.steps.airtightness_test_low_pressure import (
    AirtightnessTestLowPressureEntity,
)
from cible.repository.fsec.models.steps.assembly_step import AssemblyStepEntity
from cible.repository.fsec.models.steps.depressurization import DepressurizationEntity
from cible.repository.fsec.models.steps.gas_filling_high_pressure import (
    GasFillingHighPressureEntity,
)
from cible.repository.fsec.models.steps.gas_filling_low_pressure import (
    GasFillingLowPressureEntity,
)
from cible.repository.fsec.models.steps.metrology_step import MetrologyStepEntity
from cible.repository.fsec.models.steps.permeation import PermeationEntity
from cible.repository.fsec.models.steps.pictures_step import PicturesStepEntity
from cible.repository.fsec.models.steps.repressurization import RepressurizationEntity
from cible.repository.fsec.models.steps.sealing_step import SealingStepEntity


def fsec_status_mapper_bean_to_entity(
    fsec_status_bean: FsecStatusBean,
) -> FsecStatusEntity:
    return FsecStatusEntity(
        id=fsec_status_bean.id,
        label=fsec_status_bean.label,
        color=fsec_status_bean.color,
    )


def fsec_status_mapper_entity_to_bean(
    fsec_status_entity: FsecStatusEntity,
) -> FsecStatusBean:
    return FsecStatusBean(
        id=fsec_status_entity.id,
        label=fsec_status_entity.label,
        color=fsec_status_entity.color,
    )


def fsec_status_mapper_api_to_bean(json: dict) -> FsecStatusBean:
    return FsecStatusBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
        color=json["color"] if "color" in json else None,
    )


def fsec_category_mapper_bean_to_entity(
    fsec_category_bean: FsecCategoryBean,
) -> FsecCategoryEntity:
    return FsecCategoryEntity(
        id=fsec_category_bean.id,
        label=fsec_category_bean.label,
        color=fsec_category_bean.color,
    )


def fsec_category_mapper_entity_to_bean(
    fsec_category_entity: FsecCategoryEntity,
) -> FsecCategoryBean:
    return FsecCategoryBean(
        id=fsec_category_entity.id,
        label=fsec_category_entity.label,
        color=fsec_category_entity.color,
    )


def fsec_category_mapper_api_to_bean(json: dict) -> FsecCategoryBean:
    return FsecCategoryBean(
        id=json["id"] if "id" in json else None,
        label=json["label"] if "label" in json else None,
        color=json["color"] if "color" in json else None,
    )


def fsec_mapper_entity_to_api(
    fsec_entity: FsecEntity,
) -> FsecApi:
    return FsecApi(
        versionUuid=str(fsec_entity.version_uuid),
        fsecUuid=str(fsec_entity.fsec_uuid),
        campaign=(
            campaign_mapper_entity_to_bean(fsec_entity.campaign)
            if fsec_entity.campaign
            else None
        ),
        category=fsec_category_mapper_entity_to_bean(fsec_entity.category),
        comments=fsec_entity.comments,
        name=fsec_entity.name,
        status=fsec_status_mapper_entity_to_bean(fsec_entity.status),
        lastUpdated=str(fsec_entity.last_updated),
        rack=(
            fsec_rack_mapper_entity_to_bean(fsec_entity.rack)
            if fsec_entity.rack
            else None
        ),
        deliveryDate=str(fsec_entity.delivery_date),
        shootingDate=str(fsec_entity.shooting_date),
        embase=None,  # A modifier quand l'embase sera en base
    )


def fsec_mapper_entity_to_bean(
    fsec_entity: FsecEntity,
    assembly_entity: list[AssemblyStepEntity] = None,
    metrology_entity: list[MetrologyStepEntity] = None,
    pictures_entity: list[PicturesStepEntity] = None,
    sealing_entity: SealingStepEntity = None,
    permeation_entity: PermeationEntity = None,
    depressurization_entity: DepressurizationEntity = None,
    repressurization_entity: RepressurizationEntity = None,
    gas_filling_low_pressure_entity: GasFillingLowPressureEntity = None,
    gas_filling_high_pressure_entity: GasFillingHighPressureEntity = None,
    airtightness_test_low_pressure_entity: AirtightnessTestLowPressureEntity = None,
) -> FsecBean:
    assembly_entity = assembly_entity or []
    metrology_entity = metrology_entity or []
    pictures_entity = pictures_entity or []
    return FsecBean(
        versionUuid=str(fsec_entity.version_uuid),
        fsecUuid=str(fsec_entity.fsec_uuid),
        status=fsec_status_mapper_entity_to_bean(fsec_entity.status),
        category=fsec_category_mapper_entity_to_bean(fsec_entity.category),
        lastUpdated=str(fsec_entity.last_updated),
        isActive=fsec_entity.is_active,
        createdAt=str(fsec_entity.created_at),
        rack=(
            fsec_rack_mapper_entity_to_bean(fsec_entity.rack)
            if fsec_entity.rack
            else None
        ),
        designStep=FsecDesignStepBean(
            name=fsec_entity.name,
            comments=fsec_entity.comments,
            campaign=(
                campaign_mapper_entity_to_bean(fsec_entity.campaign)
                if fsec_entity.campaign
                else None
            ),
            fsecTeam=[],
            fsecDocuments=[],
            versionUuid=str(fsec_entity.version_uuid),
        ),
        assemblyStep=list(
            map(
                lambda x: assembly_step_mapper_entity_to_bean(x),
                assembly_entity,
            )
        ),
        metrologyStep=list(
            map(
                lambda x: metrology_step_mapper_entity_to_bean(x),
                metrology_entity,
            )
        ),
        sealingStep=(
            sealing_step_mapper_entity_to_bean(sealing_entity)
            if sealing_entity is not None
            else None
        ),
        picturesStep=list(
            map(
                lambda x: pictures_step_mapper_entity_to_bean(x),
                pictures_entity,
            )
        ),
        usableStep=FsecUsableStepBean(
            deliveryDate=str(fsec_entity.delivery_date),
            fsecDocuments=[],
            versionUuid=str(fsec_entity.version_uuid),
        ),
        installedStep=FsecInstalledStepBean(
            shootingDate=str(fsec_entity.shooting_date),
            preshootingPressure=fsec_entity.preshooting_pressure,
            experienceSRxx=fsec_entity.experience_srxx,
            fsecDocuments=[],
            versionUuid=str(fsec_entity.version_uuid),
        ),
        shotStep=FsecShotStepBean(
            localisation=fsec_entity.localisation,
            versionUuid=str(fsec_entity.version_uuid),
        ),
        permeationStep=(
            permeation_mapper_entity_to_bean(permeation_entity)
            if permeation_entity is not None
            else None
        ),
        depressurizationStep=(
            depressurization_mapper_entity_to_bean(depressurization_entity)
            if depressurization_entity is not None
            else None
        ),
        repressurizationStep=(
            repressurization_mapper_entity_to_bean(repressurization_entity)
            if repressurization_entity is not None
            else None
        ),
        airthightnessTestLowPressureStep=(
            airtightness_test_low_mapper_entity_to_bean(
                airtightness_test_low_pressure_entity
            )
            if airtightness_test_low_pressure_entity is not None
            else None
        ),
        gasFillingHighPressureStep=(
            gas_filling_high_pressure_mapper_entity_to_bean(
                gas_filling_high_pressure_entity
            )
            if gas_filling_high_pressure_entity is not None
            else None
        ),
        gasFillingLowPressureStep=(
            gas_filling_low_pressure_mapper_entity_to_bean(
                gas_filling_low_pressure_entity
            )
            if gas_filling_low_pressure_entity is not None
            else None
        ),
        depressurizationFailed=fsec_entity.depressurization_failed,
    )


def fsec_mapper_creation_api_to_bean(json: dict) -> FsecBean:
    return FsecBean(
        versionUuid=json["uuid"] if "uuid" in json else None,
        fsecUuid=json["fsecUuid"] if "fsecUuid" in json else None,
        category=(
            fsec_category_mapper_api_to_bean(json["category"])
            if "category" in json and json["category"] is not None
            else None
        ),
        designStep=(
            FsecDesignStepBean(
                comments=str(json["comments"]).strip() if "comments" in json else None,
                name=str(json["name"]).strip().upper(),
                fsecTeam=list(
                    map(
                        lambda x: fsec_team_mapper_api_to_bean(x),
                        json["fsecTeam"] if "fsecTeam" in json else [],
                    )
                ),
                fsecDocuments=list(
                    map(
                        lambda x: fsec_document_mapper_api_to_bean(x),
                        json["fsecDocument"] if "fsecDocument" in json else [],
                    )
                ),
                campaign=(
                    campaign_mapper_api_to_bean(json["campaign"])
                    if "campaign" in json and json["campaign"] is not None
                    else None
                ),
                versionUuid=json["uuid"] if "uuid" in json else None,
            )
        ),
        status=(
            fsec_status_mapper_api_to_bean(json["status"])
            if "status" in json and json["status"] is not None
            else None
        ),
        rack=(
            fsec_rack_mapper_api_to_bean(json["rack"])
            if "rack" in json and json["rack"] is not None
            else None
        ),
        toBeDuplicated=json["toBeDuplicated"] if "toBeDuplicated" in json else None,
    )


def fsec_mapper_api_to_active_bean(json: dict) -> FsecActiveBean:
    return FsecActiveBean(
        versionUuid=json["versionUuid"] if "versionUuid" in json else None,
        fsecUuid=json["fsecUuid"] if "fsecUuid" in json else None,
        category=(
            fsec_category_mapper_api_to_bean(json["category"])
            if "category" in json and json["category"] is not None
            else None
        ),
        status=(
            fsec_status_mapper_api_to_bean(json["status"])
            if "status" in json and json["status"] is not None
            else None
        ),
        rack=(
            fsec_rack_mapper_api_to_bean(json["rack"])
            if "rack" in json and json["rack"] is not None
            else None
        ),
        designStep=(
            FsecDesignStepBean(
                comments=(
                    str(json["designStep"]["comments"]).strip()
                    if json["designStep"]["comments"]
                    else None
                ),
                name=str(json["designStep"]["name"]).strip().upper(),
                fsecTeam=list(
                    map(
                        lambda x: fsec_team_mapper_api_to_bean(x),
                        (
                            json["designStep"]["fsecTeam"]
                            if json["designStep"]["fsecTeam"]
                            else []
                        ),
                    )
                ),
                fsecDocuments=list(
                    map(
                        lambda x: fsec_document_mapper_api_to_bean(x),
                        (
                            json["designStep"]["fsecDocuments"]
                            if json["designStep"]["fsecDocuments"]
                            else []
                        ),
                    )
                ),
                campaign=(
                    campaign_mapper_api_to_bean(json["designStep"]["campaign"])
                    if json["designStep"]["campaign"]
                    else None
                ),
                versionUuid=(
                    json["designStep"]["versionUuid"]
                    if json["designStep"]["versionUuid"]
                    else None
                ),
            )
        ),
        assemblyStep=(
            fsec_assembly_mapper_api_to_bean(json.get("assemblyStep"))
            if json.get("assemblyStep")
            else None
        ),
        metrologyStep=(
            fsec_metrology_mapper_api_to_bean(json.get("metrologyStep"))
            if json.get("metrologyStep")
            else None
        ),
        sealingStep=(
            FsecSealingStepBean(
                interfaceIO=(
                    str(json["sealingStep"]["interfaceIO"]).strip()
                    if json["sealingStep"]["interfaceIO"]
                    else None
                ),
                comments=(
                    str(json["sealingStep"]["comments"]).strip()
                    if json["sealingStep"]["comments"]
                    else None
                ),
                versionUuid=(
                    json["sealingStep"]["versionUuid"]
                    if "versionUuid" in json["sealingStep"]
                    else None
                ),
            )
            if json["sealingStep"]
            else None
        ),
        picturesStep=(
            fsec_pictures_mapper_api_to_bean(json.get("picturesStep"))
            if json.get("picturesStep")
            else None
        ),
        usableStep=FsecUsableStepBean(
            deliveryDate=(
                datetime.strptime(
                    json["usableStep"]["deliveryDate"], "%Y-%m-%dT%H:%M:%S.%fZ"
                )
                if json["usableStep"]["deliveryDate"]
                else None
            ),
            fsecDocuments=list(
                map(
                    lambda x: fsec_document_mapper_api_to_bean(x),
                    (
                        json["usableStep"]["fsecDocuments"]
                        if json["usableStep"]["fsecDocuments"]
                        else []
                    ),
                )
            ),
            fsecTeam=list(
                map(
                    lambda x: fsec_team_mapper_api_to_bean(x),
                    (
                        json["usableStep"]["fsecTeam"]
                        if json["usableStep"]["fsecTeam"]
                        else []
                    ),
                )
            ),
            versionUuid=(
                json["usableStep"]["versionUuid"]
                if json["usableStep"]["versionUuid"]
                else None
            ),
        ),
        installedStep=FsecInstalledStepBean(
            shootingDate=(
                datetime.strptime(
                    json["installedStep"]["shootingDate"], "%Y-%m-%dT%H:%M:%S.%fZ"
                )
                if json["installedStep"]["shootingDate"]
                else None
            ),
            preshootingPressure=(
                float(json["installedStep"]["preshootingPressure"])
                if json["installedStep"]["preshootingPressure"]
                else None
            ),
            experienceSRxx=(
                str(json["installedStep"]["experienceSRxx"]).strip()
                if json["installedStep"]["experienceSRxx"]
                else None
            ),
            fsecDocuments=list(
                map(
                    lambda x: fsec_document_mapper_api_to_bean(x),
                    (
                        json["installedStep"]["fsecDocuments"]
                        if json["installedStep"]["fsecDocuments"]
                        else []
                    ),
                )
            ),
            versionUuid=(
                json["installedStep"]["versionUuid"]
                if json["installedStep"]["versionUuid"]
                else None
            ),
        ),
        shotStep=FsecShotStepBean(
            localisation=(
                str(json["shotStep"]["versionUuid"]).strip()
                if json["shotStep"]["versionUuid"] in json
                else None
            ),
            versionUuid=(
                json["shotStep"]["versionUuid"]
                if json["shotStep"]["versionUuid"]
                else None
            ),
        ),
        permeationStep=(
            permeation_api_to_bean(json.get("permeationStep"))
            if json.get("permeationStep")
            else None
        ),
        repressurizationStep=(
            repressurization_mapper_api_to_bean(json.get("repressurizationStep"))
            if json.get("repressurizationStep")
            else None
        ),
        gasFillingLowPressureStep=(
            gas_filling_low_pressure_api_to_bean(json.get("gasFillingLowPressureStep"))
            if json.get("gasFillingLowPressureStep")
            else None
        ),
        depressurizationStep=(
            depressurization_api_to_bean(json.get("depressurizationStep"))
            if json.get("depressurizationStep")
            else None
        ),
        gasFillingHighPressureStep=(
            gas_filling_high_pressure_api_to_bean(
                json.get("gasFillingHighPressureStep")
            )
            if json.get("gasFillingHighPressureStep")
            else None
        ),
        airthightnessTestLowPressureStep=(
            airtightness_test_low_pressure_api_to_bean(
                json.get("airthightnessTestLowPressureStep")
            )
            if json.get("airthightnessTestLowPressureStep")
            else None
        ),
        depressurizationFailed=(
            json["depressurizationFailed"] if "depressurizationFailed" in json else None
        ),
    )


def fsec_mapper_entity_to_active_bean(
    fsec_entity: FsecEntity,
    assembly_entity: AssemblyStepEntity,
    metrology_entity: MetrologyStepEntity,
    pictures_entity: PicturesStepEntity,
    sealing_entity: SealingStepEntity,
    permeation_entity: PermeationEntity,
    depressurization_entity: DepressurizationEntity,
    repressurization_entity: RepressurizationEntity,
    gas_filling_low_pressure_entity: GasFillingLowPressureEntity,
    gas_filling_high_pressure_entity: GasFillingHighPressureEntity,
    airtightness_test_low_pressure_entity: AirtightnessTestLowPressureEntity,
) -> FsecActiveBean:
    return FsecActiveBean(
        versionUuid=str(fsec_entity.version_uuid),
        fsecUuid=str(fsec_entity.fsec_uuid),
        status=fsec_status_mapper_entity_to_bean(fsec_entity.status),
        category=fsec_category_mapper_entity_to_bean(fsec_entity.category),
        lastUpdated=str(fsec_entity.last_updated),
        isActive=fsec_entity.is_active,
        createdAt=str(fsec_entity.created_at),
        rack=(
            fsec_rack_mapper_entity_to_bean(fsec_entity.rack)
            if fsec_entity.rack
            else None
        ),
        designStep=FsecDesignStepBean(
            name=fsec_entity.name,
            comments=fsec_entity.comments,
            campaign=(
                campaign_mapper_entity_to_bean(fsec_entity.campaign)
                if fsec_entity.campaign
                else None
            ),
            fsecTeam=[],
            fsecDocuments=[],
            versionUuid=str(fsec_entity.version_uuid),
        ),
        assemblyStep=(
            assembly_step_mapper_entity_to_bean(assembly_entity)
            if assembly_entity
            else None
        ),
        metrologyStep=(
            metrology_step_mapper_entity_to_bean(metrology_entity)
            if metrology_entity
            else None
        ),
        sealingStep=(
            sealing_step_mapper_entity_to_bean(sealing_entity)
            if sealing_entity is not None
            else None
        ),
        picturesStep=(
            pictures_step_mapper_entity_to_bean(pictures_entity)
            if pictures_entity
            else None
        ),
        usableStep=FsecUsableStepBean(
            deliveryDate=str(fsec_entity.delivery_date),
            fsecDocuments=[],
            versionUuid=str(fsec_entity.version_uuid),
        ),
        installedStep=FsecInstalledStepBean(
            shootingDate=str(fsec_entity.shooting_date),
            preshootingPressure=fsec_entity.preshooting_pressure,
            experienceSRxx=fsec_entity.experience_srxx,
            fsecDocuments=[],
            versionUuid=str(fsec_entity.version_uuid),
        ),
        shotStep=FsecShotStepBean(
            localisation=fsec_entity.localisation,
            versionUuid=str(fsec_entity.version_uuid),
        ),
        permeationStep=(
            permeation_mapper_entity_to_bean(permeation_entity)
            if permeation_entity is not None
            else None
        ),
        depressurizationStep=(
            depressurization_mapper_entity_to_bean(depressurization_entity)
            if depressurization_entity is not None
            else None
        ),
        repressurizationStep=(
            repressurization_mapper_entity_to_bean(repressurization_entity)
            if repressurization_entity is not None
            else None
        ),
        airthightnessTestLowPressureStep=(
            airtightness_test_low_mapper_entity_to_bean(
                airtightness_test_low_pressure_entity
            )
            if airtightness_test_low_pressure_entity is not None
            else None
        ),
        gasFillingHighPressureStep=(
            gas_filling_high_pressure_mapper_entity_to_bean(
                gas_filling_high_pressure_entity
            )
            if gas_filling_high_pressure_entity is not None
            else None
        ),
        gasFillingLowPressureStep=(
            gas_filling_low_pressure_mapper_entity_to_bean(
                gas_filling_low_pressure_entity
            )
            if gas_filling_low_pressure_entity is not None
            else None
        ),
        depressurizationFailed=fsec_entity.depressurization_failed,
    )


def fsec_mapper_bean_to_entity(
    fsec_bean: FsecBean,
) -> FsecEntity:
    return FsecEntity(
        fsec_uuid=UUID(fsec_bean.fsecUuid) if fsec_bean.fsecUuid else None,
        name=fsec_bean.designStep.name,
        comments=fsec_bean.designStep.comments,
        category=fsec_category_mapper_bean_to_entity(fsec_bean.category),
        status=fsec_status_mapper_bean_to_entity(fsec_bean.status),
        rack=(
            fsec_rack_mapper_bean_to_entity(fsec_bean.rack) if fsec_bean.rack else None
        ),
    )
