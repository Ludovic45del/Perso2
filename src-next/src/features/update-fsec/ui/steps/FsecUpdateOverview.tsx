/**
 * FsecUpdateOverview - Step 1: Données générales
 * @module features/update-fsec/ui/steps
 *
 * Layout 3 colonnes selon rapport FSEC MODALE:
 * - Colonne 1: Campagne*, Nom*, Catégorie*, Remarques
 * - Colonne 2: MOE, REC, IEC
 * - Colonne 3: Documents DESIGN (6 types)
 */

import { Grid, Stack, TextField, Box, Typography, Autocomplete, Divider } from '@mui/material';
import dayjs from 'dayjs';
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form';
import { ChipSelect } from '@widgets/chip-select';
import { useCampaigns, CampaignWithRelations } from '@entities/campaign';
import { FSEC_CATEGORY_OPTIONS } from '@entities/fsec/lib';
import { FsecUpdate } from '@entities/fsec';

interface FsecUpdateOverviewProps {
    control: Control<FsecUpdate>;
    errors: FieldErrors<FsecUpdate>;
    watch: UseFormWatch<FsecUpdate>;
}

export function FsecUpdateOverview({ control, errors }: FsecUpdateOverviewProps) {
    const { data: campaigns = [] } = useCampaigns();

    return (
        <Grid container spacing={4}>
            {/* Colonne 1: Infos de base */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Informations générales
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Campagne (Autocomplete) */}
                    <Controller
                        name="designStep.campaignId"
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
                                        error={Boolean(errors.designStep?.campaignId)}
                                        helperText={errors.designStep?.campaignId?.message}
                                        size="small"
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option.uuid === value?.uuid}
                            />
                        )}
                    />

                    {/* Nom de la FSEC */}
                    <Controller
                        name="designStep.name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nom de la FSEC"
                                error={Boolean(errors.designStep?.name)}
                                helperText={errors.designStep?.name?.message}
                                fullWidth
                                required
                                size="small"
                            />
                        )}
                    />

                    {/* Catégorie (ChipSelect) - Disabled in update */}
                    <Controller
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                            <Box>
                                <ChipSelect
                                    {...field}
                                    label="Catégorie"
                                    options={FSEC_CATEGORY_OPTIONS}
                                    required
                                    disabled
                                    error={Boolean(errors.categoryId)}
                                    value={field.value ?? ''}
                                />
                            </Box>
                        )}
                    />

                    {/* Remarques */}
                    <Controller
                        name="designStep.comments"
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
                </Stack>
            </Grid>

            {/* Colonne 2: Équipe FSEC */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Équipe FSEC
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    <Controller
                        name="designStep.fsecTeam.0.name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="MOE"
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="designStep.fsecTeam.1.name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="REC"
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="designStep.fsecTeam.2.name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="IEC"
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                </Stack>
            </Grid>

            {/* Colonne 3: Documents DESIGN */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Documents DESIGN
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    <Controller
                        name="designStep.fsecDocuments.0.path"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Visrad initial"
                                placeholder="Chemin du fichier..."
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="designStep.fsecDocuments.1.path"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Vues"
                                placeholder="Chemin du fichier..."
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="designStep.fsecDocuments.2.path"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label=".STP Métro"
                                placeholder="Chemin du fichier..."
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="designStep.fsecDocuments.3.path"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Fiches Car"
                                placeholder="Chemin du fichier..."
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="designStep.fsecDocuments.4.path"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Fiche de réception"
                                placeholder="Chemin du fichier..."
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="designStep.fsecDocuments.5.path"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Gamme d'assemblage"
                                placeholder="Chemin du fichier..."
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}

/**
 * Validation function for Step 1
 */
export function isOverviewStepCompleted(data: FsecUpdate): boolean {
    return !!data.designStep?.name && !!data.designStep?.campaignId && !!data.categoryId;
}
