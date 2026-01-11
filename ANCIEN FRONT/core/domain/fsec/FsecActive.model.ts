import FsecCategoryModel from "./referentials/FsecCategory.model.ts";
import FsecStatusModel from "./referentials/FsecStatus.model.ts";
import {Dayjs} from "dayjs";
import FsecDesignStepModel from "./steps/FsecDesignStep.model.ts";
import FsecAssemblyStepModel from "./steps/FsecAssemblyStep.model.ts";
import FsecMetrologyStepModel from "./steps/FsecMetrologyStep.model.ts";
import FsecSealingStepModel from "./steps/FsecSealingStep.model.ts";
import FsecPicturesStepModel from "./steps/FsecPicturesStep.model.ts";
import FsecUsableStepModel from "./steps/FsecUsableStep.model.ts";
import FsecInstalledStepModel from "./steps/FsecInstalledStep.model.ts";
import FsecShotStepModel from "./steps/FsecShotStep.model.ts";
import FsecRackModel from "./referentials/FsecRack.model.ts";
import FsecAirtightnessTestLowPressureModel from "./steps/FsecAirtightnessTestLowPressure.model.ts";
import FsecPermeationStepModel from "./steps/FsecPermeationStep.model.ts";
import FsecDepressurizationStepModel from "./steps/FsecDepressurizationStep.model.ts";
import FsecRepressurizationStepModel from "./steps/FsecRepressurizationStep.model.ts";
import FsecGasFillingLowPressureStepModel from "./steps/FsecGasFillingLowPressureStep.model.ts";
import FsecGasFillingHighPressureStepModel from "./steps/FsecGasFillingHighPressureStep.model.ts";

export default interface FsecActiveModel {
    versionUuid?: string
    fsecUuid: string,
    category: FsecCategoryModel,
    status: FsecStatusModel,
    lastUpdated?: Dayjs | null,
    createdAt?: Dayjs | null,
    isActive?: boolean,
    rack: FsecRackModel,
    designStep: FsecDesignStepModel,
    assemblyStep: FsecAssemblyStepModel,
    metrologyStep: FsecMetrologyStepModel,
    sealingStep: FsecSealingStepModel,
    picturesStep: FsecPicturesStepModel,
    usableStep: FsecUsableStepModel,
    installedStep: FsecInstalledStepModel,
    shotStep: FsecShotStepModel,
    airthightnessTestLowPressureStep: FsecAirtightnessTestLowPressureModel,
    permeationStep: FsecPermeationStepModel,
    depressurizationStep: FsecDepressurizationStepModel,
    repressurizationStep: FsecRepressurizationStepModel,
    gasFillingLowPressureStep: FsecGasFillingLowPressureStepModel,
    gasFillingHighPressureStep: FsecGasFillingHighPressureStepModel,
    depressurizationFailed?: boolean

}