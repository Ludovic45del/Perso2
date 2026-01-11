/**
 * FsecWorkflowStep - Step 6: Workflow
 * @module features/update-fsec/ui/steps
 *
 * Layout grille de statuts selon rapport FSEC MODALE:
 * - Paper buttons pour sélection de statut
 * - Statuts filtrés par catégorie
 */

import { Grid, Paper, Typography, Box, Divider } from '@mui/material';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FSEC_STATUSES } from '@entities/fsec/lib';
import { FsecUpdate } from '@entities/fsec';

interface FsecWorkflowStepProps {
    control: Control<FsecUpdate>;
    watch: UseFormWatch<FsecUpdate>;
    setValue: UseFormSetValue<FsecUpdate>;
}

export function FsecWorkflowStep({ watch, setValue }: FsecWorkflowStepProps) {
    const currentStatusId = watch('statusId');

    const handleStatusClick = (statusId: number) => {
        setValue('statusId', statusId, { shouldDirty: true });
    };

    return (
        <Box>
            <Divider sx={{ mb: 3 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                    Workflow
                </Typography>
            </Divider>
            <Grid container spacing={2}>
                {Object.values(FSEC_STATUSES).map((status) => (
                    <Grid item xs={6} md={4} key={status.id}>
                        <Paper
                            onClick={() => handleStatusClick(status.id)}
                            sx={{
                                p: 3,
                                cursor: 'pointer',
                                textAlign: 'center',
                                bgcolor: currentStatusId === status.id ? status.color : 'background.paper',
                                color: currentStatusId === status.id ? 'white' : 'text.primary',
                                border: '1px solid',
                                borderColor: currentStatusId === status.id ? status.color : 'divider',
                                borderRadius: 1.5,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    opacity: 0.9,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <Typography fontWeight={600}>{status.label}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
