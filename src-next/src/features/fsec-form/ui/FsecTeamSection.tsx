/**
 * FsecTeamSection - Team member form section for FSEC
 * @module features/fsec-form/ui
 *
 * Pattern: Same as features/campaign-form/ui/TeamMemberSection.tsx
 * Roles: MOE, REC, IEC (selon rapport FSEC MODALE)
 */

import { Grid, TextField, Typography, Divider, Box } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface FsecTeamSectionProps {
    control: Control<any>;
}

export function FsecTeamSection({ control }: FsecTeamSectionProps) {
    return (
        <Box>
            <Divider sx={{ mb: 3 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                    Équipe FSEC
                </Typography>
            </Divider>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        name="moe"
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
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="rec"
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
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="iec"
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
                </Grid>
            </Grid>
        </Box>
    );
}
