/**
 * Update FSEC Modal UI
 * @module features/update-fsec/ui
 *
 * Pattern: Same as features/update-campaign/ui/UpdateCampaignModal.tsx
 * Layout selon rapport FSEC MODALE:
 * - 6 Steps avec Stepper: Overview, Assemblage, Métrologie, Scellement, Photos, Workflow
 */

import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    Step,
    StepButton,
    Alert,
    Divider,
    Box,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Fsec, FsecUpdateSchema, FsecUpdate, useUpdateFsec, useDeleteFsec } from '@entities/fsec';
import { useState, useEffect } from 'react';
import { useNotification } from '@shared/ui';
import { useNavigate } from 'react-router-dom';
import {
    FsecUpdateOverview,
    FsecAssemblage,
    FsecMetrologie,
    FsecScellement,
    FsecPhotos,
    FsecResultats,
    FsecWorkflowStep,
    isOverviewStepCompleted,
    isAssemblyStepCompleted,
    isMetrologyStepCompleted,
    isSealingStepCompleted,
    isPhotosStepCompleted,
    isResultatsStepCompleted,
} from './steps';

const ALL_STEPS = [
    { label: 'Données générales', key: 'overview' },
    { label: 'Assemblage', key: 'assembly' },
    { label: 'Métrologie', key: 'metrology' },
    { label: 'Scellement', key: 'sealing' },
    { label: 'Photos', key: 'pictures' },
    { label: 'Workflow', key: 'workflow' },
    { label: 'Résultats', key: 'results' },
] as const;

interface UpdateFsecModalProps {
    isOpen: boolean;
    onClose: () => void;
    fsec: Fsec | null;
}

/** Default values for update form */
const getDefaultValues = (fsec: Fsec | null): FsecUpdate => ({
    categoryId: fsec?.categoryId ?? null,
    statusId: fsec?.statusId ?? 0,
    rackId: fsec?.rackId ?? null,
    designStep: {
        name: fsec?.name ?? '',
        campaignId: fsec?.campaignId ?? null,
        comments: fsec?.comments ?? null,
        fsecTeam: [
            { name: '', roleId: 1 },
            { name: '', roleId: 2 },
            { name: '', roleId: 3 },
        ],
        fsecDocuments: [
            { path: '', subtypeId: 1 },
            { path: '', subtypeId: 2 },
            { path: '', subtypeId: 3 },
            { path: '', subtypeId: 4 },
            { path: '', subtypeId: 5 },
            { path: '', subtypeId: 6 },
        ],
    },
    assemblyStep: {
        startDate: null,
        endDate: null,
        assemblyBenchId: null,
        assemblerName: '',
        comments: null,
    },
    metrologyStep: {
        date: null,
        machineId: null,
        metrologueName: '',
        visradControlePath: '',
        fichierMetroPath: '',
        ecartMetroPath: '',
        comments: null,
    },
    sealingStep: {
        interfaceIO: null,
        comments: null,
    },
    picturesStep: {
        lastUpdated: null,
        equipeName: '',
        fsecDocuments: [],
        comments: null,
    },
    usableStep: {
        deliveryDate: fsec?.deliveryDate ?? null,
    },
    installedStep: {
        shootingDate: fsec?.shootingDate ?? null,
        preshootingPressure: fsec?.preshootingPressure ?? null,
        experienceSrxx: fsec?.experienceSrxx ?? null,
        fsecDocuments: [],
    },
});

