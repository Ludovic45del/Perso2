/**
 * Campaign Documents Page Component
 * Renders a File Browser interface with Folders and Documents
 */

import { useState, useMemo } from 'react';
import { useCampaignDocuments } from '@entities/campaign-document';
import { CampaignWithRelations } from '@entities/campaign/model';
import { Column, DataTable } from '@widgets/data-table';
import { Box, Typography, Grid, Paper, Stack, Button, Breadcrumbs, Link, TextField, InputAdornment, IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FolderIcon from '@mui/icons-material/Folder';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { CAMPAIGN_DOCUMENT_TYPES, CAMPAIGN_DOCUMENT_SUBTYPES, CAMPAIGN_FILE_TYPES } from '@entities/campaign/lib';

interface CampaignDocumentsPageProps {
    campaign: CampaignWithRelations;
}

// Map UI colors to Document Types
const TYPE_COLORS: Record<number, string> = {
    0: '#64748B', // DOCUMENTAIRE
    1: '#3B82F6', // CAO
    2: '#10B981', // ASSEMBLAGE
    3: '#F59E0B', // METROLOGIE
    4: '#8B5CF6', // TRANSPORT
    5: '#EC4899', // FICHIERS_PALS
};

const getFileIcon = (name: string, size = 24) => {
    const lowerName = name.toLowerCase();
    if (lowerName.endsWith('.pdf')) return <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: size }} />;
    if (lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx')) return <TableChartIcon sx={{ color: '#2e7d32', fontSize: size }} />;
    if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) return <ArticleIcon sx={{ color: '#1976d2', fontSize: size }} />;
    return <InsertDriveFileIcon sx={{ color: '#757575', fontSize: size }} />;
};

const getFolderIcon = (name: string, size = 28, color = '#999') => {
    const lowerName = name.toLowerCase();
    const hasExtension = lowerName.includes('.');
    if (hasExtension) {
        return getFileIcon(name, size);
    }
    return <FolderIcon sx={{ color: color, fontSize: size }} />;
};

