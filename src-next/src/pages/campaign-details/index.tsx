/**
 * Campaign Details Layout
 * @module pages/campaign-details
 * 
 * Source: Legacy src/scenes/campaignDetails/CampaignDetails.scene.tsx
 */


import { useParams, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Container, Alert, Typography } from '@mui/material';
import { useCampaign } from '@entities/campaign';
import { CampaignHeader } from '@features/campaign-header';
import { RoutedTabs, TabItem } from '@widgets/routed-tabs';
import { CampaignOverviewPage } from './overview';
import { CampaignDocumentsPage } from './documents';

const TABS: TabItem[] = [
    { path: 'overview', label: 'Vue d\'ensemble' },
    { path: 'documents', label: 'Documents' },
    { path: 'fsec', label: 'FSEC' },
];

export default function CampaignDetailsPage() {
    const { campaignUuid } = useParams<{ campaignUuid: string }>();
    const location = useLocation();

    // Alias to match other usages
    const uuid = campaignUuid;

    // Fetch campaign details
    const { data: campaign, isLoading, error } = useCampaign(uuid!);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !campaign) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    Erreur lors du chargement de la campagne: {error instanceof Error ? error.message : 'Campagne introuvable'}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ py: 3 }}>
            {/* Header */}
            <CampaignHeader campaign={campaign} />

            {/* Tabs */}
            <Box sx={{ mt: 3 }}>
                <RoutedTabs
                    tabs={TABS}
                    baseUrl={`/campagne-details/${uuid}`}
                />
            </Box>

            {/* Content */}
            <Box sx={{ mt: 3 }}>
                {location.pathname.includes('/overview') && <CampaignOverviewPage campaign={campaign} />}

                {location.pathname.includes('/documents') && (
                    <CampaignDocumentsPage campaign={campaign} />
                )}

                {location.pathname.includes('/fsec') && <Typography>Section FSEC en construction</Typography>}
            </Box>
        </Container>
    );
}