export function UpdateFsecModal({ isOpen, onClose, fsec }: UpdateFsecModalProps) {
    const updateMutation = useUpdateFsec();
    const deleteMutation = useDeleteFsec();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [activeStep, setActiveStep] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Filter steps based on category (1 = Sans Gaz in current backend)
    const isSansGaz = fsec?.categoryId === 1;
    const steps = isSansGaz
        ? ALL_STEPS.filter(s => s.key !== 'results')
        : ALL_STEPS;

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
        watch,
        setValue,
    } = useForm<FsecUpdate>({
        resolver: zodResolver(FsecUpdateSchema),
        defaultValues: getDefaultValues(fsec),
    });

    const formData = watch();

    // Pre-fill form when fsec changes
    useEffect(() => {
        if (fsec && isOpen) {
            resetForm(getDefaultValues(fsec));
            setActiveStep(0);
            setShowDeleteConfirm(false);
        }
    }, [fsec, isOpen, resetForm]);

    /** Check if a step is completed */
    const isStepCompleted = (stepIndex: number): boolean => {
        const step = steps[stepIndex];
        if (!step) return false;

        switch (step.key) {
            case 'overview':
                return isOverviewStepCompleted(formData);
            case 'assembly':
                return isAssemblyStepCompleted(formData);
            case 'metrology':
                return isMetrologyStepCompleted(formData);
            case 'sealing':
                return isSealingStepCompleted(formData);
            case 'pictures':
                return isPhotosStepCompleted(formData);
            case 'results':
                return isResultatsStepCompleted(formData);
            case 'workflow':
                return formData.statusId !== null;
            default:
                return false;
        }
    };

    const onSubmit = async (data: FsecUpdate) => {
        if (!fsec) return;

        try {
            await updateMutation.mutateAsync({
                versionUuid: fsec.versionUuid,
                data,
            });
            showNotification('FSEC mis à jour avec succès', 'success');
            onClose();
        } catch (error) {
            console.error('FSEC update failed:', error);
            showNotification('Erreur lors de la mise à jour', 'error');
        }
    };

    const handleClose = () => {
        setActiveStep(0);
        setShowDeleteConfirm(false);
        onClose();
    };

    const handleStepClick = (stepIndex: number) => {
        setActiveStep(stepIndex);
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    if (!fsec) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, minHeight: '80vh' }
            }}
        >
            {/* Header avec Stepper */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Modification FSEC: {fsec.name}
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={step.key} completed={isStepCompleted(index)}>
                            <StepButton
                                onClick={() => handleStepClick(index)}
                                icon={isStepCompleted(index) ? <CheckCircleIcon color="success" /> : undefined}
                            >
                                {step.label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <form id="update-fsec-form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ minHeight: 400, p: 4, pt: 3 }}>
                    {updateMutation.isError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            Erreur lors de la mise à jour du FSEC
                        </Alert>
                    )}

                    {/* Step Content */}
                    {steps[activeStep].key === 'overview' && (
                        <FsecUpdateOverview control={control} errors={errors} watch={watch} />
                    )}
                    {steps[activeStep].key === 'assembly' && (
                        <FsecAssemblage control={control} errors={errors} watch={watch} setValue={setValue} />
                    )}
                    {steps[activeStep].key === 'metrology' && (
                        <FsecMetrologie control={control} errors={errors} watch={watch} setValue={setValue} />
                    )}
                    {steps[activeStep].key === 'sealing' && (
                        <FsecScellement control={control} errors={errors} />
                    )}
                    {steps[activeStep].key === 'pictures' && (
                        <FsecPhotos control={control} errors={errors} watch={watch} />
                    )}
                    {steps[activeStep].key === 'results' && (
                        <FsecResultats control={control} errors={errors} watch={watch} />
                    )}
                    {steps[activeStep].key === 'workflow' && (
                        <FsecWorkflowStep control={control} watch={watch} setValue={setValue} />
                    )}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                    <Box>
                        {!showDeleteConfirm ? (
                            <Button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                sx={{ fontWeight: 600 }}
                            >
                                Supprimer
                            </Button>
                        ) : (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="error" fontWeight={600}>
                                    Confirmer ?
                                </Typography>
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await deleteMutation.mutateAsync(fsec.versionUuid);
                                            showNotification('FSEC supprimé', 'success');
                                            navigate('/fsecs');
                                        } catch {
                                            showNotification('Erreur lors de la suppression', 'error');
                                        }
                                    }}
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? 'Suppression...' : 'Oui'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    variant="text"
                                    size="small"
                                >
                                    Non
                                </Button>
                            </Stack>
                        )}
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            type="button"
                            onClick={handleBack}
                            variant="text"
                            disabled={activeStep === 0}
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                        >
                            Précédent
                        </Button>
                        {activeStep < steps.length - 1 ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                variant="outlined"
                                sx={{ fontWeight: 600, textTransform: 'none' }}
                            >
                                Suivant
                            </Button>
                        ) : null}
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant="outlined"
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={updateMutation.isPending}
                            sx={{ fontWeight: 700, textTransform: 'none' }}
                        >
                            {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </Stack>
                </DialogActions>
            </form>
        </Dialog>
    );
}
