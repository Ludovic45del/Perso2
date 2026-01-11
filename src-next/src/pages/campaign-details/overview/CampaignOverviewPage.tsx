/**
 * Campaign Overview Tab
 * @module pages/campaign-details/overview
 * 
 * Source: Legacy src/scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabOverview
 */

import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { DataChip } from '@widgets/data-chip';
import { CampaignWithRelations } from '@entities/campaign';
import { useCampaignTeam, getMemberNameByRole } from '@entities/campaign-team';
import GroupsIcon from '@mui/icons-material/Groups';
import BarChartIcon from '@mui/icons-material/BarChart';

interface CampaignOverviewPageProps {
    campaign: CampaignWithRelations;
}

export function CampaignOverviewPage({ campaign }: CampaignOverviewPageProps) {
    const { data: teamMembers } = useCampaignTeam(campaign.uuid);

    // Fonction locale getMemberNameByRole supprimée, utilisation de l'import


    return (
        <Box>
            <Grid container spacing={3}>
                {/* Left Column: General Info & Team */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        {/* General Info */}
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, bgcolor: 'background.paper', borderColor: 'divider' }}>
                            <Typography variant="h6" gutterBottom>
                                Informations Générales
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Nom</Typography>
                                    <Typography variant="body1">{campaign.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Année</Typography>
                                    <Typography variant="body1">{campaign.year}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Semestre</Typography>
                                    <DataChip label={campaign.semester} color="#64748B" />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                                    <DataChip label={campaign.type?.label ?? '-'} color={campaign.type?.color ?? '#999'} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Installation</Typography>
                                    <Typography variant="body1">{campaign.installation?.label ?? '-'}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                                    <Typography variant="body1">{campaign.description || '-'}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Team Section */}
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, bgcolor: 'background.paper', borderColor: 'divider' }}>
                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                <GroupsIcon color="primary" />
                                <Typography variant="h6">
                                    Équipe
                                </Typography>
                            </Stack>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2" color="text.secondary">MOE</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {getMemberNameByRole(teamMembers, 'MOE')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2" color="text.secondary">RCE</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {getMemberNameByRole(teamMembers, 'RCE')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle2" color="text.secondary">IEC</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {getMemberNameByRole(teamMembers, 'IEC')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Stack>
                </Grid>

                {/* Right Column: Stats & Dates */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        {/* Dates */}
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, bgcolor: 'background.paper', borderColor: 'divider' }}>
                            <Typography variant="h6" gutterBottom>
                                Dates Clés
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Début</Typography>
                                    <Typography variant="body1">
                                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('fr-FR') : '-'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Fin</Typography>
                                    <Typography variant="body1">
                                        {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('fr-FR') : '-'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Static Stats (Matching Legacy) */}
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, bgcolor: 'background.paper', borderColor: 'divider' }}>
                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                <BarChartIcon color="primary" />
                                <Typography variant="h6">
                                    Statistiques
                                </Typography>
                            </Stack>
                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2">Total</Typography>
                                    <Typography variant="body2" fontWeight="bold">11</Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2">Cibles tirées</Typography>
                                    <Typography variant="body2" fontWeight="bold">4</Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2">Cibles prêtes</Typography>
                                    <Typography variant="body2" fontWeight="bold">2</Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2">Cibles en fabrication</Typography>
                                    <Typography variant="body2" fontWeight="bold">3</Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2">Cibles HS</Typography>
                                    <Typography variant="body2" fontWeight="bold">2</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