export function CampaignDocumentsPage({ campaign }: CampaignDocumentsPageProps) {
    const { data: documents, isLoading } = useCampaignDocuments(campaign.uuid);

    // Navigation State
    const [activeTypeId, setActiveTypeId] = useState<number | null>(null);
    const [activeSubtypeId, setActiveSubtypeId] = useState<number | null>(null);
    const [activeFileTypeId, setActiveFileTypeId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    // Common navigation info for paths
    const drive = "P:";
    const installation = campaign.installation?.label ?? "INCONNU";
    const year = campaign.year.toString();
    const name = campaign.name;
    const baseCampaignPath = [drive, installation, year, name].join('\\');

    // Derived Data
    const filteredTypes = useMemo(() => {
        const types = Object.values(CAMPAIGN_DOCUMENT_TYPES);
        if (!searchQuery) return types;
        return types.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);
    const activeType = activeTypeId !== null ? CAMPAIGN_DOCUMENT_TYPES[activeTypeId] : null;
    const activeSubtype = activeSubtypeId !== null ? CAMPAIGN_DOCUMENT_SUBTYPES[activeSubtypeId] : null;
    const activeFileType = activeFileTypeId !== null ? CAMPAIGN_FILE_TYPES[activeFileTypeId] : null;

    // Global Search Results
    const allSearchResults = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const query = searchQuery.toLowerCase();

        // 1. Types
        const types = Object.values(CAMPAIGN_DOCUMENT_TYPES).filter(t => t.label.toLowerCase().includes(query));

        // 2. Subtypes
        const subtypes = Object.values(CAMPAIGN_DOCUMENT_SUBTYPES).filter(st => st.label.toLowerCase().includes(query));

        // 3. File Types (Categories) - Split between pseudo-files and real categories
        const ftMatches = Object.values(CAMPAIGN_FILE_TYPES).filter(ft => ft.label.toLowerCase().includes(query));
        const pureFileTypes = ftMatches.filter(ft => !ft.label.includes('.'));
        const pseudoFiles = ftMatches.filter(ft => ft.label.includes('.'));

        // 4. Documents
        const docMatches = documents?.filter(doc => doc.name.toLowerCase().includes(query)) || [];

        // Combine all "files" (pseudo and real)
        const combinedFiles = [
            ...pseudoFiles.map(ft => {
                const st = CAMPAIGN_DOCUMENT_SUBTYPES[ft.subtypeId];
                const t = CAMPAIGN_DOCUMENT_TYPES[st.typeId];
                return {
                    uuid: String(ft.id),
                    name: ft.label,
                    type: 'fileType',
                    parentLabel: st.label,
                    path: [baseCampaignPath, t.label, st.label, ft.label].join('\\')
                };
            }),
            ...docMatches.map(doc => ({
                uuid: String(doc.uuid),
                name: doc.name,
                type: 'document',
                parentLabel: doc.fileType?.label || doc.subtype?.label,
                path: doc.path
            }))
        ];

        const totalCount = types.length + subtypes.length + pureFileTypes.length + combinedFiles.length;

        return totalCount > 0 ? {
            types,
            subtypes,
            fileTypes: pureFileTypes,
            files: combinedFiles
        } : 'empty';
    }, [searchQuery, documents, baseCampaignPath]);

    // Get subtypes for the current active type
    const currentSubtypes = useMemo(() => {
        if (activeTypeId === null) return [];
        const subtypes = Object.values(CAMPAIGN_DOCUMENT_SUBTYPES).filter(st => st.typeId === activeTypeId);
        if (!searchQuery) return subtypes;
        return subtypes.filter(st => st.label.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [activeTypeId, searchQuery]);

    // Level 3 Items (Mixed Folders and Files)
    // When a Subtype is selected, we show a list of "FileTypes" (folders) AND "Documents" (files)
    // that are directly in this subtype (file_type_id is null).
    const level3Items = useMemo(() => {
        if (activeSubtypeId === null || !documents) return [];

        // Construct base path for folders
        const typeLabel = activeType?.label ?? "";
        const subtypeLabel = activeSubtype?.label ?? "";

        const folderBasePath = [baseCampaignPath, typeLabel, subtypeLabel].join('\\');

        // 1. Folders (CampaignFileTypes) - Split between pseudo-files and real folders
        const fileTypes = Object.values(CAMPAIGN_FILE_TYPES).filter(ft => ft.subtypeId === activeSubtypeId);
        const pseudoFiles = fileTypes.filter(ft => ft.label.includes('.'));
        const realFolders = fileTypes.filter(ft => !ft.label.includes('.'));

        // 2. ALL Documents in this subtype (flattened)
        const allDocs = documents.filter(doc => doc.subtype?.id === activeSubtypeId);

        const items = [
            ...realFolders.map(ft => ({
                id: `folder-${ft.id}`,
                realId: ft.id,
                type: 'folder',
                name: ft.label,
                subtype: activeSubtype,
                fileType: ft,
                path: `${folderBasePath}\\${ft.label}`,
                date: null
            })),
            ...pseudoFiles.map(ft => ({
                id: `pseudo-${ft.id}`,
                realId: ft.id,
                type: 'file', // Treat as file for display
                name: ft.label,
                subtype: activeSubtype,
                fileType: ft,
                path: `${folderBasePath}\\${ft.label}`,
                date: null
            })),
            ...allDocs.map(doc => ({
                id: doc.uuid,
                realId: doc.uuid,
                type: 'file',
                name: doc.name,
                subtype: doc.subtype,
                fileType: doc.fileType,
                path: doc.path,
                date: doc.date
            }))
        ];

        if (!searchQuery) return items;
        return items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [activeSubtypeId, documents, activeSubtype, activeType, campaign, searchQuery, baseCampaignPath]);

    const columns: Column<any>[] = [
        {
            id: 'name',
            label: 'Documents',
            render: (row) => {
                const isFileLike = row.name.includes('.');
                return (
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ width: '100%', py: 1 }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            {row.type === 'folder' && !isFileLike ? (
                                <FolderIcon sx={{ color: activeTypeId !== null ? TYPE_COLORS[activeTypeId] : '#FFC107', fontSize: 28 }} />
                            ) : (
                                getFileIcon(row.name)
                            )}
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {row.name}
                            </Typography>
                        </Stack>

                        {row.path && row.path !== '-' && (
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(row.path);
                                }}
                                sx={{
                                    borderRadius: 1,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Stack>
                );
            }
        }
    ];

    // Navigation Handlers
    const handleTypeClick = (typeId: number) => {
        setActiveTypeId(typeId);
        setActiveSubtypeId(null);
        setActiveFileTypeId(null);
    };

    const handleSubtypeClick = (subtypeId: number) => {
        setActiveSubtypeId(subtypeId);
        setActiveFileTypeId(null);
    };

    const handleSearchResultClick = (type: string, id: any) => {
        setSearchQuery('');
        if (type === 'type') {
            setActiveTypeId(id);
            setActiveSubtypeId(null);
            setActiveFileTypeId(null);
        } else if (type === 'subtype') {
            const st = CAMPAIGN_DOCUMENT_SUBTYPES[id];
            setActiveTypeId(st.typeId);
            setActiveSubtypeId(id);
            setActiveFileTypeId(null);
        } else if (type === 'fileType') {
            const ft = CAMPAIGN_FILE_TYPES[id];
            const st = CAMPAIGN_DOCUMENT_SUBTYPES[ft.subtypeId];
            setActiveTypeId(st.typeId);
            setActiveSubtypeId(ft.subtypeId);
            setActiveFileTypeId(null); // Stop at Subtype
        } else if (type === 'document') {
            const doc = documents?.find(d => d.uuid === id);
            if (doc) {
                setActiveTypeId(doc.type?.id || null);
                setActiveSubtypeId(doc.subtype?.id || null);
                setActiveFileTypeId(null); // Stop at Subtype
            }
        }
    };

    const handleBack = () => {
        if (activeSubtypeId !== null) {
            // Go back to Type level
            setActiveSubtypeId(null);
            setActiveFileTypeId(null);
        } else if (activeTypeId !== null) {
            // Go back to Root level
            setActiveTypeId(null);
        }
    };

    // Render Logic
    const isRoot = activeTypeId === null;
    const isTypeLevel = activeTypeId !== null && activeSubtypeId === null;
    const isSubtypeLevel = activeSubtypeId !== null;
    const isSearching = allSearchResults !== null;

    // Filter level3 items by type
    const level3Folders = level3Items.filter(item => item.type === 'folder');
    const level3Files = level3Items.filter(item => item.type === 'file');

    return (
        <Box>

            {/* Back Button & Path Header */}
            {/* Back Button & Path Header */}
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
                    minHeight: 64, // Standardize height based on the box with back button
                    boxSizing: 'border-box'
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    {!isRoot && (
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={isSearching ? () => setSearchQuery('') : handleBack}
                            variant="contained"
                            size="small"
                            sx={{
                                borderRadius: 1,
                                px: 2,
                                height: 40, // Fixed height to match search bar
                                textTransform: 'none',
                                fontWeight: 500,
                                boxShadow: 'none',
                                '&:hover': { boxShadow: 'none' }
                            }}
                        >
                            {isSearching ? 'Annuler la recherche' : 'Retour'}
                        </Button>
                    )}

                    <TextField
                        size="small"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 1,
                                bgcolor: 'grey.50',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'divider',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                    borderWidth: 1
                                },
                                height: 40, // Standardized height
                                width: 200,
                                transition: 'all 0.2s',
                                '&:focus-within': {
                                    width: 300,
                                    bgcolor: 'background.paper'
                                }
                            }
                        }}
                    />

                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                        <IconButton
                            size="small"
                            onClick={() => {
                                setActiveTypeId(null);
                                setActiveSubtypeId(null);
                                setActiveFileTypeId(null);
                                setSearchQuery('');
                            }}
                            sx={{ p: 0.5, mr: 0.5 }}
                        >
                            <HomeIcon fontSize="small" />
                        </IconButton>
                        {activeType && (
                            activeSubtypeId !== null ? (
                                <Link
                                    underline="hover"
                                    color="inherit"
                                    onClick={() => handleTypeClick(activeType.id)}
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
                            activeFileTypeId !== null ? (
                                <Link
                                    underline="hover"
                                    color="inherit"
                                    onClick={() => handleSubtypeClick(activeSubtype.id)}
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
                    onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
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

            {/* Search Results View */}
            {isSearching && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Résultats de recherche pour "{searchQuery}"
                    </Typography>

                    {allSearchResults === 'empty' ? (
                        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 1 }}>
                            <Typography color="text.secondary">Aucun résultat trouvé.</Typography>
                        </Paper>
                    ) : (
                        <Stack spacing={3}>
                            {/* Types */}
                            {allSearchResults.types.length > 0 && (
                                <Box>
                                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                                        Dossiers principaux
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {allSearchResults.types.map(type => {
                                            const path = `${baseCampaignPath}\\${type.label}`;
                                            return (
                                                <Grid item xs={12} sm={6} md={4} key={`res-type-${type.id}`}>
                                                    <Paper
                                                        variant="outlined"
                                                        onClick={() => handleSearchResultClick('type', type.id)}
                                                        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'grey.50', borderColor: 'primary.main' } }}
                                                    >
                                                        <FolderIcon sx={{ color: TYPE_COLORS[type.id] }} />
                                                        <Typography sx={{ fontWeight: 600, flex: 1 }}>{type.label}</Typography>
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(path);
                                                            }}
                                                            sx={{
                                                                borderRadius: 1,
                                                                bgcolor: 'primary.main',
                                                                color: 'white',
                                                                '&:hover': { bgcolor: 'primary.dark' }
                                                            }}
                                                        >
                                                            <ContentCopyIcon fontSize="small" />
                                                        </IconButton>
                                                    </Paper>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            )}

                            {/* Subtypes */}
                            {allSearchResults.subtypes.length > 0 && (
                                <Box>
                                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                                        Sous-dossiers
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {allSearchResults.subtypes.map(st => {
                                            const type = CAMPAIGN_DOCUMENT_TYPES[st.typeId];
                                            const path = `${baseCampaignPath}\\${type.label}\\${st.label}`;
                                            return (
                                                <Grid item xs={12} sm={6} md={4} key={`res-st-${st.id}`}>
                                                    <Paper
                                                        variant="outlined"
                                                        onClick={() => handleSearchResultClick('subtype', st.id)}
                                                        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'grey.50', borderColor: 'primary.main' } }}
                                                    >
                                                        <FolderIcon sx={{ color: TYPE_COLORS[st.typeId] }} />
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography sx={{ fontWeight: 600 }}>{st.label}</Typography>
                                                            <Typography variant="caption" color="text.secondary">Dans {type?.label}</Typography>
                                                        </Box>
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(path);
                                                            }}
                                                            sx={{
                                                                borderRadius: 1,
                                                                bgcolor: 'primary.main',
                                                                color: 'white',
                                                                '&:hover': { bgcolor: 'primary.dark' }
                                                            }}
                                                        >
                                                            <ContentCopyIcon fontSize="small" />
                                                        </IconButton>
                                                    </Paper>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            )}

                            {/* File Types */}
                            {allSearchResults.fileTypes.length > 0 && (
                                <Box>
                                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                                        Catégories
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {allSearchResults.fileTypes.map(ft => {
                                            const st = CAMPAIGN_DOCUMENT_SUBTYPES[ft.subtypeId];
                                            const t = CAMPAIGN_DOCUMENT_TYPES[st.typeId];
                                            const path = `${baseCampaignPath}\\${t.label}\\${st.label}\\${ft.label}`;
                                            return (
                                                <Grid item xs={12} sm={6} md={4} key={`res-ft-${ft.id}`}>
                                                    <Paper
                                                        variant="outlined"
                                                        onClick={() => handleSearchResultClick('fileType', ft.id)}
                                                        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'grey.50', borderColor: 'primary.main' } }}
                                                    >
                                                        {getFolderIcon(ft.label, 24, '#999')}
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography sx={{ fontWeight: 600 }}>{ft.label}</Typography>
                                                            <Typography variant="caption" color="text.secondary">Dans {st?.label}</Typography>
                                                        </Box>
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(path);
                                                            }}
                                                            sx={{
                                                                borderRadius: 1,
                                                                bgcolor: 'primary.main',
                                                                color: 'white',
                                                                '&:hover': { bgcolor: 'primary.dark' }
                                                            }}
                                                        >
                                                            <ContentCopyIcon fontSize="small" />
                                                        </IconButton>
                                                    </Paper>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            )}

                            {/* Documents & Pseudo-files */}
                            {allSearchResults.files.length > 0 && (
                                <Box>
                                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                                        Fichiers
                                    </Typography>
                                    <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                                        <DataTable
                                            columns={[
                                                {
                                                    id: 'name',
                                                    label: 'Documents',
                                                    render: (row) => (
                                                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', py: 1 }}>
                                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                                {getFileIcon(row.name)}
                                                                <Box>
                                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                        {row.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Dans {row.parentLabel}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>

                                                            {row.path && (
                                                                <IconButton
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigator.clipboard.writeText(row.path);
                                                                    }}
                                                                    sx={{
                                                                        borderRadius: 1,
                                                                        bgcolor: 'primary.main',
                                                                        color: 'white',
                                                                        '&:hover': { bgcolor: 'primary.dark' }
                                                                    }}
                                                                >
                                                                    <ContentCopyIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </Stack>
                                                    )
                                                }
                                            ]}
                                            data={allSearchResults.files}
                                            isLoading={false}
                                            onRowClick={(row) => handleSearchResultClick(row.type, row.uuid)}
                                        />
                                    </Paper>
                                </Box>
                            )}
                        </Stack>
                    )}
                </Box>
            )}

            {/* LEVEL 1: Root (Types) */}
            {!isSearching && isRoot && (
                viewMode === 'grid' ? (
                    <Grid container spacing={3}>
                        {filteredTypes.map((type) => {
                            const color = TYPE_COLORS[type.id] || '#999';
                            const path = `${baseCampaignPath}\\${type.label}`;
                            return (
                                <Grid item xs={12} sm={6} md={4} key={type.id}>
                                    <Paper
                                        variant="outlined"
                                        onClick={() => handleTypeClick(type.id)}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            borderRadius: 1,
                                            transition: 'all 0.2s',
                                            borderColor: 'divider',
                                            position: 'relative',
                                            '&:hover': {
                                                borderColor: color,
                                                boxShadow: 2,
                                                transform: 'translateY(-4px)',
                                                bgcolor: 'background.paper'
                                            }
                                        }}
                                    >
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(path);
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                borderRadius: 1,
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                '&:hover': { bgcolor: 'primary.dark' }
                                            }}
                                        >
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                        <Box
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                borderRadius: '50%',
                                                bgcolor: `${color}15`,
                                                color: color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <FolderIcon sx={{ fontSize: 48 }} />
                                        </Box>
                                        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 600 }}>
                                            {type.label}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Stack spacing={3}>
                        {filteredTypes.map((type) => {
                            const color = TYPE_COLORS[type.id] || '#999';
                            const path = `${baseCampaignPath}\\${type.label}`;
                            return (
                                <Paper
                                    key={type.id}
                                    variant="outlined"
                                    onClick={() => handleTypeClick(type.id)}
                                    sx={{
                                        p: 2,
                                        px: 3,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        borderRadius: 1,
                                        transition: 'all 0.2s',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            borderColor: color,
                                            bgcolor: `${color}05`
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 1,
                                            bgcolor: `${color}15`,
                                            color: color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <FolderIcon sx={{ fontSize: 32 }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {type.label}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(path);
                                        }}
                                        sx={{
                                            borderRadius: 1,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'primary.dark' }
                                        }}
                                    >
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Paper>
                            );
                        })}
                    </Stack>
                )
            )}

            {/* LEVEL 2: Subtypes */}
            {!isSearching && isTypeLevel && (
                <Box>
                    {viewMode === 'grid' ? (
                        <Grid container spacing={3}>
                            {currentSubtypes.length > 0 ? (
                                currentSubtypes.map((subtype) => {
                                    const color = activeTypeId !== null ? TYPE_COLORS[activeTypeId] : '#999';
                                    const path = `${baseCampaignPath}\\${activeType?.label}\\${subtype.label}`;
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={subtype.id}>
                                            <Paper
                                                variant="outlined"
                                                onClick={() => handleSubtypeClick(subtype.id)}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 1,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    transition: 'all 0.2s',
                                                    borderColor: 'divider',
                                                    position: 'relative',
                                                    '&:hover': {
                                                        borderColor: color,
                                                        boxShadow: 1,
                                                        bgcolor: 'background.paper'
                                                    }
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 1,
                                                        bgcolor: `${color}15`,
                                                        color: color,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <FolderIcon sx={{ fontSize: 28 }} />
                                                </Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 500, flex: 1 }}>
                                                    {subtype.label}
                                                </Typography>
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(path);
                                                    }}
                                                    sx={{
                                                        borderRadius: 1,
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: 'primary.dark' }
                                                    }}
                                                >
                                                    <ContentCopyIcon fontSize="small" />
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                    );
                                })
                            ) : (
                                <Grid item xs={12}>
                                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                        Aucun sous-dossier disponible.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Stack spacing={3}>
                            {currentSubtypes.length > 0 ? (
                                currentSubtypes.map((subtype) => {
                                    const color = activeTypeId !== null ? TYPE_COLORS[activeTypeId] : '#999';
                                    const path = `${baseCampaignPath}\\${activeType?.label}\\${subtype.label}`;
                                    return (
                                        <Paper
                                            key={subtype.id}
                                            variant="outlined"
                                            onClick={() => handleSubtypeClick(subtype.id)}
                                            sx={{
                                                p: 1.5,
                                                px: 2,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                borderRadius: 1,
                                                transition: 'all 0.2s',
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    borderColor: color,
                                                    bgcolor: `${color}05`
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 1,
                                                    bgcolor: `${color}15`,
                                                    color: color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <FolderIcon sx={{ fontSize: 24 }} />
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 500, flex: 1 }}>
                                                {subtype.label}
                                            </Typography>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(path);
                                                }}
                                                sx={{
                                                    borderRadius: 1,
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'primary.dark' }
                                                }}
                                            >
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Paper>
                                    );
                                })
                            ) : (
                                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                    Aucun sous-dossier disponible.
                                </Typography>
                            )}
                        </Stack>
                    )}
                </Box>
            )}

            {/* LEVEL 3: File Types & Direct Files */}
            {!isSearching && isSubtypeLevel && (
                <Box>
                    {/* Folders as Cards (Grid or List) */}
                    {level3Folders.length > 0 && (
                        <Box sx={{ mb: level3Files.length > 0 ? 4 : 0 }}>
                            {viewMode === 'grid' ? (
                                <Grid container spacing={3}>
                                    {level3Folders.map((item) => {
                                        const color = activeTypeId !== null ? TYPE_COLORS[activeTypeId] : '#999';
                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 2,
                                                        transition: 'all 0.2s',
                                                        borderColor: 'divider',
                                                        '&:hover': {
                                                            borderColor: color,
                                                            bgcolor: 'background.paper'
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box
                                                            sx={{
                                                                p: 1.5,
                                                                borderRadius: 1,
                                                                bgcolor: `${color}15`,
                                                                color: color,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            {getFolderIcon(item.name, 28, color)}
                                                        </Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 500, flex: 1 }}>
                                                            {item.name}
                                                        </Typography>
                                                    </Box>

                                                    {item.path && (
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => navigator.clipboard.writeText(item.path)}
                                                            sx={{
                                                                borderRadius: 1,
                                                                bgcolor: 'primary.main',
                                                                color: 'white',
                                                                '&:hover': { bgcolor: 'primary.dark' },
                                                                alignSelf: 'flex-end'
                                                            }}
                                                        >
                                                            <ContentCopyIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <Stack spacing={3}>
                                    {level3Folders.map((item) => {
                                        const color = activeTypeId !== null ? TYPE_COLORS[activeTypeId] : '#999';
                                        return (
                                            <Paper
                                                key={item.id}
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5,
                                                    px: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    borderRadius: 1,
                                                    transition: 'all 0.2s',
                                                    borderColor: 'divider',
                                                    '&:hover': {
                                                        borderColor: color,
                                                        bgcolor: `${color}05`
                                                    }
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        p: 1,
                                                        borderRadius: 1,
                                                        bgcolor: `${color}15`,
                                                        color: color,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {getFolderIcon(item.name, 24, color)}
                                                </Box>
                                                <Typography variant="body1" sx={{ fontWeight: 500, flex: 1 }}>
                                                    {item.name}
                                                </Typography>

                                                {item.path && (
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => navigator.clipboard.writeText(item.path)}
                                                        sx={{
                                                            borderRadius: 1,
                                                            bgcolor: 'primary.main',
                                                            color: 'white',
                                                            '&:hover': { bgcolor: 'primary.dark' }
                                                        }}
                                                    >
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Box>
                    )}

                    {/* Direct Files in a Table */}
                    {level3Files.length > 0 && (
                        <Box>
                            {level3Folders.length > 0 && (
                                <Typography variant="overline" display="block" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                                    Fichiers à la racine
                                </Typography>
                            )}
                            <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden', borderColor: 'divider' }}>
                                <DataTable
                                    columns={columns}
                                    data={level3Files}
                                    isLoading={isLoading}
                                    emptyMessage="Aucun fichier disponible."
                                />
                            </Paper>
                        </Box>
                    )}

                    {level3Folders.length === 0 && level3Files.length === 0 && (
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                            Aucun élément disponible dans ce dossier.
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}
