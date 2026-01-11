import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import './StepperComponent.css';
import './StepperComponent.scss';
import {useEffect, useState} from "react";

export interface StepModal {
    label: string,
    name?: string,
    required?: boolean,
    isDisabled?: boolean
    hasWorkflowButtons?: {
        showAssemblyButton?: boolean,
        showMetrologyButton?: boolean,
        showReassemblyButton?: boolean,
        showPressurizationButton?: boolean
    }
}

interface CreateCampaignStepperProps {
    steps: StepModal[];
    activeStep: number;
    completedSteps: { [key: number]: boolean };
    onClick?: (stepIndex: number) => void;
    width?: string
    depressurizationFailed?: boolean

}


export default function StepperComponent(props: CreateCampaignStepperProps) {
    const [depressurizationFailed, setDepressurizationFailed] = useState<boolean>(false);

    const checkIfDisabledIsAhead = (step: StepModal, index: number) => {

        if (step.isDisabled && props.completedSteps[index] == true || !step.isDisabled) {
            return false
        } else if (depressurizationFailed == true) {
            return false
        } else {
            return true
        }
    }

    const hasRightToClick = (step: StepModal) => {

        if (step.isDisabled && depressurizationFailed !== true) {
            return false
        } else {
            return true
        }
    }
    const checkIfCompleted = (step: StepModal, index: number) => {
        if (props.completedSteps[index]) {
            if (props.depressurizationFailed == true) {
                return true
            } else if (step.label == 'Repress.' && props.depressurizationFailed == false) {
                return false
            }
        } else {
            return false
        }

    }

    useEffect(() => {
        if (props.depressurizationFailed) {
            setDepressurizationFailed(props.depressurizationFailed)
        }
    }, [props.depressurizationFailed]);

    return (
        <Box width={props.width ?? '100%'} marginTop='3vh' data-testid="box-stepper-component-testid">
            <Stepper activeStep={props.activeStep} alternativeLabel variant='outlined'>
                {props.steps.map((step: StepModal, index: number) => (
                    <Step key={step.label}
                          style={{zIndex: 100 - index}}
                          completed={checkIfCompleted(step, index)}
                          className={checkIfDisabledIsAhead(step, index) ? 'disable-step' : props.onClick ? 'active-step' : undefined}
                          onClick={() => hasRightToClick(step) && props.onClick ? props.onClick(index) : undefined}>
                        <StepLabel>
                            {step.label} {step.required && <span style={{color: 'red'}}> *</span>}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}