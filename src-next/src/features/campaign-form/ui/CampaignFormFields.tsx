/**
 * CampaignFormFields - Shared form fields for campaign create/update
 * @module features/campaign-form/ui
 * 
 * FSEC-Ready component for campaign form fields.
 */

import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ChipSelect, ChipSelectOption } from '@widgets/chip-select';

interface CampaignFormFieldsProps {
    control: Control<any>;
    errors: FieldErrors<any>;
    typeOptions: ChipSelectOption[];
    installationOptions: ChipSelectOption[];
}

export function CampaignFormFields({
    control,
    errors,
    typeOptions,
    installationOptions,
}: CampaignFormFieldsProps) {
    return (
        <>
            {/* Left Column */}
            <Stack spacing={3}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Nom"
                            error={Boolean(errors.name)}
                            helperText={errors.name?.message as string}
                            fullWidth
                            required
                        />
                    )}
                />
                <Stack direction="row" spacing={2}>
                    <Controller
                        name="year"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Année"
                                type="number"
                                error={Boolean(errors.year)}
                                helperText={errors.year?.message as string}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                fullWidth
                                required
                            />
                        )}
                    />
                    <Controller
                        name="semester"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth required>
                                <InputLabel>Semestre</InputLabel>
                                <Select {...field} label="Semestre">
                                    <MenuItem value="S1">S1</MenuItem>
                                    <MenuItem value="S2">S2</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />
                </Stack>
                <Controller
                    name="typeId"
                    control={control}
                    render={({ field }) => (
                        <Box>
                            <ChipSelect
                                {...field}
                                label="Type"
                                options={typeOptions}
                                required
                                error={Boolean(errors.typeId)}
                                value={field.value ?? ''}
                            />
                            {errors.typeId && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                    {errors.typeId.message as string}
                                </Typography>
                            )}
                        </Box>
                    )}
                />
                <Controller
                    name="installationId"
                    control={control}
                    render={({ field }) => (
                        <Box>
                            <ChipSelect
                                {...field}
                                label="Installation"
                                options={installationOptions}
                                required
                                error={Boolean(errors.installationId)}
                                value={field.value ?? ''}
                            />
                            {errors.installationId && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                    {errors.installationId.message as string}
                                </Typography>
                            )}
                        </Box>
                    )}
                />
            </Stack>
        </>
    );
}

interface CampaignFormDatesProps {
    control: Control<any>;
    errors: FieldErrors<any>;
}

export function CampaignFormDates({ control, errors }: CampaignFormDatesProps) {
    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                        <DatePicker
                            {...field}
                            label="Date de début"
                            value={value ? dayjs(value) : null}
                            onChange={(date) => onChange(date?.toDate() || null)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: Boolean(errors.startDate),
                                    helperText: errors.startDate?.message as string
                                }
                            }}
                        />
                    )}
                />
                <Controller
                    name="endDate"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                        <DatePicker
                            {...field}
                            label="Date de fin"
                            value={value ? dayjs(value) : null}
                            onChange={(date) => onChange(date?.toDate() || null)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: Boolean(errors.endDate),
                                    helperText: errors.endDate?.message as string
                                }
                            }}
                        />
                    )}
                />
            </Stack>
            <Controller
                name="dtriNumber"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        value={field.value ?? ''}
                        label="N° DTRI"
                        type="number"
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        fullWidth
                    />
                )}
            />
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        value={field.value ?? ''}
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                    />
                )}
            />
        </Stack>
    );
}
