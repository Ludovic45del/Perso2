/**
 * Campaign Header Feature
 * @module features/campaign-header
 */

import { Box, Typography, Button, Paper, Stack, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { CampaignWithRelations } from '@entities/campaign';
import { DataChip } from '@widgets/data-chip';
import { WorkflowStepper } from './workflow-stepper';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import UpdateIcon from '@mui/icons-material/Update';
import { UpdateCampaignModal } from '../../update-campaign';

dayjs.locale('fr');

interface CampaignHeaderProps {
    campaign: CampaignWithRelations;
}

export function CampaignHeader({ campaign }: CampaignHeaderProps) {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const installationLabel = campaign.installation?.label ?? 'UNK';
    const formattedName = `${campaign.year}-${installationLabel}_${campaign.name.toUpperCase()}`;

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 3,
                borderRadius: 1,
                bgcolor: 'background.paper',
                borderColor: 'divider'
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                spacing={4}
            >
                <Box sx={{ minWidth: 250 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                            component={Link}
                            to="/campagnes"
                            sx={{
                                width: 40,
                                height: 40,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '50%',
                                bgcolor: 'background.paper',
                                color: 'text.secondary',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    transform: 'translateX(-2px)'
                                }
                            }}
                        >
                            <ArrowBackIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        <Stack spacing={1}>
                            <Typography variant="h5" fontWeight="bold">
                                {formattedName}
                            </Typography>
                            {campaign.lastUpdated && (
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
                                    <UpdateIcon sx={{ fontSize: '0.9rem' }} />
                                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                        Dernière modification : {dayjs(campaign.lastUpdated).format('D MMMM YYYY [à] HH:mm')}
                                    </Typography>
                                </Stack>
                            )}
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                                {campaign.status && (
                                    <DataChip
                                        label={campaign.status.label}
                                        color={campaign.status.color}
                                        sx={{ height: 28, fontSize: '0.8rem' }}
                                    />
                                )}
                                <DataChip
                                    label={campaign.semester}
                                    color="#64748B"
                                    sx={{ height: 28, fontSize: '0.8rem' }}
                                />
                                {campaign.type && (
                                    <DataChip
                                        label={campaign.type.label}
                                        color={campaign.type.color}
                                        sx={{ height: 28, fontSize: '0.8rem' }}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>

                {/* Workflow Stepper */}
                <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
                    <WorkflowStepper campaign={campaign} />
                </Box>

                {/* Actions */}
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => setIsUpdateModalOpen(true)}
                        sx={{ px: 3 }}
                    >
                        Modifier
                    </Button>
                </Box>
            </Stack>

            <UpdateCampaignModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                campaign={campaign}
            />
        </Paper >
    );
}
