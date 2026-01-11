import {ModalContent} from "../../../core/modal/FormModal.tsx";
import FsecAssemblage from "./step/FsecAssemblage.tsx";
import FsecMetrologie from "./step/FsecMetrologie.tsx";
import FsecScellement from "./step/FsecScellement.tsx";
import FsecPhotos from "./step/FsecPhotos.tsx";
import FsecUpdateOverview from "./step/FsecUpdateOverview.tsx";
import FsecWorkflowStep from "./step/FsecWorkflowStep.tsx";
import {UseFormGetValues} from "react-hook-form";
import FsecActiveModel from "../../../core/domain/fsec/FsecActive.model.ts";
import FsecHighPressure from "./step/FsecHighPressure.tsx";
import FsecAirthightness from "./step/FsecAirthightness.tsx";
import FsecLowPressure from "./step/FsecLowPressure.tsx";
import FsecPermeation from "./step/FsecPermeation.tsx";
import FsecDepressurization from "./step/FsecDepressurization.tsx";
import FsecRepressurization from "./step/FsecRepressurization.tsx";

export const UPDATE_FSEC_MODAL_CONTENT_GASLESS: ModalContent[] = [
    {
        step: {label: 'Données générales', required: false},
        component: <FsecUpdateOverview/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [designStep, category] = getValues(["designStep", 'category']);
            return !!designStep?.name
                && !!designStep?.campaign
                && !!category
        }
    },
    {
        step: {label: 'Assemblage', required: false, hasWorkflowButtons: {showReassemblyButton: true}},
        component: <FsecAssemblage/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const assemblyStep = getValues("assemblyStep");
            return !!assemblyStep?.startDate
                && !!assemblyStep?.endDate
                && !!assemblyStep?.assemblyBench
                && !!assemblyStep?.fsecTeam?.[0]?.name
        }
    },
    {
        step: {label: 'Métrologie', required: false, hasWorkflowButtons: {showAssemblyButton: true}},
        component: <FsecMetrologie/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [metrologyStep, rack] = getValues(["metrologyStep", "rack"]);
            return !!metrologyStep?.fsecTeam?.[0]?.name
                && !!metrologyStep?.fsecDocuments?.[0]?.path
                && !!metrologyStep?.fsecDocuments?.[1]?.path
                && !!metrologyStep?.fsecDocuments?.[2]?.path
                && !!rack
                && !!metrologyStep?.machine
        }
    },
    {
        step: {label: 'Scellement', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecScellement/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [sealingStep, rack] = getValues(["sealingStep", "rack"]);
            return !!rack
                && !!sealingStep?.interfaceIO
        }
    },
    {
        step: {label: 'Photos', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecPhotos/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const picturesStep = getValues("picturesStep");
            const allPathsAreSet = !picturesStep?.fsecDocuments?.some(doc => !doc.path)
            return !!picturesStep?.lastUpdated
                && !!picturesStep?.fsecTeam?.[0]?.name
                && !!allPathsAreSet
        }
    },
    {
        step: {label: 'Workflow', required: false},
        component: <FsecWorkflowStep/>,
        isStepCompleted: getValues => {
            return true
        }
    },
]

