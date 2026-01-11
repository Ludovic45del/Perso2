/**
 * Routed Tabs Widget
 * @module widgets/routed-tabs
 * 
 * Generic Tabs component that syncs with current URL location.
 */

import { Tabs, Tab, Paper } from '@mui/material';
import { Link, useLocation, matchPath } from 'react-router-dom';
import React from 'react';

export interface TabItem {
    label: string;
    path: string; // Relative path
    icon?: React.ReactElement;
}

interface RoutedTabsProps {
    tabs: TabItem[];
    baseUrl: string; // e.g. "/campagne-details/123"
}

export function RoutedTabs({ tabs, baseUrl }: RoutedTabsProps) {
    const location = useLocation();

    // Determine active tab based on current URL
    const currentTab = tabs.find(tab =>
        matchPath({ path: `${baseUrl}/${tab.path}/*` }, location.pathname)
    ) || tabs[0];

    const value = currentTab?.path || false;

    return (
        <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 1, borderColor: 'divider' }}>
            <Tabs
                value={value}
                variant="fullWidth"
                centered
                sx={{
                    px: 2,
                    '& .MuiTab-root': {
                        minHeight: 48,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        minWidth: 'auto', // Allow tabs to stretch
                    }
                }}
            >
                {tabs.map((tab) => (
                    <Tab
                        key={tab.path}
                        label={tab.label}
                        value={tab.path}
                        icon={tab.icon}
                        iconPosition="start"
                        component={Link}
                        to={tab.path} // Relative link
                        sx={{ minHeight: 48 }}
                    />
                ))}
            </Tabs>
        </Paper>
    );
}
