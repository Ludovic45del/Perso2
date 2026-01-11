/**
 * FsecPhotos - Step 5: Photos
 * @module features/update-fsec/ui/steps
 *
 * Layout 3 colonnes selon rapport FSEC MODALE:
 * - Colonne 1: Équipe, Réalisé le
 * - Colonne 2: Photos (dynamique)
 * - Colonne 3: Remarques
 */

import { Grid, Stack, TextField, Typography, Divider, IconButton, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { Control, Controller, FieldErrors, useFieldArray, UseFormWatch } from 'react-hook-form';
import { FsecUpdate } from '@entities/fsec';

interface FsecPhotosProps {
    control: Control<FsecUpdate>;
    errors: FieldErrors<FsecUpdate>;
    watch: UseFormWatch<FsecUpdate>;
}

export function FsecPhotos({ control, errors }: FsecPhotosProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'picturesStep.fsecDocuments',
    });

    const handleAddPhoto = () => {
        append({ path: '', subtypeId: 9 }); // 9 = Photos subtype
    };

    return (
        <Grid container spacing={4}>
            {/* Colonne 1: Équipe + Date */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Équipe + Date
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Équipe */}
                    <Controller
                        name="picturesStep.equipeName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Équipe"
                                fullWidth
                                size="small"
                            />
                        )}
                    />

                    {/* Réalisé le */}
                    <Controller
                        name="picturesStep.lastUpdated"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <DatePicker
                                {...field}
                                label="Réalisé le"
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(date?.toDate() || null)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        error: Boolean(errors.picturesStep?.lastUpdated),
                                        helperText: errors.picturesStep?.lastUpdated?.message,
                                    }
                                }}
                            />
                        )}
                    />
                </Stack>
            </Grid>

            {/* Colonne 2: Photos */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Photos
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {fields.map((field, index) => (
                        <Box key={field.id} sx={{ display: 'flex', gap: 1 }}>
                            <Controller
                                name={`picturesStep.fsecDocuments.${index}.path`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        label={`Photo ${index + 1}`}
                                        placeholder="Chemin du fichier..."
                                        fullWidth
                                        size="small"
                                    />
                                )}
                            />
                            <IconButton
                                color="error"
                                onClick={() => remove(index)}
                                size="small"
                                sx={{ alignSelf: 'center' }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    <IconButton
                        color="primary"
                        onClick={handleAddPhoto}
                        sx={{
                            border: '1px dashed',
                            borderColor: 'divider',
                            borderRadius: 1,
                            p: 1,
                        }}
                    >
                        <AddIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Ajouter une photo
                        </Typography>
                    </IconButton>
                </Stack>
            </Grid>

            {/* Colonne 3: Remarques */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Remarques
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    <Controller
                        name="picturesStep.comments"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Remarques"
                                multiline
                                rows={6}
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
 * Validation function for Step 5
 */
export function isPhotosStepCompleted(data: FsecUpdate): boolean {
    const allPathsAreSet = !data.picturesStep?.fsecDocuments?.some(doc => !doc.path);
    return (
        !!data.picturesStep?.lastUpdated &&
        !!data.picturesStep?.equipeName &&
        allPathsAreSet
    );
}
