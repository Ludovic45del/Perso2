import FsecDetailedModel from "../../core/domain/fsec/FsecDetailed.model.ts";
import FsecActiveModel from "../../core/domain/fsec/FsecActive.model.ts";
import {mapToDate} from "../utils/utils.service.ts";
import dayjs from "dayjs";

export const prepareFsecForUpdateService = (fsec: FsecDetailedModel): FsecActiveModel => {

    const fsecData: FsecActiveModel = {
        ...fsec,
        assemblyStep: fsec.assemblyStep.find(assemblyStep => assemblyStep.versionUuid === fsec.versionUuid),
        metrologyStep: fsec.metrologyStep.find(metrologyStep => metrologyStep.versionUuid === fsec.versionUuid),
        picturesStep: fsec.picturesStep.find(picturesStep => picturesStep.versionUuid === fsec.versionUuid),
    };

    const prepareGenericSteps = (fsecData: FsecActiveModel) => {
        if (fsecData.assemblyStep) {
            fsecData.assemblyStep.endDate = mapToDate(fsecData.assemblyStep.endDate)
            fsecData.assemblyStep.startDate = mapToDate(fsecData.assemblyStep.startDate)
        } else {
            fsecData.assemblyStep = {
                fsecTeam: [{name: '', role: {label: "ASSEMBLEUR", id: 3}}],
                endDate: null,
                startDate: null,
                comments: '',
                versionUuid: fsecData.versionUuid,
                assemblyBench: [],
            }
        }
        if (fsecData.picturesStep) {
            fsecData.picturesStep.lastUpdated = mapToDate(fsecData.picturesStep.lastUpdated)
        } else {
            fsecData.picturesStep = {
                fsecDocuments: [{path: '', subtype: {id: 8, label: 'Vue'}}],
                fsecTeam: [{name: '', role: {label: "OPERATEUR_PHOTOS", id: 5}}],
                comments: '',
                lastUpdated: null,
                versionUuid: fsecData.versionUuid
            }
        }

        if (fsecData.metrologyStep) {
            fsecData.metrologyStep.date = mapToDate(fsecData.metrologyStep.date)
        } else {
            fsecData.metrologyStep = {
                date: null,
                comments: "",
                machine: null,
                fsecTeam: [{name: '', role: {label: "METROLOGUE", id: 4}}],
                fsecDocuments: [{path: '', subtype: {id: 6, label: 'Visrad réalisé'}}, {
                    path: '',
                    subtype: {id: 7, label: 'Fichier métro'}
                }, {path: '', subtype: {id: 9, label: 'FDM'}}],
                versionUuid: fsecData.versionUuid
            }
        }
        fsecData.usableStep.deliveryDate = mapToDate(fsecData.usableStep.deliveryDate)
        fsecData.installedStep.shootingDate = mapToDate(fsecData.installedStep.shootingDate)
    }

    const prepareGasFillingLowPressureStep = (fsecData: FsecActiveModel) => {
        if (fsec.gasFillingLowPressureStep) {
            fsecData.gasFillingLowPressureStep.dateOfFulfilment = mapToDate(fsecData.gasFillingLowPressureStep.dateOfFulfilment)
        } else {
            fsecData.gasFillingLowPressureStep = {
                dateOfFulfilment: null,
                operator: '',
                experimentPressure: null,
                gasBase: null,
                gasContainer: null,
                gasType: '',
                leakRateDtri: '',
                leakTestDuration: null,
                observations: '',

            }
        }
    }

    const prepareGasFillingHighPressureStep = (fsecData: FsecActiveModel) => {
        if (fsec.gasFillingHighPressureStep) {
            fsecData.gasFillingHighPressureStep.dateOfFulfilment = mapToDate(fsecData.gasFillingHighPressureStep.dateOfFulfilment)
        } else {
            fsecData.gasFillingHighPressureStep = {
                dateOfFulfilment: null,
                operator: '',
                experimentPressure: null,
                gasBase: null,
                gasContainer: null,
                gasType: '',
                leakRateDtri: '',
                observations: '',

            }
        }
    }
    const prepareAirtightnessStep = (fsecData: FsecActiveModel) => {
        if (fsec.airthightnessTestLowPressureStep) {
            fsecData.airthightnessTestLowPressureStep.dateOfFulfilment = mapToDate(fsecData.airthightnessTestLowPressureStep.dateOfFulfilment)
        } else {
            fsecData.airthightnessTestLowPressureStep = {
                dateOfFulfilment: null,
                operator: '',
                experimentPressure: null,
                gasType: '',
                leakRateDtri: '',
                airtightnessTestDuration: null,
            }
        }
    }

    const preparePermeationSteps = (fsecData: FsecActiveModel) => {
        if (fsec.permeationStep) {
            fsecData.permeationStep.startDate = mapToDate(fsecData.permeationStep.startDate)
            fsecData.permeationStep.estimatedEndDate = mapToDate(fsecData.permeationStep.estimatedEndDate)
        } else {
            fsecData.permeationStep = {
                operator: '',
                gasType: '',
                estimatedEndDate: null,
                computedShotPressure: null,
                startDate: null,
                sensorPressure: null,
                targetPressure: null,
            }
        }
        if (fsec.depressurizationStep) {
            fsecData.depressurizationStep.dateOfFulfilment = mapToDate(fsecData.depressurizationStep.dateOfFulfilment)
            fsecData.depressurizationStep.startTime = dayjs(fsecData.depressurizationStep.startTime).isValid() ? dayjs(fsecData.depressurizationStep.startTime) : null
            fsecData.depressurizationStep.endTime = dayjs(fsecData.depressurizationStep.endTime).isValid() ? dayjs(fsecData.depressurizationStep.endTime) : null
        }
        else {
            fsecData.depressurizationStep = {
                endTime: null,
                dateOfFulfilment: null,
                operator: '',
                computedPressureBeforeFiring: null,
                startTime: null,
                enclosurePressureMeasured: null,
                pressureGauge: null,
                observations: '',
                depressurizationTimeBeforeFiring: null,
            }
        }
        if (fsec.repressurizationStep) {
            fsecData.repressurizationStep.estimatedEndDate = mapToDate(fsecData.repressurizationStep.estimatedEndDate)
            fsecData.repressurizationStep.startDate = mapToDate(fsecData.repressurizationStep.startDate)
        }
        else {
            fsecData.repressurizationStep = {
                operator: '',
                estimatedEndDate: null,
                startDate: null,
                gasType: '',
                sensorPressure: null,
                computedPressure: null,
            }
        }
    }


    switch (fsec?.category?.label) {
        case "Sans Gaz":
            prepareGenericSteps(fsecData)
            return fsecData
        case "Avec Gaz HP":
            prepareGenericSteps(fsecData)
            prepareGasFillingHighPressureStep(fsecData)
            return fsecData
        case "Avec Gaz BP":
            prepareGenericSteps(fsecData)
            prepareAirtightnessStep(fsecData)
            prepareGasFillingLowPressureStep(fsecData)
            return fsecData
        case "Avec Gaz BP + HP":
            prepareGenericSteps(fsecData)
            prepareAirtightnessStep(fsecData)
            prepareGasFillingLowPressureStep(fsecData)
            prepareGasFillingHighPressureStep(fsecData)
            return fsecData
        case "Avec Gaz Permeation + BP":
            prepareGenericSteps(fsecData)
            prepareAirtightnessStep(fsecData)
            prepareGasFillingLowPressureStep(fsecData)
            preparePermeationSteps(fsecData)
            return fsecData
        default:
            break
    }

}