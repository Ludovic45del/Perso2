/**
 * DocumentBrowserToolbar - Navigation bar for document browser
 * @module pages/campaign-details/documents/ui
 */

import { Paper, Stack, Button, Breadcrumbs, Link, IconButton, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { SearchInput } from '@shared/ui';

interface DocumentBrowserToolbarProps {
    isRoot: boolean;
    isSearching: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    onBack: () => void;
    onReset: () => void;
    activeType?: { id: number; label: string } | null;
    activeSubtype?: { id: number; label: string } | null;
    activeFileType?: { id: number; label: string } | null;
    onTypeClick: (id: number) => void;
    onSubtypeClick: (id: number) => void;
}

export function DocumentBrowserToolbar({
    isRoot,
    isSearching,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    onBack,
    onReset,
    activeType,
    activeSubtype,
    activeFileType,
    onTypeClick,
    onSubtypeClick,
}: DocumentBrowserToolbarProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                mt: 0,
                mb: 3,
                p: 1.5,
                px: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 64,
                boxSizing: 'border-box'
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                {!isRoot && (
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={isSearching ? () => setSearchQuery('') : onBack}
                        variant="contained"
                        size="small"
                        sx={{
                            borderRadius: 1,
                            px: 2,
                            height: 40,
                            textTransform: 'none',
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': { boxShadow: 'none' }
                        }}
                    >
                        {isSearching ? 'Annuler la recherche' : 'Retour'}
                    </Button>
                )}

                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Rechercher..."
                    autoFocus
                />

                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <IconButton size="small" onClick={onReset} sx={{ p: 0.5, mr: 0.5 }}>
                        <HomeIcon fontSize="small" />
                    </IconButton>
                    {activeType && (
                        activeSubtype ? (
                            <Link
                                underline="hover"
                                color="inherit"
                                onClick={() => onTypeClick(activeType.id)}
                                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                {activeType.label}
                            </Link>
                        ) : (
                            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                                {activeType.label}
                            </Typography>
                        )
                    )}
                    {activeSubtype && (
                        activeFileType ? (
                            <Link
                                underline="hover"
                                color="inherit"
                                onClick={() => onSubtypeClick(activeSubtype.id)}
                                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                {activeSubtype.label}
                            </Link>
                        ) : (
                            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                                {activeSubtype.label}
                            </Typography>
                        )
                    )}
                    {activeFileType && (
                        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                            {activeFileType.label}
                        </Typography>
                    )}
                </Breadcrumbs>
            </Stack>

            <Button
                variant="contained"
                size="small"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                disabled={isSearching}
                sx={{
                    minWidth: 'auto',
                    p: 1,
                    borderRadius: 1,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' }
                }}
            >
                {viewMode === 'grid' ? <ViewListIcon fontSize="small" /> : <GridViewIcon fontSize="small" />}
            </Button>
        </Paper>
    );
}
