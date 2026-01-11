/**
 * Campaigns List Page - Enhanced with Toolbar and Filtering
 * @module pages/campaigns
 * 
 * Source: Legacy src/scenes/campaigns/Campaigns.scene.tsx
 */

import { useMemo } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    SelectChangeEvent,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useCampaigns, CampaignWithRelations, CampaignType, CampaignStatus } from '@entities/campaign';
import { CreateCampaignModal } from '@features/create-campaign';
import { CampaignsToolbar, useFilterCampaignsStore } from '@features/filter-campaigns';
import { DataChip } from '@widgets/data-chip';
import { ChipSelect } from '@widgets/chip-select';
import { SearchInput } from '@shared/ui';

export default function CampaignsPage() {
    const navigate = useNavigate();
    const { data: campaigns, isLoading, error } = useCampaigns();
    const filters = useFilterCampaignsStore((state) => state.filters);
    const setFilter = useFilterCampaignsStore((state) => state.setFilter);

    // Compute available filter options
    const filterOptions = useMemo(() => {
        if (!campaigns) return { semesters: [], types: [], statuses: [], rawTypes: [] };
        const filtered = campaigns.filter(
            (c) => (c as CampaignWithRelations).installation?.label === filters.installation
        );
        const semesters = new Set<string>();
        const types = new Map<number, CampaignType>();
        const statuses = new Map<number, CampaignStatus>();

        filtered.forEach((campaign) => {
            const camp = campaign as CampaignWithRelations;
            if (campaign.semester) semesters.add(campaign.semester);
            if (camp.type) types.set(camp.type.id, camp.type);
            if (camp.status) statuses.set(camp.status.id, camp.status);
        });

        return {
            semesters: Array.from(semesters).sort().map(s => ({ value: s, label: s, color: '#64748B' })),
            types: Array.from(types.values()).map(t => ({ value: t.id.toString(), label: t.label, color: t.color || '#999' })),
            statuses: Array.from(statuses.values()).map(s => ({ value: s.label, label: s.label, color: s.color || '#999' })),
            rawTypes: Array.from(types.values()) // Need raw types for setFilter logic
        };
    }, [campaigns, filters.installation]);

    // Handle filter changes
    const handleSemesterChange = (event: SelectChangeEvent<unknown>) => {
        const value = event.target.value as string;
        setFilter('semester', value === '' ? null : value);
    };

    const handleTypeChange = (event: SelectChangeEvent<unknown>) => {
        const value = event.target.value as string;
        if (value === '') {
            setFilter('type', null);
        } else {
            const type = filterOptions.rawTypes.find(t => t.id === Number(value));
            setFilter('type', type ?? null);
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<unknown>) => {
        const value = event.target.value as string;
        setFilter('status', value === '' ? null : value);
    };

    // Apply filters - per legacy filterCampaigns logic
    const filteredCampaigns = useMemo(() => {
        if (!campaigns) return [];

        return campaigns.filter((campaign) => {
            // Installation filter (LMJ vs OMEGA)
            const campaignInstallation = (campaign as CampaignWithRelations).installation?.label;
            if (campaignInstallation && campaignInstallation !== filters.installation) {
                return false;
            }

            // Year filter
            if (filters.year !== null && campaign.year !== filters.year) {
                return false;
            }

            // Semester filter
            if (filters.semester !== null && campaign.semester !== filters.semester) {
                return false;
            }

            // Name search (includes format: YEAR-INSTALLATION_NAME)
            if (filters.name) {
                const fullName = `${campaign.year}-${campaignInstallation ?? ''}_${campaign.name}`.toLowerCase();
                if (!fullName.includes(filters.name.toLowerCase())) {
                    return false;
                }
            }

            // Type filter
            const campaignType = (campaign as CampaignWithRelations).type;
            if (filters.type !== null && campaignType?.id !== filters.type.id) {
                return false;
            }

            // Status filter
            const campaignStatus = (campaign as CampaignWithRelations).status;
            if (filters.status !== null && campaignStatus?.label !== filters.status) {
                return false;
            }

            return true;
        });
    }, [campaigns, filters]);

    // Format campaign name per legacy: YEAR-INSTALLATION_NAME
    const formatCampaignName = (campaign: CampaignWithRelations) => {
        const installation = campaign.installation?.label ?? '';
        return `${campaign.year}-${installation}_${campaign.name.toUpperCase()}`;
    };

    // Navigate to campaign details
    const handleNavigate = (campaign: CampaignWithRelations) => {
        navigate(`/campagne-details/${campaign.uuid}/overview`);
    };

    if (isLoading) {
        return (
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Alert severity="error">
                    Erreur lors du chargement des campagnes: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>
            {/* Title */}
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
                Campagnes
            </Typography>

            {/* Toolbar with filters */}
            <CampaignsToolbar campaigns={(campaigns as CampaignWithRelations[]) ?? []} />

            {/* Data Table */}
            <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                <Table sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.100', width: 120 }}>
                                <ChipSelect
                                    value={filters.semester ?? ''}
                                    onChange={handleSemesterChange}
                                    displayEmpty
                                    disableUnderline
                                    variant="standard"
                                    placeholder="Semestre"
                                    options={filterOptions.semesters}
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        '& .MuiSelect-select': {
                                            py: 0,
                                            minHeight: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                        },
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.100', width: '40%' }}>
                                <SearchInput
                                    value={filters.name}
                                    onChange={(value) => setFilter('name', value)}
                                    placeholder="Nom"
                                    width="100%"
                                    focusWidth="100%"
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.100', width: 200 }}>
                                <ChipSelect
                                    value={filters.type?.id?.toString() ?? ''}
                                    onChange={handleTypeChange}
                                    displayEmpty
                                    disableUnderline
                                    variant="standard"
                                    placeholder="Type"
                                    options={filterOptions.types}
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        '& .MuiSelect-select': {
                                            py: 0,
                                            minHeight: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                        },
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.100', width: 150 }}>
                                <ChipSelect
                                    value={filters.status ?? ''}
                                    onChange={handleStatusChange}
                                    displayEmpty
                                    disableUnderline
                                    variant="standard"
                                    placeholder="Statut"
                                    options={filterOptions.statuses}
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        '& .MuiSelect-select': {
                                            py: 0,
                                            minHeight: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                        },
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.100', width: 60 }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCampaigns.map((campaign) => {
                            const campWithRelations = campaign as CampaignWithRelations;
                            return (
                                <TableRow
                                    key={campaign.uuid}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onDoubleClick={() => handleNavigate(campWithRelations)}
                                >
                                    <TableCell>
                                        <DataChip
                                            label={campaign.semester}
                                            color="#64748B"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight={500}>
                                            {formatCampaignName(campWithRelations)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {campWithRelations.type && (
                                            <DataChip
                                                label={campWithRelations.type.label}
                                                color={campWithRelations.type.color}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {campWithRelations.status ? (
                                            <DataChip
                                                label={campWithRelations.status.label}
                                                color={campWithRelations.status.color}
                                            />
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Voir les détails">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleNavigate(campWithRelations)}
                                            >
                                                <ArrowForwardIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filteredCampaigns.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography color="text.secondary" sx={{ py: 4 }}>
                                        Aucune campagne trouvée
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Campaign Modal */}
            <CreateCampaignModal />
        </Container>
    );
}
