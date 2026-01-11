/**
 * TeamMemberSection - Reusable team member form section
 * @module features/campaign-form/ui
 * 
 * FSEC-Ready component for MOE/RCE/IEC fields.
 */

import { Grid, TextField, Typography, Divider, Box } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface TeamMemberSectionProps {
    control: Control<any>;
}

export function TeamMemberSection({ control }: TeamMemberSectionProps) {
    return (
        <Box sx={{ pt: 2 }}>
            <Divider sx={{ mb: 3 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                    Équipe projet
                </Typography>
            </Divider>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Controller
                        name="moe"
                        control={control}
                        render={({ field }) => <TextField {...field} label="MOE" fullWidth />}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Controller
                        name="rce"
                        control={control}
                        render={({ field }) => <TextField {...field} label="RCE" fullWidth />}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Controller
                        name="iec"
                        control={control}
                        render={({ field }) => <TextField {...field} label="IEC" fullWidth />}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
