/**
 * FsecScellement - Step 4: Scellement
 * @module features/update-fsec/ui/steps
 *
 * Layout simple selon rapport FSEC MODALE:
 * - Conteneur/Rack
 * - Interface IO
 * - Remarques
 */

import { Stack, TextField, Box, Typography, Divider } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ChipSelect } from '@widgets/chip-select';
import { FSEC_RACK_OPTIONS } from '@entities/fsec/lib';
import { FsecUpdate } from '@entities/fsec';

interface FsecScellementProps {
    control: Control<FsecUpdate>;
    errors: FieldErrors<FsecUpdate>;
}

export function FsecScellement({ control, errors }: FsecScellementProps) {
    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Divider sx={{ mb: 3 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                    Scellement
                </Typography>
            </Divider>
            <Stack spacing={3}>
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

                {/* Interface IO */}
                <Controller
                    name="sealingStep.interfaceIO"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value ?? ''}
                            label="Interface IO"
                            fullWidth
                            required
                            error={Boolean(errors.sealingStep?.interfaceIO)}
                            helperText={errors.sealingStep?.interfaceIO?.message}
                        />
                    )}
                />

                {/* Remarques */}
                <Controller
                    name="sealingStep.comments"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value ?? ''}
                            label="Remarques"
                            multiline
                            rows={4}
                            fullWidth
                        />
                    )}
                />
            </Stack>
        </Box>
    );
}

/**
 * Validation function for Step 4
 */
export function isSealingStepCompleted(data: FsecUpdate): boolean {
    return !!data.rackId && !!data.sealingStep?.interfaceIO;
}
