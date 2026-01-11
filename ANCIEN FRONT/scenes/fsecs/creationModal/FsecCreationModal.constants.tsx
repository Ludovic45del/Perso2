import {ModalContent} from "../../../core/modal/FormModal.tsx";
import FsecOverview from "./step/FsecOverview.tsx";
import FsecModel from "../../../core/domain/fsec/Fsec.model.ts";

export const CREATION_FSEC_MODAL_CONTENT: ModalContent[] = [
    {
        step: {label: 'Données générales', required: false},
        component: <FsecOverview/>,
    }
]


export const CREATION_FSEC_TITLE: string = 'Création d\'une FSEC'
export const CREATION_FSEC_WARNING_TITLE: string = 'Sauvegarde FSEC :'
export const CREATION_FSEC_WARNING_MESSAGE: string = "Voulez vous sauvegarder la FSEC en cours de création ?"
export const CREATION_FSEC_WARNING_BUTTON: string = 'Sauvegarder'


export const CREATION_FSEC_DEFAULT_FORM: FsecModel = {
    name: '',
    comments: '',
    campaign: null,
    status: null,
    category: null,
    fsecTeam: [{name: '', role: {label: 'MOE', id: 0}}, {name: '', role: {label: 'REC', id: 1}}, {
        name: '',
        role: {label: 'IEC', id: 2}
    }],
    fsecDocument: [
        {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 0, label: 'Visrad initial'}},
        {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 1, label: 'Vues'}},
        {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 2, label: '.STP Métro'}},
        {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 3, label: 'Fiches Car'}},
        {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 4, label: 'Fiche de réception'}},
        {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 5, label: 'Gamme d’assemblage'}},
    ]
}




