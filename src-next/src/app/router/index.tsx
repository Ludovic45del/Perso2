/**
 * App Router - Lazy-loaded routes
 * @module app/router
 * 
 * Based on Front_Implementation.md structure (excluding Stock)
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Lazy-loaded pages
const HomePage = lazy(() => import('@pages/home'));
const CampaignsPage = lazy(() => import('@pages/campaigns'));
const CampaignDetailsPage = lazy(() => import('@pages/campaign-details'));
const FsecsPage = lazy(() => import('@pages/fsecs'));
const FsecDetailsPage = lazy(() => import('@pages/fsec-details'));

// Loading fallback
function PageLoader() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
            }}
        >
            <CircularProgress />
        </Box>
    );
}

// Root layout
function RootLayout() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Outlet />
        </Suspense>
    );
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'campagnes',
                element: <CampaignsPage />,
            },
            {
                path: 'campagne-details/:campaignUuid/*',
                element: <CampaignDetailsPage />,
            },
            {
                path: 'fsecs',
                element: <FsecsPage />,
            },
            {
                path: 'fsec-details/:versionUuid',
                element: <FsecDetailsPage />,
            },
        ],
    },
]);
