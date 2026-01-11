import {ModalContent} from "../../../core/modal/FormModal.tsx";
import FsecAssemblyStepModel from "../../../core/domain/fsec/steps/FsecAssemblyStep.model.ts";
import FsecAssemblyStep from "./steps/FsecAssemblyStep.tsx";

export const CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_MODAL_CONTENT: ModalContent[] = [
    {
        step: {label: 'Assemblage', required: false},
        component: <FsecAssemblyStep/>,
    }
]

export const CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_TITLE: string = 'Retour à l\'Assemblage'
export const CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_WARNING_TITLE: string = 'Sauvegarder les modifications :'
export const CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_WARNING_MESSAGE: string = 'Voulez vous annuler le changement d\'étape ?'
export const CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_WARNING_BUTTON: string = 'Sauvegarder'

export const CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_DEFAULT_FORM: FsecAssemblyStepModel = {

    fsecTeam: [{name: '', role: {label: "ASSEMBLEUR", id: 3}}],
    endDate: null,
    startDate: null,
    comments: '',
    versionUuid: null,
    assemblyBench: [],

}




