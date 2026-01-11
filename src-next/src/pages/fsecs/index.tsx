/**
 * FSECs List Page
 * @module pages/fsecs
 * 
 * Pattern: Same as pages/campaigns - uses DataTable, DataChip, SearchInput
 * Matches old frontend: CampaignDetailsTabFSEC with Autocomplete filters
 */

import {
    Typography,
    Container,
    Paper,
    Alert,
    Button,
    Stack,
    Autocomplete,
    TextField,
    IconButton,
    Tooltip,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFsecs, Fsec } from '@entities/fsec';
import { getFsecStatus, getFsecCategory, getFsecRack } from '@entities/fsec/lib';
import { useCampaigns } from '@entities/campaign';
import { DataTable, DataTableColumn } from '@widgets/data-table';
import { DataChip } from '@widgets/data-chip';
import { SearchInput } from '@shared/ui';
import { useState, useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { CreateFsecModal } from '@features/create-fsec';

export default function FsecsPage() {
    const navigate = useNavigate();
    const { data: fsecs, isLoading, error } = useFsecs();
    const { data: campaigns, isLoading: isLoadingCampaigns } = useCampaigns();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');

    // Create campaign lookup map for efficient access
    const campaignMap = useMemo(() => {
        if (!campaigns) return new Map();
        return new Map(campaigns.map(c => [c.uuid, c]));
    }, [campaigns]);

    // Helper function to get team member by role
    const getTeamMemberByRole = (fsec: Fsec, roleId: number): string => {
        if (!fsec.fsecTeam || !Array.isArray(fsec.fsecTeam)) return '-';
        const member = fsec.fsecTeam.find((m: any) => m.role_id === roleId);
        return member?.name || '-';
    };

    // Precompute unique options from data
    const filterOptions = useMemo(() => {
        if (!fsecs) return { statuses: [], categories: [] };

        const statusSet = new Set<string>();
        const categorySet = new Set<string>();

        fsecs.forEach((fsec) => {
            const status = getFsecStatus(fsec.statusId);
            const category = getFsecCategory(fsec.categoryId);
            if (status) statusSet.add(status.label);
            if (category) categorySet.add(category.label);
        });

        return {
            statuses: Array.from(statusSet),
            categories: Array.from(categorySet),
        };
    }, [fsecs]);

    // Filter FSECs by search query and filters
    const filteredFsecs = useMemo(() => {
        if (!fsecs) return [];

        return fsecs.filter((fsec) => {
            // Text search
            const query = searchQuery.toLowerCase();
            const matchesSearch = !query ||
                fsec.name.toLowerCase().includes(query) ||
                fsec.localisation?.toLowerCase().includes(query);

            // Status filter
            const status = getFsecStatus(fsec.statusId);
            const matchesStatus = !statusFilter || status?.label === statusFilter;

            // Category filter
            const category = getFsecCategory(fsec.categoryId);
            const matchesCategory = !categoryFilter || category?.label === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [fsecs, searchQuery, statusFilter, categoryFilter]);

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter(null);
        setCategoryFilter(null);
    };

    // Base columns (always shown)
    const baseColumns: DataTableColumn<Fsec>[] = [
        {
            id: 'name',
            label: 'Nom',
            minWidth: 150,
            render: (fsec) => (
                <Typography fontWeight={600}>{fsec.name}</Typography>
            ),
        },
        {
            id: 'campaign',
            label: 'Campagne associée',
            minWidth: 200,
            render: (fsec) => {
                if (!fsec.campaignId) return '-';
                const campaign = campaignMap.get(fsec.campaignId);
                return campaign ? campaign.name : '-';
            },
        },
        {
            id: 'year',
            label: 'Année',
            minWidth: 80,
            render: (fsec) => {
                if (!fsec.campaignId) return '-';
                const campaign = campaignMap.get(fsec.campaignId);
                return campaign ? campaign.year.toString() : '-';
            },
        },
        {
            id: 'status',
            label: 'Statut',
            minWidth: 120,
            render: (fsec) => {
                const status = getFsecStatus(fsec.statusId);
                return status ? (
                    <DataChip label={status.label} color={status.color} />
                ) : (
                    '-'
                );
            },
        },
        {
            id: 'category',
            label: 'Catégorie',
            minWidth: 100,
            render: (fsec) => {
                const category = getFsecCategory(fsec.categoryId);
                return category ? (
                    <DataChip label={category.label} color={category.color} />
                ) : (
                    '-'
                );
            },
        },
    ];

    // Additional columns for detailed view
    const detailedColumns: DataTableColumn<Fsec>[] = [
        {
            id: 'embase',
            label: 'Embase/Interface',
            minWidth: 120,
            render: (fsec) => fsec.embase ?? '-',
        },
        {
            id: 'rack',
            label: 'Rack',
            minWidth: 100,
            render: (fsec) => {
                const rack = getFsecRack(fsec.rackId);
                return rack ? rack.label : '-';
            },
        },
        {
            id: 'local',
            label: 'Local',
            minWidth: 100,
            render: (fsec) => fsec.localisation ?? '-',
        },
        {
            id: 'iec',
            label: 'IEC',
            minWidth: 100,
            render: (fsec) => getTeamMemberByRole(fsec, 2), // IEC = role_id 2
        },
        {
            id: 'tci',
            label: 'TCI',
            minWidth: 100,
            render: (fsec) => getTeamMemberByRole(fsec, 6), // TCI = role_id 6
        },
    ];

    // Date columns (shown in both views)
    const dateColumns: DataTableColumn<Fsec>[] = [
        {
            id: 'deliveryDate',
            label: 'Livraison',
            minWidth: 110,
            render: (fsec) =>
                fsec.deliveryDate?.toLocaleDateString('fr-FR') ?? '-',
        },
        {
            id: 'shootingDate',
            label: 'Tir',
            minWidth: 110,
            render: (fsec) =>
                fsec.shootingDate?.toLocaleDateString('fr-FR') ?? '-',
        },
    ];

    // Restitution only in detailed view
    const restitutionColumn: DataTableColumn<Fsec>[] = [
        {
            id: 'restitution',
            label: 'Restitution',
            minWidth: 110,
            render: (fsec) =>
                fsec.restitutionDate?.toLocaleDateString('fr-FR') ?? '-',
        },
    ];

    // Actions column (always last)
    const actionsColumn: DataTableColumn<Fsec>[] = [
        {
            id: 'actions',
            label: '',
            minWidth: 50,
            align: 'right',
            render: (fsec) => (
                <Tooltip title="Voir détails">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/fsec-details/${fsec.versionUuid}`);
                        }}
                    >
                        <ArrowForwardIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    // Combine columns based on view mode
    const columns: DataTableColumn<Fsec>[] = useMemo(() => {
        if (viewMode === 'simple') {
            return [...baseColumns, ...dateColumns, ...actionsColumn];
        }
        return [...baseColumns, ...detailedColumns, ...dateColumns, ...restitutionColumn, ...actionsColumn];
    }, [viewMode, campaignMap]);

    if (error) {
        return (
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Alert severity="error">
                    Erreur lors du chargement des FSEC: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>
            {/* Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4" fontWeight={600}>
                    Liste des FSEC
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreateModalOpen(true)}
                    sx={{ fontWeight: 600, textTransform: 'none' }}
                >
                    Ajouter
                </Button>
            </Stack>

            {/* Toolbar - matching old frontend pattern */}
            <Paper
                variant="outlined"
                sx={{
                    p: 1.5,
                    px: 2,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Rechercher un FSEC..."
                />

                <Autocomplete
                    options={filterOptions.statuses}
                    value={statusFilter}
                    onChange={(_, value) => setStatusFilter(value)}
                    renderInput={(params) => (
                        <TextField {...params} label="Statut" size="small" />
                    )}
                    sx={{ minWidth: 180 }}
                    size="small"
                />

                <Autocomplete
                    options={filterOptions.categories}
                    value={categoryFilter}
                    onChange={(_, value) => setCategoryFilter(value)}
                    renderInput={(params) => (
                        <TextField {...params} label="Catégorie" size="small" />
                    )}
                    sx={{ minWidth: 180 }}
                    size="small"
                />

                <Button
                    startIcon={<RestartAltIcon />}
                    onClick={resetFilters}
                    sx={{ textTransform: 'none' }}
                >
                    Réinitialiser
                </Button>

                {/* Spacer to push view toggle to the right */}
                <div style={{ flexGrow: 1 }} />

                {/* View mode toggle */}
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, newMode) => newMode && setViewMode(newMode)}
                    size="small"
                    sx={{ bgcolor: 'background.paper' }}
                >
                    <ToggleButton value="simple" sx={{ textTransform: 'none', px: 2 }}>
                        <ViewListIcon sx={{ mr: 1 }} fontSize="small" />
                        Simplifiée
                    </ToggleButton>
                    <ToggleButton value="detailed" sx={{ textTransform: 'none', px: 2 }}>
                        <ViewModuleIcon sx={{ mr: 1 }} fontSize="small" />
                        Détaillée
                    </ToggleButton>
                </ToggleButtonGroup>
            </Paper>

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredFsecs}
                isLoading={isLoading || isLoadingCampaigns}
                onRowClick={(fsec) => navigate(`/fsec-details/${fsec.versionUuid}`)}
                emptyMessage="Aucun FSEC trouvé."
            />

            {/* Create Modal */}
            <CreateFsecModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </Container>
    );
}