export const UPDATE_FSEC_MODAL_CONTENT_HIGH_PRESSURE: ModalContent[] = [
    {
        step: {label: 'Données générales', required: false},
        component: <FsecUpdateOverview/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [designStep, category] = getValues(["designStep", 'category']);
            return !!designStep?.name
                && !!designStep?.campaign
                && !!category
        }
    },
    {
        step: {label: 'Assemblage', required: false, hasWorkflowButtons: {showReassemblyButton: true}},
        component: <FsecAssemblage/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const assemblyStep = getValues("assemblyStep");
            return !!assemblyStep?.startDate
                && !!assemblyStep?.endDate
                && !!assemblyStep?.assemblyBench
                && !!assemblyStep?.fsecTeam?.[0]?.name
        }
    },
    {
        step: {label: 'Métrologie', required: false, hasWorkflowButtons: {showAssemblyButton: true}},
        component: <FsecMetrologie/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [metrologyStep, rack] = getValues(["metrologyStep", "rack"]);
            return !!metrologyStep?.fsecTeam?.[0]?.name
                && !!metrologyStep?.fsecDocuments?.[0]?.path
                && !!metrologyStep?.fsecDocuments?.[1]?.path
                && !!metrologyStep?.fsecDocuments?.[2]?.path
                && !!rack
                && !!metrologyStep?.machine
        }
    },
    {
        step: {label: 'Scellement', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecScellement/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [sealingStep, rack] = getValues(["sealingStep", "rack"]);
            return !!rack
                && !!sealingStep?.interfaceIO
        }
    },
    {
        step: {label: 'Photos', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecPhotos/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const picturesStep = getValues("picturesStep");
            const allPathsAreSet = !picturesStep?.fsecDocuments?.some(doc => !doc.path)
            return !!picturesStep?.lastUpdated
                && !!picturesStep?.fsecTeam?.[0]?.name
                && !!allPathsAreSet
        }
    },
    {
        step: {label: 'Remplissage HP', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecHighPressure/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const gasFillingHighPressureStep = getValues("gasFillingHighPressureStep");
            return !!gasFillingHighPressureStep?.leakRateDtri
                && !!gasFillingHighPressureStep?.experimentPressure
                && !!gasFillingHighPressureStep?.gasType
        }
    },
    {
        step: {label: 'Workflow', required: false},
        component: <FsecWorkflowStep/>,
        isStepCompleted: getValues => {
            return true
        }
    },
]

export const UPDATE_FSEC_MODAL_CONTENT_LOW_PRESSURE: ModalContent[] = [
    {
        step: {label: 'Données générales', required: false},
        component: <FsecUpdateOverview/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [designStep, category] = getValues(["designStep", 'category']);
            return !!designStep?.name
                && !!designStep?.campaign
                && !!category
        }
    },
    {
        step: {label: 'Assemblage', required: false, hasWorkflowButtons: {showReassemblyButton: true}},
        component: <FsecAssemblage/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const assemblyStep = getValues("assemblyStep");
            return !!assemblyStep?.startDate
                && !!assemblyStep?.endDate
                && !!assemblyStep?.assemblyBench
                && !!assemblyStep?.fsecTeam?.[0]?.name
        }
    },
    {
        step: {label: 'Métrologie', required: false, hasWorkflowButtons: {showAssemblyButton: true}},
        component: <FsecMetrologie/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [metrologyStep, rack] = getValues(["metrologyStep", "rack"]);
            return !!metrologyStep?.fsecTeam?.[0]?.name
                && !!metrologyStep?.fsecDocuments?.[0]?.path
                && !!metrologyStep?.fsecDocuments?.[1]?.path
                && !!metrologyStep?.fsecDocuments?.[2]?.path
                && !!rack
                && !!metrologyStep?.machine
        }
    },
    {
        step: {label: 'Scellement', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecScellement/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [sealingStep, rack] = getValues(["sealingStep", "rack"]);
            return !!rack
                && !!sealingStep?.interfaceIO
        }
    },
    {
        step: {label: 'Test étanchéité BP', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecAirthightness/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const airtightnessStep = getValues("airthightnessTestLowPressureStep");
            return !!airtightnessStep?.airtightnessTestDuration
                && !!airtightnessStep?.experimentPressure
                && !!airtightnessStep?.gasType
        }
    },
    {
        step: {label: 'Photos', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecPhotos/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const picturesStep = getValues("picturesStep");
            const allPathsAreSet = !picturesStep?.fsecDocuments?.some(doc => !doc.path)
            return !!picturesStep?.lastUpdated
                && !!picturesStep?.fsecTeam?.[0]?.name
                && !!allPathsAreSet
        }
    },
    {
        step: {label: 'Remplissage BP', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecLowPressure/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const gasFillingLowPressureStep = getValues("gasFillingLowPressureStep");
            return !!gasFillingLowPressureStep?.leakTestDuration
                && !!gasFillingLowPressureStep?.experimentPressure
                && !!gasFillingLowPressureStep?.gasType
        }
    },
    {
        step: {label: 'Workflow', required: false},
        component: <FsecWorkflowStep/>,
        isStepCompleted: getValues => {
            return true
        }
    },
]

