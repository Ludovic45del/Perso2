/**
 * Workflow Stepper Component
 * Displays and allows switching campaign status
 */

import { Stepper, Step, StepLabel, Box, StepButton } from '@mui/material';
import { CampaignWithRelations } from '@entities/campaign';
import { usePatchCampaign } from '@entities/campaign/api';
import { useNotification } from '@shared/ui';

interface WorkflowStepperProps {
    campaign: CampaignWithRelations;
}

const STEPS = [
    { label: 'Brouillon', id: 0 },
    { label: 'Définition terminée', id: 1 },
    { label: 'En réalisation', id: 2 },
    { label: 'Terminée', id: 3 },
];

export function WorkflowStepper({ campaign }: WorkflowStepperProps) {
    const { mutate: patchCampaign } = usePatchCampaign();
    const { showNotification } = useNotification();

    const activeStep = STEPS.findIndex(s => s.label === campaign.status?.label);

    const handleStepClick = (stepIndex: number) => {
        const targetStep = STEPS[stepIndex];
        if (!targetStep) return;

        // Map step ID to CampaignStatus ID from referential
        // In legacy, IDs were 1, 2, 3, 4 for these labels
        patchCampaign({
            uuid: campaign.uuid,
            data: { status_id: targetStep.id }
        }, {
            onSuccess: () => {
                showNotification('Statut mis à jour avec succès', 'success');
            },
            onError: (err: unknown) => {
                const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
                showNotification(`Erreur: ${errorMessage}`, 'error');
            }
        });
    };

    return (
        <Box sx={{ width: '100%', mt: 1 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {STEPS.map((step, index) => (
                    <Step key={step.id}>
                        <StepButton
                            onClick={() => handleStepClick(index)}
                            disabled={index === activeStep}
                        >
                            <StepLabel>{step.label}</StepLabel>
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
