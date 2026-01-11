/**
 * Campaigns Toolbar UI
 * @module features/filter-campaigns/ui
 * 
 * Source: Legacy src/scenes/campaigns/CampaignsToolBar.tsx
 */

import {
    Stack,
    Autocomplete,
    TextField,
    Button,
    Box,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import { useFilterCampaignsStore } from '../model';
import { CampaignWithRelations } from '@entities/campaign';
import { CAMPAIGN_INSTALLATIONS } from '@entities/campaign/lib';
import { useMemo } from 'react';
import { useCreateCampaignStore } from '@features/create-campaign';
import { DataChip } from '@widgets/data-chip';

interface CampaignsToolbarProps {
    campaigns: CampaignWithRelations[];
}

export function CampaignsToolbar({ campaigns }: CampaignsToolbarProps) {
    const { filters, setFilter, resetFilters } = useFilterCampaignsStore();
    const openCreateModal = useCreateCampaignStore((state) => state.open);

    // Compute unique year options from campaigns
    const yearOptions = useMemo(() => {
        const filtered = campaigns.filter(
            (c) => c.installation?.label === filters.installation
        );

        const years = new Set<number>();
        filtered.forEach((campaign) => {
            years.add(campaign.year);
        });

        return Array.from(years).sort((a, b) => b - a);
    }, [campaigns, filters.installation]);

    return (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
        >
            {/* Installation Filter */}
            <Autocomplete
                options={['LMJ', 'OMEGA'] as const}
                value={filters.installation}
                onChange={(_, value) => setFilter('installation', value ?? 'LMJ')}
                renderInput={(params) => (
                    <TextField {...params} label="Installation" sx={{ minWidth: 100 }} />
                )}
                renderOption={(props, option) => {
                    const installation = Object.values(CAMPAIGN_INSTALLATIONS).find(i => i.label === option);
                    return (
                        <li {...props} key={option}>
                            <DataChip label={option} color={installation?.color ?? '#666'} />
                        </li>
                    );
                }}
                sx={{ width: 140 }}
                disableClearable
            />

            {/* Year Filter */}
            <Autocomplete
                options={yearOptions}
                value={filters.year}
                onChange={(_, value) => setFilter('year', value)}
                getOptionLabel={(option) => option.toString()}
                renderInput={(params) => (
                    <TextField {...params} label="Année" sx={{ minWidth: 100 }} />
                )}
                sx={{ width: 150 }}
            />

            {/* Spacer to push buttons to the right */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Reset Button */}
            <Button startIcon={<RestartAltIcon />} onClick={resetFilters}>
                Réinitialiser
            </Button>

            {/* Add Button */}
            <Button startIcon={<AddIcon />} variant="contained" onClick={openCreateModal}>
                Ajouter
            </Button>
        </Stack>
    );
}
