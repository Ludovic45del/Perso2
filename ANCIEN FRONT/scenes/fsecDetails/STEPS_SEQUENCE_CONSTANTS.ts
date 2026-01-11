import {TabData} from "../../services/utils/TabsUtils.service.ts";
import {StepModal} from "../../core/modal/stepper/StepperComponent.tsx";

const gaslessSequence: TabData[] = [
    {label: "Overview", path: "overview", stepToRedirectInModal: 0},
    {label: "Assemblage", path: "assemblage", stepToRedirectInModal: 1},
    {label: "Contrôle/Metrologie", path: "metrologie", stepToRedirectInModal: 1},
    {label: "Vue/Photo", path: "photo", stepToRedirectInModal: 1},
    {label: "Alignement/livraison/Résultats", path: "alignement", stepToRedirectInModal: 1},
];
const gasLowPressureWithPermeation: TabData[] = [
    {label: "Overview", path: "overview", stepToRedirectInModal: 0},
    {label: "Assemblage", path: "assemblage", stepToRedirectInModal: 1},
    {label: "Contrôle/Metrologie", path: "metrologie", stepToRedirectInModal: 1},
    {label: "Test d'étanchéité BP", path: "etancheite", stepToRedirectInModal: 1},
    {label: "Vue/Photo", path: "photo", stepToRedirectInModal: 1},
    {label: "Perméation", path: "permeation", stepToRedirectInModal: 1},
    {label: "Dépressurisation", path: "depressurisation", stepToRedirectInModal: 1},
    {label: "Represurisation", path: "repressurisation", stepToRedirectInModal: 1 , isDisabled: true},
    {label: "Remplissage BP", path: "remplissagebp", stepToRedirectInModal: 1},
    {label: "Alignement/livraison/Résultats", path: "alignement", stepToRedirectInModal: 1},
];
const gasLowPressure: TabData[] = [
    {label: "Overview", path: "overview", stepToRedirectInModal: 0},
    {label: "Assemblage", path: "assemblage", stepToRedirectInModal: 1},
    {label: "Contrôle/Metrologie", path: "metrologie", stepToRedirectInModal: 1},
    {label: "Test d'étanchéité BP", path: "etancheite", stepToRedirectInModal: 1},
    {label: "Vue/Photo", path: "photo", stepToRedirectInModal: 1},
    {label: "Remplissage BP", path: "remplissagebp", stepToRedirectInModal: 1},
    {label: "Alignement/livraison/Résultats", path: "alignement", stepToRedirectInModal: 1},
];
const gasLowAndHighPressure: TabData[] = [
    {label: "Overview", path: "overview", stepToRedirectInModal: 0},
    {label: "Assemblage", path: "assemblage", stepToRedirectInModal: 1},
    {label: "Contrôle/Metrologie", path: "metrologie", stepToRedirectInModal: 1},
    {label: "Test d'étanchéité BP", path: "etancheite", stepToRedirectInModal: 1},
    {label: "Vue/Photo", path: "photo", stepToRedirectInModal: 1},
    {label: "Remplissage BP", path: "remplissagebp", stepToRedirectInModal: 1},
    {label: "Remplissage HP", path: "remplissagehp", stepToRedirectInModal: 1},
    {label: "Alignement/livraison/Résultats", path: "alignement", stepToRedirectInModal: 1},
];
const gasHighPressure: TabData[] = [
    {label: "Overview", path: "overview", stepToRedirectInModal: 0},
    {label: "Assemblage", path: "assemblage", stepToRedirectInModal: 1},
    {label: "Contrôle/Metrologie", path: "metrologie", stepToRedirectInModal: 1},
    {label: "Vue/Photo", path: "photo", stepToRedirectInModal: 1},
    {label: "Remplissage HP", path: "remplissagehp", stepToRedirectInModal: 1},
    {label: "Alignement/livraison/Résultats", path: "alignement", stepToRedirectInModal: 1},
];

