import {ModalContent} from "../../../core/modal/FormModal.tsx";
import FsecMetrologyStep from "./steps/FsecMetrologyStep.tsx";
import FsecMetrologyWorkflowStepModel from "../../../core/domain/fsec/steps/FsecMetrologyWorkflowStep.model.ts";

export const CREATION_FSEC_METROLOGY_WORKFLOW_STEP_MODAL_CONTENT: ModalContent[] = [
    {
        step: {label: 'Metrology', required: false},
        component: <FsecMetrologyStep/>,
    }
]

export const CREATION_FSEC_METROLOGY_WORKFLOW_STEP_TITLE: string = 'Retour à la Métrologie'
export const CREATION_FSEC_METROLOGY_WORKFLOW_STEP_WARNING_TITLE: string = 'Sauvegarder les modifications :'
export const CREATION_FSEC_METROLOGY_WORKFLOW_STEP_WARNING_MESSAGE: string = 'Voulez vous annuler le changement d\'étape ?'
export const CREATION_FSEC_METROLOGY_WORKFLOW_STEP_WARNING_BUTTON: string = 'Sauvegarder'

export const CREATION_FSEC_METROLOGY_WORKFLOW_STEP_DEFAULT_FORM: FsecMetrologyWorkflowStepModel = {

    date: null,
    comments: "",
    machine: null,
    fsecTeam: [{name: '', role: {label: "METROLOGUE", id: 4}}],
    fsecDocuments: [{path: '', type: {id: 0, label: 'METROLOGY'}, subtype: {id: 6, label: 'Visrad réalisé'}},
        {path: '',type: {id: 0, label: 'METROLOGY'},subtype: {id: 7, label: 'Fichier métro'}},
        {path: '', type: {id: 0, label: 'METROLOGY'}, subtype: {id: 9, label: 'FDM'}}],
    versionUuid: null,
    rack: null

}




