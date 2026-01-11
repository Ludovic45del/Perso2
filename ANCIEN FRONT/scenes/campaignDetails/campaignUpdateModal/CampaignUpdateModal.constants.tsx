import {ModalContent} from "../../../core/modal/FormModal.tsx";
import Overview from "../../campaigns/creationModal/step/Overview.tsx";
import {UseFormGetValues} from "react-hook-form";
import CampaignModel from "../../../core/domain/campaign/Campaign.model.ts";
import Documentary from "../../campaigns/creationModal/step/Documentary.tsx";
import WorkflowStep from "./step/WokflowStep.tsx";

export const UPDATE_CAMPAIGN_MODAL_CONTENT: ModalContent[] = [
    {
        step: {label: 'Données générales', required: true},
        component: <Overview/>,
        isStepCompleted: (getValues: UseFormGetValues<CampaignModel>) => {
            const [name, semester, year, type, installation] = getValues(['name', 'semester', 'year', 'type', 'installation']);
            return !!name
                && !!semester
                && !!year
                && !!type
                && !!installation
        }
    }, {
        step: {label: 'Documentaire', required: false},
        component: <Documentary/>,
        isStepCompleted: (getValues: UseFormGetValues<CampaignModel>) => {
            const docs = getValues('campaignDocuments')
            return docs?.length > 0 && docs.some(doc => !!doc.name && !!doc.path && doc.type)
        }
    },
    {
        step: {label: 'Workflow', required: false},
        component: <WorkflowStep/>,
        isStepCompleted: getValues => {
            return true
        }
    },
]

export const UPDATE_CAMPAIGN_WARNING_TITLE: string = 'Sauvegarde campagne :'
export const UPDATE_CAMPAIGN_WARNING_MESSAGE: string = "Voulez vous modifier la campagne ? "
export const UPDATE_CAMPAIGN_WARNING_BUTTON: string = 'MODIFIER'
