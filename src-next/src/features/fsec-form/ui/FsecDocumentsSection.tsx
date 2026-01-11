/**
 * FsecDocumentsSection - Documents form section for FSEC
 * @module features/fsec-form/ui
 *
 * Pattern: Same as TeamMemberSection
 * Documents DESIGN: Visrad initial, Vues, .STP Métro, Fiches Car, Fiche réception, Gamme assemblage
 * (selon rapport FSEC MODALE)
 */

import { Grid, TextField, Typography, Divider, Box } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface FsecDocumentsSectionProps {
    control: Control<any>;
}

export function FsecDocumentsSection({ control }: FsecDocumentsSectionProps) {
    return (
        <Box>
            <Divider sx={{ mb: 3 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                    Documents DESIGN
                </Typography>
            </Divider>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        name="docVisradInitial"
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
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="docVues"
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
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="docStpMetro"
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
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="docFichesCar"
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
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="docFicheReception"
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
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="docGammeAssemblage"
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
                </Grid>
            </Grid>
        </Box>
    );
}
