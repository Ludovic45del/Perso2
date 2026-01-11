import uuid

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from cible.api.fsec.models.fsec_api import FsecApi
from cible.domain.fsec.interface.i_fsec_repository import IFsecRepository
from cible.domain.fsec.models.fsec_active_bean import FsecActiveBean
from cible.domain.fsec.models.fsec_base_bean import FsecBaseBean
from cible.domain.fsec.models.fsec_bean import FsecBean
from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.domain.fsec.models.steps.fsec_airthightness_test_low_pressure_bean import (
    FsecAirthightnessTestLowPressureStepBean,
)
from cible.domain.fsec.models.steps.fsec_assembly_step_bean import FsecAssemblyStepBean
from cible.domain.fsec.models.steps.fsec_depressurization_bean import (
    FsecDepressurizationStepBean,
)
from cible.domain.fsec.models.steps.fsec_gas_filling_high_pressure_bean import (
    FsecGasFillingHighPressureStepBean,
)
from cible.domain.fsec.models.steps.fsec_gas_filling_low_pressure_bean import (
    FsecGasFillingLowPressureStepBean,
)
from cible.domain.fsec.models.steps.fsec_metrology_step_bean import (
    FsecMetrologyStepBean,
)
from cible.domain.fsec.models.steps.fsec_permeation_bean import FsecPermeationStepBean
from cible.domain.fsec.models.steps.fsec_pictures_step_bean import FsecPicturesStepBean
from cible.domain.fsec.models.steps.fsec_repressurization_bean import (
    FsecRepressurizationStepBean,
)
from cible.domain.fsec.models.steps.fsec_sealing_step_bean import FsecSealingStepBean
from cible.mapper.fsec.fsec_document_mapper import (
    fsec_document_mapper_bean_to_entity,
    fsec_duplicated_document_mapper_bean_to_entity,
)
from cible.mapper.fsec.fsec_mapper import (
    fsec_mapper_bean_to_entity,
    fsec_mapper_entity_to_active_bean,
    fsec_mapper_entity_to_api,
    fsec_mapper_entity_to_bean,
)
from cible.mapper.fsec.fsec_rack_mapper import fsec_rack_mapper_bean_to_entity
from cible.mapper.fsec.fsec_team_mapper import (
    fsec_duplicated_team_mapper_bean_to_entity,
    fsec_team_mapper_bean_to_entity,
)
from cible.mapper.fsec.steps.airtightness_test_low_pressure_mapper import (
    airtightness_test_low_mapper_bean_to_entity,
)
from cible.mapper.fsec.steps.assembly_step_mapper import (
    assembly_bench_mapper_bean_to_entity,
    assembly_step_mapper_bean_to_entity,
    assembly_workflow_step_mapper_bean_to_entity,
)
from cible.mapper.fsec.steps.depressurization_mapper import (
    depressurization_mapper_bean_to_entity,
)
from cible.mapper.fsec.steps.gas_filling_high_pressure_mapper import (
    gas_filling_high_pressure_mapper_bean_to_entity,
)
from cible.mapper.fsec.steps.gas_filling_low_pressure_mapper import (
    gas_filling_low_pressure_mapper_bean_to_entity,
)
from cible.mapper.fsec.steps.metrology_step_mapper import (
    metrology_step_mapper_bean_to_entity,
)
from cible.mapper.fsec.steps.permeation_mapper import permeation_mapper_bean_to_entity
from cible.mapper.fsec.steps.pictures_step_mapper import (
    pictures_step_mapper_bean_to_entity,
)
from cible.mapper.fsec.steps.repressurization_mapper import (
    repressurization_mapper_bean_to_entity,
)
from cible.mapper.fsec.steps.sealing_step_mapper import (
    sealing_step_mapper_bean_to_entity,
)
from cible.repository.campaign.models.campaign import CampaignEntity
from cible.repository.fsec.models.fsec import FsecEntity
from cible.repository.fsec.models.fsec_documents import FsecDocumentEntity
from cible.repository.fsec.models.fsec_team import FsecTeamEntity
from cible.repository.fsec.models.referential.fsec_category import FsecCategoryEntity
from cible.repository.fsec.models.referential.fsec_document_subtype import (
    FsecDocumentSubtypeEntity,
)
from cible.repository.fsec.models.referential.fsec_rack import FsecRackEntity
from cible.repository.fsec.models.referential.fsec_role import FsecRoleEntity
from cible.repository.fsec.models.referential.fsec_status import FsecStatusEntity
from cible.repository.fsec.models.referential.metrology_machine import (
    MetrologyMachineEntity,
)
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


