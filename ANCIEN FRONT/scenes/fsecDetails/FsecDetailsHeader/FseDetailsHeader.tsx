import {Box} from "@mui/material";
import StepperComponent, {StepModal} from "../../../core/modal/stepper/StepperComponent.tsx";
import Button from "@mui/material/Button";
import {Forward} from "@mui/icons-material";
import {useFsecContext} from "../../../hooks/contexts/Fsec.context.tsx";
import FsecName from "../FsecName.tsx";
import './FsecDetailsHeader.scss'
import {useEffect, useState} from "react";
import FsecCategoryModel from "../../../core/domain/fsec/referentials/FsecCategory.model.ts";
import {STEPS_SEQUENCE_CONSTANTS} from "../STEPS_SEQUENCE_CONSTANTS.ts";

interface FsecDetailsHeaderProps {
    openUpdateModal: () => void,
    category: FsecCategoryModel
}

export default function FsecDetailsHeader({openUpdateModal, category}: FsecDetailsHeaderProps) {
    const [stepsList, setStepsList] = useState<StepModal[]>([]);
    const workflowChains = new STEPS_SEQUENCE_CONSTANTS()

    useEffect(() => {
        switch (category?.label) {
            case "Sans Gaz":
                setStepsList(workflowChains.gaslessWorkflowChain)
                break
            case "Avec Gaz HP":
                setStepsList(workflowChains.gasHighPressureWorkflowChain)
                break
            case "Avec Gaz BP":
                setStepsList(workflowChains.gasLowPressureWorkflowChain)
                break
            case "Avec Gaz BP + HP":
                setStepsList(workflowChains.gasLowAndHighPressureWorkflowChain)
                break
            case "Avec Gaz Permeation + BP":
                setStepsList(workflowChains.gasLowPressureWithPermeationWorkflowChain)
                break
            default:
                break
        }
    }, [category]);

    const {fsec} = useFsecContext();

    const hasSameName = (element: any) => fsec?.status?.label.toLowerCase().includes(element.name.toLowerCase());
    const indexActiveStep = stepsList.findIndex(hasSameName);
    const stepsCompleted: { [key: number]: boolean } = {};
    stepsList.forEach(
        (step, index) => (stepsCompleted[index] = index < indexActiveStep)
    );

    return (
        <Box className="overview--header-menu">
            <Box className="menu--left-container">
                <FsecName></FsecName>
            </Box>
            <Box className="menu--stepper-container">
                {fsec?.depressurizationFailed !== null && <StepperComponent
                    steps={stepsList}
                    activeStep={indexActiveStep}
                    completedSteps={stepsCompleted}
                    depressurizationFailed={fsec?.depressurizationFailed}
                ></StepperComponent>}
            </Box>
            <Box className="menu--right-container">
                <Button disabled>
                    <span>FA</span>
                </Button>
                <Button startIcon={<Forward/>} onClick={openUpdateModal}>
                    <span>Modifier</span>
                </Button>
            </Box>
        </Box>
    );
}

