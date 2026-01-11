import {ModalContent} from "../../../core/modal/FormModal.tsx";
import Overview from "./step/Overview.tsx";
import Documentary from "./step/Documentary.tsx";
import CampaignModel from "../../../core/domain/campaign/Campaign.model.ts";
import {UseFormGetValues} from "react-hook-form";

export const CREATION_CAMPAIGN_MODAL_CONTENT: ModalContent[] = [
    {
        step: {label: 'Données générales', required: true},
        component: <Overview/>,
        isStepCompleted: (getValues: UseFormGetValues<CampaignModel>) => {
            const [name, semester, year, type, installation] = getValues(['name', 'semester','year', 'type', 'installation']);
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
    {step: {label: 'Workflow', isDisabled: true}},
]

export const CREATION_CAMPAIGN_TITLE: string = 'Création d\'une campagne'
export const CREATION_CAMPAIGN_WARNING_TITLE: string = 'Sauvegarde campagne :'
export const CREATION_CAMPAIGN_WARNING_MESSAGE: string = "Voulez vous sauvegarder la campagne en cours de création ?"
export const CREATION_CAMPAIGN_WARNING_BUTTON: string = 'Sauvegarder'

export const CREATION_CAMPAIGN_DEFAULT_FORM: CampaignModel = {
    name: '',
    semester: null,
    year: null,
    status: null,
    type: null,
    installation: null,
    campaignTeam: [{name:'', role: {label:'MOE', id: 0}},{name:'', role: {label:'RCE', id: 1}},{name:'', role: {label:'IEC', id:2}}],
    campaignDocuments: [{name:'', path:'', type: null, subtype: null}],
    startDate: null,
    endDate: null,
    description: '',
    dtriNumber: null,

}