class FsecRepository(IFsecRepository):

    def get_all_fsecs(self) -> list[FsecApi]:
        fsecs = FsecEntity.objects.all().filter(is_active=True)
        if len(fsecs) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: fsec_mapper_entity_to_api(x),
                    fsecs,
                )
            )

    def get_fsec_by_uuid(self, uuid) -> FsecBean:
        fsec = get_object_or_404(FsecEntity, pk=uuid, is_active=True)
        assembly = AssemblyStepEntity.objects.filter(fsec_version=uuid)
        metrology = MetrologyStepEntity.objects.filter(fsec_version=uuid)
        pictures = PicturesStepEntity.objects.filter(fsec_version=uuid)
        sealing = SealingStepEntity.objects.filter(fsec_version=uuid).first()

        match fsec.category.label:
            case "Sans Gaz":
                return fsec_mapper_entity_to_bean(
                    fsec, assembly, metrology, pictures, sealing
                )
            case "Avec Gaz HP":
                gas_filling_high = GasFillingHighPressureEntity.objects.filter(
                    fsec_version=uuid
                ).first()
                return fsec_mapper_entity_to_bean(
                    fsec,
                    assembly,
                    metrology,
                    pictures,
                    sealing,
                    None,
                    None,
                    None,
                    None,
                    gas_filling_high,
                    None,
                )
            case "Avec Gaz BP":
                airtightness = AirtightnessTestLowPressureEntity.objects.filter(
                    fsec_version_id=uuid
                ).first()
                gas_filling_low = GasFillingLowPressureEntity.objects.filter(
                    fsec_version=uuid
                ).first()
                return fsec_mapper_entity_to_bean(
                    fsec,
                    assembly,
                    metrology,
                    pictures,
                    sealing,
                    None,
                    None,
                    None,
                    gas_filling_low,
                    None,
                    airtightness,
                )
            case "Avec Gaz BP + HP":
                airtightness = AirtightnessTestLowPressureEntity.objects.filter(
                    fsec_version=uuid
                ).first()
                gas_filling_low = GasFillingLowPressureEntity.objects.filter(
                    fsec_version=uuid
                ).first()
                gas_filling_high = GasFillingHighPressureEntity.objects.filter(
                    fsec_version=uuid
                ).first()
                return fsec_mapper_entity_to_bean(
                    fsec,
                    assembly,
                    metrology,
                    pictures,
                    sealing,
                    None,
                    None,
                    None,
                    gas_filling_low,
                    gas_filling_high,
                    airtightness,
                )
            case "Avec Gaz Permeation + BP":
                permeation = PermeationEntity.objects.filter(fsec_version=uuid).first()
                depressurization = DepressurizationEntity.objects.filter(
                    fsec_version=uuid
                ).first()
                repressurization = RepressurizationEntity.objects.filter(
                    fsec_version=uuid
                ).first()
                airtightness = AirtightnessTestLowPressureEntity.objects.filter(
                    fsec_version=uuid
                ).first()
                gas_filling_low = GasFillingLowPressureEntity.objects.filter(
                    fsec_version=uuid
                ).first()
                return fsec_mapper_entity_to_bean(
                    fsec,
                    assembly,
                    metrology,
                    pictures,
                    sealing,
                    permeation,
                    depressurization,
                    repressurization,
                    gas_filling_low,
                    None,
                    airtightness,
                )
            case _:
                return fsec_mapper_entity_to_bean(
                    fsec, assembly, metrology, pictures, sealing
                )

    def get_fsec_base_by_uuid(self, fsec_uuid) -> FsecBaseBean:
        fsec = get_object_or_404(FsecEntity, pk=fsec_uuid, is_active=True)
        return fsec_mapper_entity_to_bean(fsec)

    @transaction.atomic
    def create_fsec(self, fsec_bean: FsecBean) -> FsecApi:
        fsec_entity = fsec_mapper_bean_to_entity(fsec_bean)

        fsec_entity.fsec_uuid = uuid.uuid4()

        fsec_entity.campaign = CampaignEntity.objects.get(
            pk=fsec_bean.designStep.campaign.uuid
        )
        fsec_entity.depressurization_failed = False
        fsec_entity.save()

        if not fsec_bean.toBeDuplicated:
            for team in fsec_bean.designStep.fsecTeam:
                team_entity = fsec_team_mapper_bean_to_entity(team)
                team_entity.fsec = fsec_entity
                team_entity.save()
                fsec_entity.fsecteamentity_set.add(team_entity)

            for documents in fsec_bean.designStep.fsecDocuments:
                documents_entity = fsec_document_mapper_bean_to_entity(documents)
                documents_entity.fsec = fsec_entity
                documents_entity.save()
                fsec_entity.fsecdocumententity_set.add(documents_entity)
        else:
            for team in fsec_bean.designStep.fsecTeam:
                team_entity = fsec_duplicated_team_mapper_bean_to_entity(team)
                team_entity.fsec = fsec_entity
                team_entity.uuid = uuid.uuid4()
                team_entity.save()
                fsec_entity.fsecteamentity_set.add(team_entity)
            for documents in fsec_bean.designStep.fsecDocuments:
                documents_entity = fsec_duplicated_document_mapper_bean_to_entity(
                    documents
                )
                documents_entity.fsec = fsec_entity
                documents_entity.uuid = uuid.uuid4()
                documents_entity.save()
                fsec_entity.fsecdocumententity_set.add(documents_entity)
        return fsec_mapper_entity_to_api(fsec_entity)

    @transaction.atomic
    def update_fsec(
        self, fsec_updated: FsecActiveBean
    ) -> (FsecActiveBean, list[FsecTeamBean], list[FsecDocumentBean]):
        """Met à jour un FSEC et ses étapes associées."""

        fsec_entity = get_object_or_404(FsecEntity, pk=fsec_updated.versionUuid)

        self.__update_fsec_basic_info(fsec_entity, fsec_updated)

        # Mise à jour des étapes
        assembly_step = self.__update_assembly_step(
            fsec_updated.assemblyStep, fsec_entity
        )
        metrology_step = self.__update_metrology_step(
            fsec_updated.metrologyStep, fsec_entity
        )
        sealing_step = self.__update_sealing_step(fsec_updated.sealingStep, fsec_entity)
        pictures_step = self.__update_pictures_step(
            fsec_updated.picturesStep, fsec_entity
        )

        # Mise à jour des équipes et documents
        teams = self.__aggregate_fsec_teams(fsec_updated)
        teams_entities = self.__update_fsec_teams(fsec_entity, teams)

        docs = self.__aggregate_fsec_documents(fsec_updated)
        docs_entities = self.__update_fsec_documents(fsec_entity, docs)

        match fsec_entity.category.label:
            case "Avec Gaz HP":
                if not self.is_all_fields_null_or_empty(
                    fsec_updated.gasFillingHighPressureStep
                ):
                    gas_filling_high_pressure_step = (
                        self.__update_gas_filling_high_pressure_step(
                            fsec_updated.gasFillingHighPressureStep, fsec_entity
                        )
                    )
                else:
                    gas_filling_high_pressure_step = None
                return (
                    fsec_mapper_entity_to_active_bean(
                        fsec_entity,
                        assembly_step,
                        metrology_step,
                        pictures_step,
                        sealing_step,
                        None,
                        None,
                        None,
                        None,
                        gas_filling_high_pressure_step,
                        None,
                    ),
                    teams_entities,
                    docs_entities,
                )
            case "Avec Gaz BP":
                if not self.is_all_fields_null_or_empty(
                    fsec_updated.airthightnessTestLowPressureStep
                ):
                    airtightness = self.__update_airtightness_step(
                        fsec_updated.airthightnessTestLowPressureStep, fsec_entity
                    )
                else:
                    airtightness = None
                if not self.is_all_fields_null_or_empty(
                    fsec_updated.gasFillingLowPressureStep
                ):
                    gas_filling_low_pressure_step = (
                        self.__update_gas_filling_low_pressure_step(
                            fsec_updated.gasFillingLowPressureStep, fsec_entity
                        )
                    )
                else:
                    gas_filling_low_pressure_step = None
                return (
                    fsec_mapper_entity_to_active_bean(
                        fsec_entity,
                        assembly_step,
                        metrology_step,
                        pictures_step,
                        sealing_step,
                        None,
                        None,
                        None,
                        gas_filling_low_pressure_step,
                        None,
                        airtightness,
                    ),
                    teams_entities,
                    docs_entities,
                )
            case "Avec Gaz BP + HP":
                if not self.is_all_fields_null_or_empty(
                    fsec_updated.airthightnessTestLowPressureStep
                ):
                    airtightness = self.__update_airtightness_step(
                        fsec_updated.airthightnessTestLowPressureStep, fsec_entity
                    )
                else:
                    airtightness = None
                if not self.is_all_fields_null_or_empty(
                    fsec_updated.gasFillingLowPressureStep
                ):
                    gas_filling_low_pressure_step = (
                        self.__update_gas_filling_low_pressure_step(
                            fsec_updated.gasFillingLowPressureStep, fsec_entity
                        )
                    )
                else:
                    gas_filling_low_pressure_step = None
                if not self.is_all_fields_null_or_empty(
                    fsec_updated.gasFillingHighPressureStep
                ):
                    gas_filling_high_pressure_step = (
                        self.__update_gas_filling_high_pressure_step(
                            fsec_updated.gasFillingHighPressureStep, fsec_entity
                        )
                    )
                else:
                    gas_filling_high_pressure_step = None
                return (
                    fsec_mapper_entity_to_active_bean(
                        fsec_entity,
                        assembly_step,
                        metrology_step,
                        pictures_step,
                        sealing_step,
                        None,
                        None,
                        None,
                        gas_filling_low_pressure_step,
                        gas_filling_high_pressure_step,
                        airtightness,
                    ),
                    teams_entities,
                    docs_entities,
                )
            case "Avec Gaz Permeation + BP":
                if not self.is_all_fields_null_or_empty(
                    fsec_updated.airthightnessTestLowPressureStep
                ):
                    airtightness = self.__update_airtightness_step(
                        fsec_updated.airthightnessTestLowPressureStep, fsec_entity
                    )
                else:
                    airtightness = None
                if not self.is_all_fields_null_or_empty(
                    fsec_updated.gasFillingLowPressureStep
                ):
                    gas_filling_low_pressure_step = (
                        self.__update_gas_filling_low_pressure_step(
                            fsec_updated.gasFillingLowPressureStep, fsec_entity
                        )
                    )
                else:
                    gas_filling_low_pressure_step = None

                if not self.is_all_fields_null_or_empty(fsec_updated.permeationStep):
                    permeation_step = self.__update_permeation_step(
                        fsec_updated.permeationStep, fsec_entity
                    )
                else:
                    permeation_step = None

                if not self.is_all_fields_null_or_empty(
                    fsec_updated.repressurizationStep
                ):
                    repressurization_step = self.__update_repressurization_step(
                        fsec_updated.repressurizationStep, fsec_entity
                    )
                else:
                    repressurization_step = None
                if not self.is_all_fields_null_or_empty(
                    fsec_updated.depressurizationStep
                ):
                    depressurization_step = self.__update_depressurization_step(
                        fsec_updated.depressurizationStep, fsec_entity
                    )
                else:
                    depressurization_step = None
                return (
                    fsec_mapper_entity_to_active_bean(
                        fsec_entity,
                        assembly_step,
                        metrology_step,
                        pictures_step,
                        sealing_step,
                        permeation_step,
                        depressurization_step,
                        repressurization_step,
                        gas_filling_low_pressure_step,
                        None,
                        airtightness,
                    ),
                    teams_entities,
                    docs_entities,
                )
            case _:
                return (
                    fsec_mapper_entity_to_active_bean(
                        fsec_entity,
                        assembly_step,
                        metrology_step,
                        pictures_step,
                        sealing_step,
                        None,
                        None,
                        None,
                        None,
                        None,
                        None,
                    ),
                    teams_entities,
                    docs_entities,
                )

    @staticmethod
    def __update_fsec_basic_info(fsec_entity: FsecEntity, fsec_updated: FsecActiveBean):
        """Met à jour les informations de base d'une FSEC."""
        try:
            fsec_entity.status = get_object_or_404(
                FsecStatusEntity, id=fsec_updated.status.id
            )
            fsec_entity.category = get_object_or_404(
                FsecCategoryEntity, id=fsec_updated.category.id
            )

            if fsec_entity.rack:
                fsec_entity.rack = get_object_or_404(
                    FsecRackEntity, id=fsec_updated.rack.id
                )

            fsec_entity.name = fsec_updated.designStep.name
            fsec_entity.campaign = get_object_or_404(
                CampaignEntity, pk=fsec_updated.designStep.campaign.uuid
            )

            fsec_entity.comments = fsec_updated.designStep.comments
            fsec_entity.last_updated = timezone.now()

            if fsec_updated.usableStep:
                fsec_entity.delivery_date = fsec_updated.usableStep.deliveryDate
            if fsec_updated.installedStep:
                fsec_entity.shooting_date = fsec_updated.installedStep.shootingDate
                fsec_entity.preshooting_pressure = (
                    fsec_updated.installedStep.preshootingPressure
                )
                fsec_entity.experience_srxx = fsec_updated.installedStep.experienceSRxx
            if fsec_updated.shotStep:
                fsec_entity.localisation = fsec_updated.shotStep.localisation

            fsec_entity.save()
        except ObjectDoesNotExist as e:
            raise ValueError(f"Une entité liée est introuvable : {str(e)}")
        except Exception:
            raise ValueError(
                f"Erreur lors de la mise à jour du FSEC : {fsec_entity.name}"
            )

    @staticmethod
    def __update_assembly_step(
        assembly_step_data: FsecAssemblyStepBean, fsec_entity: FsecEntity
    ):
        if not assembly_step_data:
            return None

        step = AssemblyStepEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.start_date = assembly_step_data.startDate
            step.end_date = assembly_step_data.endDate
            step.comments = assembly_step_data.comments

            benches = list(
                map(
                    lambda x: assembly_bench_mapper_bean_to_entity(x),
                    assembly_step_data.assemblyBench,
                )
                if assembly_step_data.assemblyBench
                else []
            )

            for bench in benches:
                bench.save()

            step.assembly_bench.set(benches)

        else:
            step = assembly_step_mapper_bean_to_entity(assembly_step_data)
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __update_metrology_step(
        metrology_step_data: FsecMetrologyStepBean, fsec_entity: FsecEntity
    ):
        if not metrology_step_data:
            return None

        step = MetrologyStepEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.comments = metrology_step_data.comments
            step.date = metrology_step_data.date

            if metrology_step_data.machine:
                step.machine = get_object_or_404(
                    MetrologyMachineEntity, id=metrology_step_data.machine.id
                )
        else:
            step = metrology_step_mapper_bean_to_entity(metrology_step_data)
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __update_sealing_step(
        sealing_step_data: FsecSealingStepBean, fsec_entity: FsecEntity
    ):
        if not sealing_step_data:
            return None

        step = SealingStepEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.comments = sealing_step_data.comments
            step.interface_io = sealing_step_data.interfaceIO
        else:
            step = sealing_step_mapper_bean_to_entity(sealing_step_data)
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __update_pictures_step(
        pictures_step_data: FsecPicturesStepBean, fsec_entity: FsecEntity
    ):
        if not pictures_step_data:
            return None

        step = PicturesStepEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.comments = pictures_step_data.comments
            step.last_updated = pictures_step_data.lastUpdated
        else:
            step = pictures_step_mapper_bean_to_entity(pictures_step_data)
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __update_permeation_step(
        permeation_step_data: FsecPermeationStepBean, fsec_entity: FsecEntity
    ):
        if not permeation_step_data:
            return None

        step = PermeationEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.gas_type = permeation_step_data.gasType
            step.sensor_pressure = permeation_step_data.sensorPressure
            step.computed_shot_pressure = permeation_step_data.computedShotPressure
            step.target_pressure = permeation_step_data.targetPressure
            step.start_date = permeation_step_data.startDate
            step.estimated_end_date = permeation_step_data.estimatedEndDate
            step.operator = permeation_step_data.operator
        else:
            step = permeation_mapper_bean_to_entity(permeation_step_data)
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __update_gas_filling_low_pressure_step(
        gas_filling_low_pressure_step_data: FsecGasFillingLowPressureStepBean,
        fsec_entity: FsecEntity,
    ):
        if not gas_filling_low_pressure_step_data:
            return None

        step = GasFillingLowPressureEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.experiment_pressure = (
                gas_filling_low_pressure_step_data.experimentPressure
            )
            step.gas_container = gas_filling_low_pressure_step_data.gasContainer
            step.gas_type = gas_filling_low_pressure_step_data.gasType
            step.gas_base = gas_filling_low_pressure_step_data.gasBase
            step.operator = gas_filling_low_pressure_step_data.operator
            step.observations = gas_filling_low_pressure_step_data.observations
            step.leak_rate_dtri = gas_filling_low_pressure_step_data.leakRateDtri
            step.date_of_fulfilment = (
                gas_filling_low_pressure_step_data.dateOfFulfilment
            )
            step.leak_test_duration = (
                gas_filling_low_pressure_step_data.leakTestDuration
            )

        else:
            step = gas_filling_low_pressure_mapper_bean_to_entity(
                gas_filling_low_pressure_step_data
            )
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __update_gas_filling_high_pressure_step(
        gas_filling_high_pressure_step_data: FsecGasFillingHighPressureStepBean,
        fsec_entity: FsecEntity,
    ):
        if not gas_filling_high_pressure_step_data:
            return None

        step = GasFillingHighPressureEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.experiment_pressure = (
                gas_filling_high_pressure_step_data.experimentPressure
            )
            step.gas_container = gas_filling_high_pressure_step_data.gasContainer
            step.gas_type = gas_filling_high_pressure_step_data.gasType
            step.gas_base = gas_filling_high_pressure_step_data.gasBase
            step.operator = gas_filling_high_pressure_step_data.operator
            step.observations = gas_filling_high_pressure_step_data.observations
            step.leak_rate_dtri = gas_filling_high_pressure_step_data.leakRateDtri
            step.date_of_fulfilment = (
                gas_filling_high_pressure_step_data.dateOfFulfilment
            )
        else:
            step = gas_filling_high_pressure_mapper_bean_to_entity(
                gas_filling_high_pressure_step_data
            )
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __update_depressurization_step(
        depressurization_step_data: FsecDepressurizationStepBean,
        fsec_entity: FsecEntity,
    ):
        if not depressurization_step_data:
            return None

        step = DepressurizationEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.operator = depressurization_step_data.operator
            step.observations = depressurization_step_data.observations
            step.date_of_fulfilment = depressurization_step_data.dateOfFulfilment
            step.computed_pressure_before_firing = (
                depressurization_step_data.computedPressureBeforeFiring
            )
            step.depressurization_time_before_firing = (
                depressurization_step_data.depressurizationTimeBeforeFiring
            )
            step.enclosure_pressure_measured = (
                depressurization_step_data.enclosurePressureMeasured
            )
            step.end_time = depressurization_step_data.endTime
            step.start_time = depressurization_step_data.startTime
            step.pressure_gauge = depressurization_step_data.pressureGauge
        else:
            step = depressurization_mapper_bean_to_entity(depressurization_step_data)
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __update_repressurization_step(
        repressurization_step_data: FsecRepressurizationStepBean,
        fsec_entity: FsecEntity,
    ):
        if not repressurization_step_data:
            return None

        step = RepressurizationEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.operator = repressurization_step_data.operator
            step.gas_type = repressurization_step_data.gasType
            step.start_date = repressurization_step_data.startDate
            step.estimated_end_date = repressurization_step_data.estimatedEndDate
            step.sensor_pressure = repressurization_step_data.sensorPressure
            step.computed_pressure = repressurization_step_data.computedPressure
        else:
            step = repressurization_mapper_bean_to_entity(repressurization_step_data)
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __update_airtightness_step(
        airtightness_step_data: FsecAirthightnessTestLowPressureStepBean,
        fsec_entity: FsecEntity,
    ):
        if not airtightness_step_data:
            return None

        step = AirtightnessTestLowPressureEntity.objects.filter(
            fsec_version=fsec_entity.version_uuid
        ).first()

        if step:
            step.operator = airtightness_step_data.operator
            step.gas_type = airtightness_step_data.gasType
            step.experiment_pressure = airtightness_step_data.experimentPressure
            step.date_of_fulfilment = airtightness_step_data.dateOfFulfilment
            step.leak_rate_dtri = airtightness_step_data.leakRateDtri
            step.airtightness_test_duration = (
                airtightness_step_data.airtightnessTestDuration
            )
        else:
            step = airtightness_test_low_mapper_bean_to_entity(airtightness_step_data)
            step.fsec_version = fsec_entity

        step.save()
        return step

    @staticmethod
    def __aggregate_fsec_teams(fsec: FsecActiveBean) -> list[FsecTeamBean]:
        merged_teams = fsec.usableStep.fsecTeam + fsec.designStep.fsecTeam

        if fsec.assemblyStep:
            merged_teams += fsec.assemblyStep.fsecTeam
        if fsec.picturesStep:
            merged_teams += fsec.picturesStep.fsecTeam
        if fsec.metrologyStep:
            merged_teams += fsec.metrologyStep.fsecTeam

        return merged_teams

    @staticmethod
    def __update_fsec_teams(
        fsec: FsecEntity, teams: list[FsecTeamBean]
    ) -> list[FsecTeamEntity]:
        fsec.fsecteamentity_set.all().delete()
        fsec_team_entities = []
        for team in teams:
            if team.name.strip():
                try:
                    team_entity = FsecTeamEntity(name=team.name)
                    team_entity.role = get_object_or_404(
                        FsecRoleEntity, id=team.role.id
                    )
                    team_entity.fsec = fsec
                    team_entity.save()
                    fsec.fsecteamentity_set.add(team_entity)
                    fsec_team_entities.append(team_entity)
                except Exception:
                    raise ValueError(
                        f"Erreur lors de la mise à jour d'une équipe : {team.name}"
                    )
        return fsec_team_entities

    @staticmethod
    def __aggregate_fsec_documents(fsec: FsecActiveBean) -> list[FsecDocumentBean]:
        merged_documents = (
            fsec.designStep.fsecDocuments + fsec.installedStep.fsecDocuments
        )

        if fsec.picturesStep:
            merged_documents += fsec.picturesStep.fsecDocuments
        if fsec.metrologyStep:
            merged_documents += fsec.metrologyStep.fsecDocuments

        return merged_documents

    @staticmethod
    def __update_fsec_documents(
        fsec: FsecEntity, documents: list[FsecDocumentBean]
    ) -> list[FsecDocumentEntity]:
        fsec.fsecdocumententity_set.all().delete()
        fsec_docs_entities = []
        for doc in documents:
            if doc.path.strip():
                try:
                    doc_entity = FsecDocumentEntity(
                        name=doc.name,
                        path=doc.path,
                        date=(doc.date if doc.date is not None else timezone.now()),
                    )
                    doc_entity.subtype = get_object_or_404(
                        FsecDocumentSubtypeEntity, id=doc.subtype.id
                    )
                    doc_entity.fsec = fsec
                    doc_entity.save()
                    fsec.fsecdocumententity_set.add(doc_entity)
                    fsec_docs_entities.append(doc_entity)
                except Exception:
                    raise ValueError(
                        f"Erreur lors de la mise à jour d'un document : {doc.path}"
                    )
        return fsec_docs_entities

    def does_fsec_exist_by_name_and_campaign(self, name, campaign_uuid) -> bool:
        return FsecEntity.objects.filter(name=name, campaign=campaign_uuid).exists()

    def does_fsec_name_used(
        self, fsec_version_uuid: uuid.UUID, name: str, campaign_uuid
    ) -> bool:
        return FsecEntity.objects.filter(
            ~Q(version_uuid=fsec_version_uuid), name=name, campaign=campaign_uuid
        ).exists()

    def does_fsec_exist_by_version_uuid(self, version_uuid) -> bool:
        return FsecEntity.objects.filter(version_uuid=version_uuid).exists()

    def delete_fsec(self, version_uuid) -> None:
        fsec = get_object_or_404(FsecEntity, version_uuid=version_uuid)
        fsec.delete()

    def calculate_fsec_increment(self, name) -> str:

        base_name = name.rstrip("0123456789")
        existing_names = FsecEntity.objects.filter(
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

    def get_all_fsecs_by_campaign_uuid(self, campaign_uuid) -> list[FsecApi]:

        fsecs = FsecEntity.objects.filter(campaign=campaign_uuid, is_active=True)

        return (
            list(
                map(
                    lambda x: fsec_mapper_entity_to_api(x),
                    fsecs,
                )
            )
            if len(fsecs)
            else []
        )

    def is_all_fields_null_or_empty(self, obj):
        for key, value in vars(obj).items():
            if value not in (None, "", "None"):
                return False
        return True

    def delete_common_steps(self, fsec_uuid: str):

        metrology = MetrologyStepEntity.objects.filter(fsec_version=fsec_uuid)
        pictures = PicturesStepEntity.objects.filter(fsec_version=fsec_uuid)
        sealing = SealingStepEntity.objects.filter(fsec_version=fsec_uuid).first()

        if metrology:
            metrology.delete()
        if pictures:
            pictures.delete()
        if sealing:
            sealing.delete()

    def delete_steps_with_gas(self, fsec: FsecEntity, fsec_uuid: str):

        # Delete for BP
        if fsec.status.label == "Avec Gaz BP":
            airtightness = AirtightnessTestLowPressureEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if airtightness:
                airtightness.delete()
            gas_filling_low_pressure = GasFillingLowPressureEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if gas_filling_low_pressure:
                gas_filling_low_pressure.delete()
        # Delete for HP
        if fsec.status.label == "Avec Gaz HP":
            gas_filling_high_pressure = GasFillingHighPressureEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if gas_filling_high_pressure:
                gas_filling_high_pressure.delete()

        # Delete for BP + HP
        if fsec.status.label == "Avec Gaz BP + HP":
            airtightness = AirtightnessTestLowPressureEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if airtightness:
                airtightness.delete()
            gas_filling_low_pressure = GasFillingLowPressureEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if gas_filling_low_pressure:
                gas_filling_low_pressure.delete()
            gas_filling_high_pressure = GasFillingHighPressureEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if gas_filling_high_pressure:
                gas_filling_high_pressure.delete()

        # Delete for Permeation BP
        if fsec.status.label == "Avec Gaz Permeation + BP":
            airtightness = AirtightnessTestLowPressureEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if airtightness:
                airtightness.delete()
            gas_filling_low_pressure = GasFillingLowPressureEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if gas_filling_low_pressure:
                gas_filling_low_pressure.delete()
            permeation = PermeationEntity.objects.filter(fsec_version=fsec_uuid)
            if permeation:
                permeation.delete()
            depressurization = DepressurizationEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if depressurization:
                depressurization.delete()
            repressurization = RepressurizationEntity.objects.filter(
                fsec_version=fsec_uuid
            )
            if repressurization:
                repressurization.delete()

    def delete_unwanted_teams(self, fsec: FsecEntity):
        roles_to_keep = ["RCE", "IEC", "MOE", "ASSEMBLEUR"]

        teams = (
            FsecTeamEntity.objects.all()
            .filter(fsec_id=fsec.version_uuid)
            .exclude(role__label__in=roles_to_keep)
        )

        if teams:
            teams.delete()

    def delete_unwanted_documents(self, fsec: FsecEntity):
        # PROVISOIRE
        document_types_to_keep = ["0", "1", "2", "3", "4", "5"]

        documents = (
            FsecDocumentEntity.objects.all()
            .filter(fsec_id=fsec.version_uuid)
            .exclude(subtype_id__in=document_types_to_keep)
        )

        if documents:
            documents.delete()
        #####

    def save_benches_and_assembly_step(
        self, fsec: FsecEntity, assembly_step: FsecAssemblyStepBean
    ):

        benches = list(
            map(
                lambda x: assembly_bench_mapper_bean_to_entity(x),
                assembly_step.assemblyBench,
            )
            if assembly_step.assemblyBench
            else []
        )

        for bench in benches:
            bench.save()

        assembly: AssemblyStepEntity = assembly_workflow_step_mapper_bean_to_entity(
            assembly_step
        )
        assembly.fsec_version = fsec
        assembly.save()
        assembly.assembly_bench.set(benches)

        for team in assembly_step.fsecTeam:
            team_entity = fsec_team_mapper_bean_to_entity(team)
            team_entity.fsec = fsec
            team_entity.save()
            fsec.fsecteamentity_set.add(team_entity)

    def return_to_assembly_step(
        self, assembly_step: FsecAssemblyStepBean, fsec_uuid: str
    ) -> FsecBean:

        fsec = get_object_or_404(FsecEntity, pk=fsec_uuid, is_active=True)

        self.delete_common_steps(fsec_uuid)

        self.delete_steps_with_gas(fsec, fsec_uuid)

        self.delete_unwanted_teams(fsec)

        self.delete_unwanted_documents(fsec)

        # Buffering the campaign
        saved_campaign = fsec.campaign

        # Deactivating the FSEC and deleting the campaign link
        fsec.is_active = False
        fsec.campaign = None
        fsec.save()

        # Copying the FSEC
        fsec.version_uuid = uuid.uuid4()
        fsec.is_active = True
        fsec.rack = None
        fsec.campaign = saved_campaign
        fsec.status = FsecStatusEntity.objects.get(id=1)
        fsec.save()

        self.save_benches_and_assembly_step(fsec, assembly_step)

        return fsec_mapper_entity_to_bean(fsec)

    def save_teams_and_documents_metrology_step(
        self, fsec: FsecEntity, metrology_step: FsecMetrologyStepBean
    ):

        metrology = metrology_step_mapper_bean_to_entity(metrology_step)
        metrology.fsec_version = fsec
        metrology.save()

        for team in metrology_step.fsecTeam:
            team_entity = fsec_team_mapper_bean_to_entity(team)
            team_entity.fsec = fsec
            team_entity.save()
            fsec.fsecteamentity_set.add(team_entity)

        for documents in metrology_step.fsecDocuments:
            documents_entity = fsec_document_mapper_bean_to_entity(documents)
            documents_entity.fsec = fsec
            documents_entity.save()
            fsec.fsecdocumententity_set.add(documents_entity)

    def return_to_metrology_step(
        self, metrology_step: FsecMetrologyStepBean, fsec_uuid: str
    ) -> FsecBean:

        # @TODO Mettre le nouveau numéro de version sur toutes les steps suivantes ?
        fsec = get_object_or_404(FsecEntity, pk=fsec_uuid, is_active=True)

        # Buffering the campaign
        saved_campaign = fsec.campaign

        # Deactivating the FSEC and deleting the campaign link
        fsec.is_active = False
        fsec.campaign = None
        fsec.save()

        # Copying the FSEC
        fsec.version_uuid = uuid.uuid4()
        fsec.is_active = True
        fsec.rack = fsec_rack_mapper_bean_to_entity(metrology_step.rack)
        fsec.campaign = saved_campaign
        fsec.status = FsecStatusEntity.objects.get(id=2)
        fsec.save()

        assembly = AssemblyStepEntity.objects.filter(fsec_version=fsec_uuid).first()
        if assembly:
            assembly.fsec_version_id = fsec.version_uuid
            assembly.save(force_update=True)

        self.save_teams_and_documents_metrology_step(fsec, metrology_step)

        return fsec_mapper_entity_to_bean(fsec)

    def change_depressurization_status(self, fsec_uuid: str) -> None:

        fsec = get_object_or_404(FsecEntity, pk=fsec_uuid, is_active=True)

        if not fsec.depressurization_failed:
            fsec.depressurization_failed = True

        fsec.save(force_update=True)

    def return_to_repressurization_step(self, fsec_uuid: str) -> FsecBean:

        fsec = get_object_or_404(FsecEntity, pk=fsec_uuid, is_active=True)

        saved_campaign = fsec.campaign

        fsec.is_active = False
        fsec.campaign = None
        fsec.save()

        fsec.version_uuid = uuid.uuid4()
        fsec.is_active = True
        fsec.campaign = saved_campaign

        fsec.status = FsecStatusEntity.objects.get(id=14)
        fsec.save()

        gas_filling = GasFillingLowPressureEntity.objects.filter(fsec_version=fsec_uuid)
        if gas_filling:
            gas_filling.delete()

        repressurization = RepressurizationEntity.objects.filter(fsec_version=fsec_uuid)
        if repressurization:
            repressurization.delete()

        assembly = AssemblyStepEntity.objects.filter(fsec_version=fsec_uuid).first()
        if assembly:
            assembly.fsec_version_id = fsec.version_uuid
            assembly.save(force_update=True)

        metrology = MetrologyStepEntity.objects.filter(fsec_version=fsec_uuid).first()
        if metrology:
            metrology.fsec_version_id = fsec.version_uuid
            metrology.save(force_update=True)

        sealing = SealingStepEntity.objects.filter(fsec_version=fsec_uuid)
        if sealing:
            sealing.fsec_version_id = fsec.version_uuid
            sealing.save(force_update=True)

        airtightness = AirtightnessTestLowPressureEntity.objects.filter(
            fsec_version=fsec_uuid
        )
        if airtightness:
            airtightness.fsec_version_id = fsec.version_uuid
            airtightness.save(force_update=True)

        pictures = PicturesStepEntity.objects.filter(fsec_version=fsec_uuid)
        if pictures:
            pictures.fsec_version_id = fsec.version_uuid
            pictures.save(force_update=True)

        permeation = PermeationEntity.objects.filter(fsec_version=fsec_uuid)
        if permeation:
            permeation.fsec_version_id = fsec.version_uuid
            permeation.save(force_update=True)

        depressurization = DepressurizationEntity.objects.filter(fsec_version=fsec_uuid)
        if depressurization:
            depressurization.fsec_version_id = fsec.version_uuid
            depressurization.save(force_update=True)

        return fsec_mapper_entity_to_bean(fsec)

    def return_to_re_assembly_step(self, fsec_uuid: str) -> FsecBean:

        fsec = get_object_or_404(FsecEntity, pk=fsec_uuid, is_active=True)

        saved_campaign = fsec.campaign

        fsec.is_active = False
        fsec.campaign = None
        fsec.save()

        fsec.version_uuid = uuid.uuid4()
        fsec.is_active = True
        fsec.campaign = saved_campaign

        fsec.status = FsecStatusEntity.objects.get(id=1)
        fsec.save()

        return fsec_mapper_entity_to_bean(fsec)