export const UPDATE_FSEC_MODAL_CONTENT_LOW_AND_HIGH_PRESSURE: ModalContent[] = [
    {
        step: {label: 'Données générales', required: false},
        component: <FsecUpdateOverview/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [designStep, category] = getValues(["designStep", 'category']);
            return !!designStep?.name
                && !!designStep?.campaign
                && !!category
        }
    },
    {
        step: {label: 'Assemblage', required: false, hasWorkflowButtons: {showReassemblyButton: true}},
        component: <FsecAssemblage/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const assemblyStep = getValues("assemblyStep");
            return !!assemblyStep?.startDate
                && !!assemblyStep?.endDate
                && !!assemblyStep?.assemblyBench
                && !!assemblyStep?.fsecTeam?.[0]?.name
        }
    },
    {
        step: {label: 'Métrologie', required: false, hasWorkflowButtons: {showAssemblyButton: true}},
        component: <FsecMetrologie/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [metrologyStep, rack] = getValues(["metrologyStep", "rack"]);
            return !!metrologyStep?.fsecTeam?.[0]?.name
                && !!metrologyStep?.fsecDocuments?.[0]?.path
                && !!metrologyStep?.fsecDocuments?.[1]?.path
                && !!metrologyStep?.fsecDocuments?.[2]?.path
                && !!rack
                && !!metrologyStep?.machine
        }
    },
    {
        step: {label: 'Scellement', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecScellement/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [sealingStep, rack] = getValues(["sealingStep", "rack"]);
            return !!rack
                && !!sealingStep?.interfaceIO
        }
    },
    {
        step: {label: 'Test étanchéité BP', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecAirthightness/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const airtightnessStep = getValues("airthightnessTestLowPressureStep");
            return !!airtightnessStep?.airtightnessTestDuration
                && !!airtightnessStep?.experimentPressure
                && !!airtightnessStep?.gasType
        }
    },

    {
        step: {label: 'Photos', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecPhotos/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const picturesStep = getValues("picturesStep");
            const allPathsAreSet = !picturesStep?.fsecDocuments?.some(doc => !doc.path)
            return !!picturesStep?.lastUpdated
                && !!picturesStep?.fsecTeam?.[0]?.name
                && !!allPathsAreSet
        }
    },
    {
        step: {label: 'Remplissage BP', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecLowPressure/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const gasFillingLowPressureStep = getValues("gasFillingLowPressureStep");
            return !!gasFillingLowPressureStep?.leakTestDuration
                && !!gasFillingLowPressureStep?.experimentPressure
                && !!gasFillingLowPressureStep?.gasType
        }
    },
    {
        step: {label: 'Remplissage HP', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecHighPressure/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const gasFillingHighPressureStep = getValues("gasFillingHighPressureStep");
            return !!gasFillingHighPressureStep?.leakRateDtri
                && !!gasFillingHighPressureStep?.experimentPressure
                && !!gasFillingHighPressureStep?.gasType
        }
    },
    {
        step: {label: 'Workflow', required: false},
        component: <FsecWorkflowStep/>,
        isStepCompleted: getValues => {
            return true
        }
    },
]