const gaslessWorkflowChain: StepModal[] = [
    {label: "Design", name: "Design"},
    {label: "Assemblage", name: "Assemblage"},
    {label: "Métrologie", name: "Métrologie"},
    {label: "Scellement", name: "Scellement"},
    {label: "Photos", name: "Photos"},
    {label: "Utilisable", name: "Utilisable"},
    {label: "Sur installation", name: "Sur installation"},
    {label: "Tirée", name: "Tirée"},
    {label: "HS", name: "HS"},
]
const gasLowPressureWorkflowChain: StepModal[] = [
    {label: "Design", name: "Design"},
    {label: "Assemblage", name: "Assemblage"},
    {label: "Métrologie", name: "Métrologie"},
    {label: "Scellement", name: "Scellement"},
    {label: "Etanchéité", name: "Test étanchéité BP"},
    {label: "Photos", name: "Photos"},
    {label: "Remp. BP", name: "Remplissage BP"},
    {label: "Utilisable", name: "Utilisable"},
    {label: "Sur installation", name: "Sur installation"},
    {label: "Tirée", name: "Tirée"},
    {label: "HS", name: "HS"},
]
const gasHighPressureWorkflowChain: StepModal[] = [
    {label: "Design", name: "Design"},
    {label: "Assemblage", name: "Assemblage"},
    {label: "Métrologie", name: "Métrologie"},
    {label: "Scellement", name: "Scellement"},
    {label: "Photos", name: "Photos"},
    {label: "Remp. HP", name: "Remplissage HP"},
    {label: "Utilisable", name: "Utilisable"},
    {label: "Sur installation", name: "Sur installation"},
    {label: "Tirée", name: "Tirée"},
    {label: "HS", name: "HS"},
]
const gasLowAndHighPressureWorkflowChain: StepModal[] = [
    {label: "Design", name: "Design"},
    {label: "Assemblage", name: "Assemblage"},
    {label: "Métrologie", name: "Métrologie"},
    {label: "Scellement", name: "Scellement"},
    {label: "Etanchéité", name: "Test étanchéité BP"},
    {label: "Photos", name: "Photos"},
    {label: "Remp. BP", name: "Remplissage BP"},
    {label: "Remp. HP", name: "Remplissage HP"},
    {label: "Utilisable", name: "Utilisable"},
    {label: "Sur installation", name: "Sur installation"},
    {label: "Tirée", name: "Tirée"},
    {label: "HS", name: "HS"},
]
const gasLowPressureWithPermeationWorkflowChain: StepModal[] = [

    {label: "Design", name: "Design"},
    {label: "Assemblage", name: "Assemblage"},
    {label: "Métrologie", name: "Métrologie"},
    {label: "Scellement", name: "Scellement"},
    {label: "Etanchéité", name: "Test étanchéité BP"},
    {label: "Photos", name: "Photos"},
    {label: "Perméation", name: "Permeation"},
    {label: "Dépress.", name: "Depressurisation"},
    {
        label: "Repress.", name: "Repressurisation"
        , isDisabled: true
    },
    {label: "Remp. BP", name: "Remplissage BP"},
    {label: "Utilisable", name: "Utilisable"},
    {label: "Sur installation", name: "Sur installation"},
    {label: "Tirée", name: "Tirée"},
    {label: "HS", name: "HS"},
]

export class STEPS_SEQUENCE_CONSTANTS {
    public get gasLessSequence() {
        return gaslessSequence
    }

    public get gaslessWorkflowChain() {
        return gaslessWorkflowChain
    }

    public get gasLowPressureSequence() {
        return gasLowPressure
    }

    public get gasLowPressureWorkflowChain() {
        return gasLowPressureWorkflowChain
    }

    public get gasHighPressureSequence() {
        return gasHighPressure
    }

    public get gasHighPressureWorkflowChain() {
        return gasHighPressureWorkflowChain
    }

    public get gasLowAndHighPressureSequence() {
        return gasLowAndHighPressure
    }

    public get gasLowAndHighPressureWorkflowChain() {
        return gasLowAndHighPressureWorkflowChain
    }

    public get gasLowPressureWithPermeationSequence() {
        return gasLowPressureWithPermeation
    }

    public get gasLowPressureWithPermeationWorkflowChain() {
        return gasLowPressureWithPermeationWorkflowChain
    }

}
