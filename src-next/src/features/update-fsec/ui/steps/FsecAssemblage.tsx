/**
 * FsecAssemblage - Step 2: Assemblage
 * @module features/update-fsec/ui/steps
 *
 * Layout 3 colonnes selon rapport FSEC MODALE:
 * - Colonne 1: Assembleur, Bouton "Commencer assemblage", Date début
 * - Colonne 2: Banc d'assemblage
 * - Colonne 3: Remarques, Bouton "Assemblage terminé", Date fin
 */

import { Grid, Stack, TextField, Box, Typography, Button, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ChipSelect } from '@widgets/chip-select';
import { FSEC_ASSEMBLY_BENCH_OPTIONS } from '@entities/fsec/lib';
import { FsecUpdate } from '@entities/fsec';

interface FsecAssemblageProps {
    control: Control<FsecUpdate>;
    errors: FieldErrors<FsecUpdate>;
    watch: UseFormWatch<FsecUpdate>;
    setValue: UseFormSetValue<FsecUpdate>;
}

export function FsecAssemblage({ control, errors, watch, setValue }: FsecAssemblageProps) {
    const startDate = watch('assemblyStep.startDate');
    const endDate = watch('assemblyStep.endDate');

    const handleStartAssembly = () => {
        setValue('assemblyStep.startDate', new Date(), { shouldDirty: true });
    };

    const handleEndAssembly = () => {
        setValue('assemblyStep.endDate', new Date(), { shouldDirty: true });
    };

    return (
        <Grid container spacing={4}>
            {/* Colonne 1: Équipe + Dates */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Équipe
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Assembleur */}
                    <Controller
                        name="assemblyStep.assemblerName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Assembleur"
                                fullWidth
                                size="small"
                            />
                        )}
                    />

                    {/* Bouton Commencer assemblage */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartAssembly}
                        disabled={!!startDate}
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                        Commencer assemblage
                    </Button>

                    {/* Date début (disabled) */}
                    <Controller
                        name="assemblyStep.startDate"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <DatePicker
                                {...field}
                                label="Date début"
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(date?.toDate() || null)}
                                disabled
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        error: Boolean(errors.assemblyStep?.startDate),
                                        helperText: errors.assemblyStep?.startDate?.message,
                                    }
                                }}
                            />
                        )}
                    />
                </Stack>
            </Grid>

            {/* Colonne 2: Banc */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Banc
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Banc d'assemblage */}
                    <Controller
                        name="assemblyStep.assemblyBenchId"
                        control={control}
                        render={({ field }) => (
                            <Box>
                                <ChipSelect
                                    {...field}
                                    label="Banc d'assemblage"
                                    options={FSEC_ASSEMBLY_BENCH_OPTIONS}
                                    required
                                    error={Boolean(errors.assemblyStep?.assemblyBenchId)}
                                    value={field.value ?? ''}
                                />
                                {errors.assemblyStep?.assemblyBenchId && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                        {errors.assemblyStep.assemblyBenchId.message}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    />
                </Stack>
            </Grid>

            {/* Colonne 3: Dates + Remarques */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Dates
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Remarques */}
                    <Controller
                        name="assemblyStep.comments"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Remarques"
                                multiline
                                rows={3}
                                fullWidth
                                size="small"
                            />
                        )}
                    />

                    {/* Bouton Assemblage terminé */}
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleEndAssembly}
                        disabled={!startDate || !!endDate}
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                        Assemblage terminé
                    </Button>

                    {/* Date fin (disabled) */}
                    <Controller
                        name="assemblyStep.endDate"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <DatePicker
                                {...field}
                                label="Date fin"
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(date?.toDate() || null)}
                                disabled
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        error: Boolean(errors.assemblyStep?.endDate),
                                        helperText: errors.assemblyStep?.endDate?.message,
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
 * Validation function for Step 2
 */
export function isAssemblyStepCompleted(data: FsecUpdate): boolean {
    return (
        !!data.assemblyStep?.startDate &&
        !!data.assemblyStep?.endDate &&
        !!data.assemblyStep?.assemblyBenchId &&
        !!data.assemblyStep?.assemblerName
    );
}
