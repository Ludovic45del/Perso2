/**
 * FsecResultats - Step 6: Résultats (Livraison & Tir)
 * @module features/update-fsec/ui/steps
 *
 * Layout selon rapport FSEC MODALE + Old Front "Alignement/Livraison/Résultat":
 * - Colonne 1: Livraison (Date)
 * - Colonne 2: Tir (Date, Expérience, Pression)
 * - Colonne 3: Documents (Documents Tir)
 */

import { Grid, Stack, TextField, Typography, Divider, IconButton, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { Control, Controller, FieldErrors, useFieldArray, UseFormWatch } from 'react-hook-form';
import { FsecUpdate } from '@entities/fsec';

interface FsecResultatsProps {
    control: Control<FsecUpdate>;
    errors: FieldErrors<FsecUpdate>;
    watch: UseFormWatch<FsecUpdate>;
}

export function FsecResultats({ control, errors }: FsecResultatsProps) {
    // Gestion dynamique des documents de tir (si nécessaire, voir InstalledStep)
    // Pour l'instant on suppose une liste simple ou on suit le pattern Photos
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'installedStep.fsecDocuments',
    });

    const handleAddDoc = () => {
        append({ path: '', subtypeId: 10 }); // 10 = Installed Doc subtype (à vérifier/définir)
    };

    return (
        <Grid container spacing={4}>
            {/* Colonne 1: Livraison */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Livraison
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Date Livraison */}
                    <Controller
                        name="usableStep.deliveryDate"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <DatePicker
                                {...field}
                                label="Date de Livraison"
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(date?.toDate() || null)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        error: Boolean(errors.usableStep?.deliveryDate),
                                        helperText: errors.usableStep?.deliveryDate?.message,
                                    }
                                }}
                            />
                        )}
                    />
                </Stack>
            </Grid>

            {/* Colonne 2: Tir */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Tir (Résultats)
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {/* Date Tir */}
                    <Controller
                        name="installedStep.shootingDate"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <DatePicker
                                {...field}
                                label="Date de Tir"
                                value={value ? dayjs(value) : null}
                                onChange={(date) => onChange(date?.toDate() || null)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        error: Boolean(errors.installedStep?.shootingDate),
                                        helperText: errors.installedStep?.shootingDate?.message,
                                    }
                                }}
                            />
                        )}
                    />

                    {/* Expérience SRxx */}
                    <Controller
                        name="installedStep.experienceSrxx"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                label="Expérience SRxx"
                                fullWidth
                                size="small"
                            />
                        )}
                    />

                    {/* Pression Tir (Optionnel mais présent en backend) */}
                    <Controller
                        name="installedStep.preshootingPressure"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <TextField
                                {...field}
                                value={value ?? ''}
                                onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                label="Pression Tir (bars)"
                                type="number"
                                fullWidth
                                size="small"
                            />
                        )}
                    />
                </Stack>
            </Grid>

            {/* Colonne 3: Documents Tir */}
            <Grid item xs={12} md={4}>
                <Divider sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={700}>
                        Documents Tir
                    </Typography>
                </Divider>
                <Stack spacing={2}>
                    {fields && fields.map((field, index) => (
                        <Box key={field.id} sx={{ display: 'flex', gap: 1 }}>
                            <Controller
                                name={`installedStep.fsecDocuments.${index}.path`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        label={`Document ${index + 1}`}
                                        placeholder="Chemin..."
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
                        onClick={handleAddDoc}
                        sx={{
                            border: '1px dashed',
                            borderColor: 'divider',
                            borderRadius: 1,
                            p: 1,
                        }}
                    >
                        <AddIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Ajouter un document
                        </Typography>
                    </IconButton>
                </Stack>
            </Grid>
        </Grid>
    );
}

export function isResultatsStepCompleted(_data: FsecUpdate): boolean {
    // Pas de validation bloquante pour l'instant
    return true;
}
