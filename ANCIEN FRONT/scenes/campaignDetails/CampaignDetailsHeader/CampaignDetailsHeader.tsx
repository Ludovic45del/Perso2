import {Box} from "@mui/material";
import CampaignName from "../CampaignName";
import {useCampaignContext} from "../../../hooks/contexts/Campaign.context";
import "./CampaignDetailsHeader.scss";
import StepperComponent, {StepModal} from "../../../core/modal/stepper/StepperComponent.tsx";
import {Forward} from "@mui/icons-material";
import Button from "@mui/material/Button";


interface CampaignDetailsHeaderProps {
    openUpdateModal: () => void
}


export default function CampaignDetailsHeader({openUpdateModal}: CampaignDetailsHeaderProps) {
    const stepsList: StepModal[] = [
        {label: "Brouillon"},
        {label: "Définition terminée"},
        {label: "En réalisation"},
        {label: "Terminée"},
    ];

    const {campaign: {status}} = useCampaignContext();

    const hasSameLabel = (element: any) => element.label == status?.label;
    const indexActiveStep = stepsList.findIndex(hasSameLabel);
    const stepsCompleted: { [key: number]: boolean } = {};
    stepsList.forEach(
        (step, index) => (stepsCompleted[index] = index < indexActiveStep)
    );

    return (
        <Box className="overview--header-menu">
            <Box className="menu--left-container">
                <CampaignName></CampaignName>
            </Box>
            <Box className="menu--stepper-container">
                <StepperComponent
                    steps={stepsList}
                    activeStep={indexActiveStep}
                    completedSteps={stepsCompleted}
                ></StepperComponent>
            </Box>
            <Box className="menu--right-container">
                <Button startIcon={<Forward/>} onClick={openUpdateModal}>
                    <span>Modifier</span>
                </Button>
            </Box>
        </Box>
    );
}