export const UPDATE_FSEC_MODAL_CONTENT_LOW_PRESSURE_WITH_PERMEATION: ModalContent[] = [
    {
        step: {label: 'Données générales', required: false},
        component: <FsecUpdateOverview/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [designStep, category] = getValues(["designStep", 'category']);
            return !!designStep?.name
                && !!designStep?.campaign
                && !!category
        }
    },
    {
        step: {label: 'Assemblage', required: false, hasWorkflowButtons: {showReassemblyButton: true}},
        component: <FsecAssemblage/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const assemblyStep = getValues("assemblyStep");
            return !!assemblyStep?.startDate
                && !!assemblyStep?.endDate
                && !!assemblyStep?.assemblyBench
                && !!assemblyStep?.fsecTeam?.[0]?.name
        }
    },
    {
        step: {label: 'Métrologie', required: false, hasWorkflowButtons: {showAssemblyButton: true}},
        component: <FsecMetrologie/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [metrologyStep, rack] = getValues(["metrologyStep", "rack"]);
            return !!metrologyStep?.fsecTeam?.[0]?.name
                && !!metrologyStep?.fsecDocuments?.[0]?.path
                && !!metrologyStep?.fsecDocuments?.[1]?.path
                && !!metrologyStep?.fsecDocuments?.[2]?.path
                && !!rack
                && !!metrologyStep?.machine
        }
    },
    {
        step: {label: 'Scellement', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecScellement/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const [sealingStep, rack] = getValues(["sealingStep", "rack"]);
            return !!rack
                && !!sealingStep?.interfaceIO
        }
    },
    {
        step: {label: 'Test étanchéité BP', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecAirthightness/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const airtightnessStep = getValues("airthightnessTestLowPressureStep");
            return !!airtightnessStep?.airtightnessTestDuration
                && !!airtightnessStep?.experimentPressure
                && !!airtightnessStep?.gasType
        }
    },

    {
        step: {label: 'Photos', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecPhotos/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const picturesStep = getValues("picturesStep");
            const allPathsAreSet = !picturesStep?.fsecDocuments?.some(doc => !doc.path)
            return !!picturesStep?.lastUpdated
                && !!picturesStep?.fsecTeam?.[0]?.name
                && !!allPathsAreSet
        }
    },
    {
        step: {label: 'Permeation', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecPermeation/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const permeationStep = getValues("permeationStep");
            return !!permeationStep?.sensorPressure
                && !!permeationStep?.targetPressure
                && !!permeationStep?.computedShotPressure
                && !!permeationStep?.gasType
        }
    },
    {
        step: {label: 'Depressurisation', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}},
        component: <FsecDepressurization/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const depressurizationStep = getValues("depressurizationStep");
            return !!depressurizationStep?.pressureGauge
                && !!depressurizationStep?.enclosurePressureMeasured
                && !!depressurizationStep?.depressurizationTimeBeforeFiring
                && !!depressurizationStep?.computedPressureBeforeFiring
        }
    },
    {
        step: {
            label: 'Repressurisation', required: false
            , isDisabled: true
            ,hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true}
        },
        component: <FsecRepressurization/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const repressurizationStep = getValues("repressurizationStep");
            return !!repressurizationStep?.gasType
                && !!repressurizationStep?.sensorPressure
                && !!repressurizationStep?.computedPressure
        }
    },
    {
        step: {label: 'Remplissage BP', required: false, hasWorkflowButtons: {showAssemblyButton: true, showMetrologyButton: true, showPressurizationButton: true}},
        component: <FsecLowPressure/>,
        isStepCompleted: (getValues: UseFormGetValues<FsecActiveModel>) => {
            const gasFillingLowPressureStep = getValues("gasFillingLowPressureStep");
            return !!gasFillingLowPressureStep?.leakTestDuration
                && !!gasFillingLowPressureStep?.experimentPressure
                && !!gasFillingLowPressureStep?.gasType
        }
    },

    {
        step: {label: 'Workflow', required: false},
        component: <FsecWorkflowStep/>,
        isStepCompleted: getValues => {
            return true
        }
    },
]


export const UPDATE_FSEC_TITLE: string = 'Mise à jour d\'une FSEC'
export const UPDATE_FSEC_WARNING_TITLE: string = 'Sauvegarde FSEC :'
export const UPDATE_FSEC_WARNING_MESSAGE: string = "Voulez vous sauvegarder la FSEC en cours de modification ?"
export const UPDATE_FSEC_WARNING_BUTTON: string = 'Sauvegarder'
