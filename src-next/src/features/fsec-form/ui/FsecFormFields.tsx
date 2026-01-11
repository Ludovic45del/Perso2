/**
 * FsecFormFields - Shared form fields for FSEC create/update
 * @module features/fsec-form/ui
 *
 * Pattern: Same as features/campaign-form/ui/CampaignFormFields.tsx
 * Layout selon rapport FSEC MODALE:
 * - Colonne 1: Campagne*, Nom*, Catégorie*, Remarques
 */

import { Stack, TextField, Box, Typography, Autocomplete, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ChipSelect, ChipSelectOption } from '@widgets/chip-select';
import { useCampaigns, CampaignWithRelations } from '@entities/campaign';

// ============================================================================
// MAIN FORM FIELDS - Colonne 1: Infos de base
// ============================================================================

interface FsecFormFieldsProps {
    control: Control<any>;
    errors: FieldErrors<any>;
    categoryOptions: ChipSelectOption[];
    statusOptions?: ChipSelectOption[];
    rackOptions?: ChipSelectOption[];
}

export function FsecFormFields({
    control,
    errors,
    categoryOptions,
}: FsecFormFieldsProps) {
    const { data: campaigns = [] } = useCampaigns();

    return (
        <Box>
            <Divider sx={{ mb: 3 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                    Informations générales
                </Typography>
            </Divider>
            <Stack spacing={2}>
                {/* Campagne (Autocomplete) */}
                <Controller
                    name="campaignId"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                        <Autocomplete
                            {...field}
                            options={campaigns}
                            getOptionLabel={(option: CampaignWithRelations) => option.name}
                            value={campaigns.find((c: CampaignWithRelations) => c.uuid === value) || null}
                            onChange={(_, newValue) => onChange(newValue?.uuid || null)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Campagne"
                                    required
                                    error={Boolean(errors.campaignId)}
                                    helperText={errors.campaignId?.message as string}
                                    size="small"
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.uuid === value?.uuid}
                        />
                    )}
                />

                {/* Nom de la FSEC */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Nom de la FSEC"
                            error={Boolean(errors.name)}
                            helperText={errors.name?.message as string}
                            fullWidth
                            required
                            size="small"
                        />
                    )}
                />

                {/* Catégorie (ChipSelect) */}
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                        <Box>
                            <ChipSelect
                                {...field}
                                label="Catégorie"
                                options={categoryOptions}
                                required
                                error={Boolean(errors.categoryId)}
                                value={field.value ?? ''}
                            />
                            {errors.categoryId && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                    {errors.categoryId.message as string}
                                </Typography>
                            )}
                        </Box>
                    )}
                />

                {/* Remarques */}
                <Controller
                    name="comments"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value ?? ''}
                            label="Remarques"
                            multiline
                            rows={5}
                            fullWidth
                            size="small"
                        />
                    )}
                />
            </Stack>
        </Box>
    );
}

// ============================================================================
// DATE FIELDS
// ============================================================================

interface FsecFormDatesProps {
    control: Control<any>;
    errors: FieldErrors<any>;
}

export function FsecFormDates({ control, errors }: FsecFormDatesProps) {
    return (
        <Stack spacing={3}>
            {/* Dates */}
            <Stack direction="row" spacing={2}>
                <Controller
                    name="deliveryDate"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                        <DatePicker
                            {...field}
                            label="Date de livraison"
                            value={value ? dayjs(value) : null}
                            onChange={(date) => onChange(date?.toDate() || null)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: Boolean(errors.deliveryDate),
                                    helperText: errors.deliveryDate?.message as string
                                }
                            }}
                        />
                    )}
                />
                <Controller
                    name="shootingDate"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                        <DatePicker
                            {...field}
                            label="Date de tir"
                            value={value ? dayjs(value) : null}
                            onChange={(date) => onChange(date?.toDate() || null)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: Boolean(errors.shootingDate),
                                    helperText: errors.shootingDate?.message as string
                                }
                            }}
                        />
                    )}
                />
            </Stack>

            {/* Technical fields */}
            <Stack direction="row" spacing={2}>
                <Controller
                    name="preshootingPressure"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value ?? ''}
                            label="Pression pré-tir (bar)"
                            type="number"
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="experienceSrxx"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value ?? ''}
                            label="Expérience SRXX"
                            fullWidth
                        />
                    )}
                />
            </Stack>

            {/* Localisation */}
            <Controller
                name="localisation"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        value={field.value ?? ''}
                        label="Localisation"
                        fullWidth
                    />
                )}
            />

            {/* Comments */}
            <Controller
                name="comments"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        value={field.value ?? ''}
                        label="Commentaires"
                        multiline
                        rows={3}
                        fullWidth
                    />
                )}
            />
        </Stack>
    );
}
