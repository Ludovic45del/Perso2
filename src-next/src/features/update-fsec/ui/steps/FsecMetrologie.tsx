/**
 * FsecMetrologie - Step 3: Métrologie
 * @module features/update-fsec/ui/steps
 *
 * Layout 3 colonnes selon rapport FSEC MODALE:
 * - Colonne 1: Métrologue, Documents (Visrad contrôle, Fichier métro, Écart métro)
 * - Colonne 2: Machine métrologie, Conteneur/Rack
 * - Colonne 3: Remarques, Bouton "Métrologie Réalisée", Date métrologie
 */

import { Grid, Stack, TextField, Box, Typography, Button, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ChipSelect } from '@widgets/chip-select';
import { FSEC_METROLOGY_MACHINE_OPTIONS, FSEC_RACK_OPTIONS } from '@entities/fsec/lib';
import { FsecUpdate } from '@entities/fsec';

interface FsecMetrologieProps {
    control: Control<FsecUpdate>;
    errors: FieldErrors<FsecUpdate>;
    watch: UseFormWatch<FsecUpdate>;
    setValue: UseFormSetValue<FsecUpdate>;
}

export function FsecMetrologie({ control, errors, watch, setValue }: FsecMetrologieProps) {
    const metrologyDate = watch('metrologyStep.date');

    const handleMetrologyDone = () => {
        setValue('metrologyStep.date', new Date(), { shouldDirty: true });
    };

    return (
        <Grid container spacing={4}>
            {/* Colonne 1: Équipe + Documents */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Équipe + Documents
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Métrologue */}
                    <Controller
                        name="metrologyStep.metrologueName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Métrologue"
                                fullWidth
                                size="small"
                            />
                        )}
                    />

                    {/* Visrad contrôle */}
                    <Controller
                        name="metrologyStep.visradControlePath"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Visrad contrôle"
                                placeholder="Chemin du fichier..."
                                fullWidth
                                size="small"
                            />
                        )}
                    />

                    {/* Fichier métro */}
                    <Controller
                        name="metrologyStep.fichierMetroPath"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Fichier métro"
                                placeholder="Chemin du fichier..."
                                fullWidth
                                size="small"
                            />
                        )}
                    />

                    {/* Écart métro */}
                    <Controller
                        name="metrologyStep.ecartMetroPath"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Écart métro"
                                placeholder="Chemin du fichier..."
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                </Stack>
            </Grid>

            {/* Colonne 2: Machines */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Machines
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Machine métrologie */}
                    <Controller
                        name="metrologyStep.machineId"
                        control={control}
                        render={({ field }) => (
                            <Box>
                                <ChipSelect
                                    {...field}
                                    label="Machine métrologie"
                                    options={FSEC_METROLOGY_MACHINE_OPTIONS}
                                    required
                                    error={Boolean(errors.metrologyStep?.machineId)}
                                    value={field.value ?? ''}
                                />
                                {errors.metrologyStep?.machineId && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                        {errors.metrologyStep.machineId.message}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    />

                    {/* Conteneur/Rack */}
                    <Controller
                        name="rackId"
                        control={control}
                        render={({ field }) => (
                            <Box>
                                <ChipSelect
                                    {...field}
                                    label="Conteneur ou rack"
                                    options={FSEC_RACK_OPTIONS}
                                    required
                                    error={Boolean(errors.rackId)}
                                    value={field.value ?? ''}
                                />
                                {errors.rackId && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                        {errors.rackId.message}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    />
                </Stack>
            </Grid>

            {/* Colonne 3: Remarques + Date */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Remarques
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Remarques */}
                    <Controller
                        name="metrologyStep.comments"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Remarques"
                                multiline
                                rows={4}
                                fullWidth
                                size="small"
                            />
                        )}
                    />

                    {/* Bouton Métrologie Réalisée */}
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleMetrologyDone}
                        disabled={!!metrologyDate}
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                        Métrologie Réalisée
                    </Button>

                    {/* Date métrologie (disabled) */}
                    <Controller
                        name="metrologyStep.date"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <DatePicker
                                {...field}
                                label="Date métrologie"
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(date?.toDate() || null)}
                                disabled
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                    }
                                }}
                            />
                        )}
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}

/**
 * Validation function for Step 3
 */
export function isMetrologyStepCompleted(data: FsecUpdate): boolean {
    return (
        !!data.metrologyStep?.metrologueName &&
        !!data.metrologyStep?.visradControlePath &&
        !!data.metrologyStep?.fichierMetroPath &&
        !!data.metrologyStep?.ecartMetroPath &&
        !!data.rackId &&
        !!data.metrologyStep?.machineId
    );
}
