/**
 * Campaign Documents Page Component
 * Renders a File Browser interface with Folders and Documents
 */

import { useMemo } from 'react';
import { useCampaignDocuments } from '@entities/campaign-document';
import { CampaignWithRelations } from '@entities/campaign/model';
import { Column, DataTable } from '@widgets/data-table';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { CAMPAIGN_DOCUMENT_TYPES, CAMPAIGN_DOCUMENT_SUBTYPES, CAMPAIGN_FILE_TYPES } from '@entities/campaign/lib';
import { CopyButton } from '@shared/ui';
import { FolderCard, getFileIcon, getFolderIcon, TYPE_COLORS } from '@widgets/folder-card';
import { useDocumentBrowser, useDocumentSearch } from './hooks';
import { DocumentBrowserToolbar, DocumentSearchResults } from './ui';

interface CampaignDocumentsPageProps {
    campaign: CampaignWithRelations;
}

export function CampaignDocumentsPage({ campaign }: CampaignDocumentsPageProps) {
    const { data: documents, isLoading } = useCampaignDocuments(campaign.uuid);

    // Common path info
    const drive = "P:";
    const installation = campaign.installation?.label ?? "INCONNU";
    const year = campaign.year.toString();
    const name = campaign.name;
    const baseCampaignPath = [drive, installation, year, name].join('\\');

    // Navigation hook
    const browser = useDocumentBrowser({ documents });
    const { allSearchResults, isSearching } = useDocumentSearch({
        documents,
        searchQuery: browser.searchQuery,
        baseCampaignPath,
    });

    // Filtered types
    const filteredTypes = useMemo(() => {
        const types = Object.values(CAMPAIGN_DOCUMENT_TYPES);
        if (!browser.searchQuery) return types;
        return types.filter(t => t.label.toLowerCase().includes(browser.searchQuery.toLowerCase()));
    }, [browser.searchQuery]);

    // Current subtypes
    const currentSubtypes = useMemo(() => {
        if (browser.activeTypeId === null) return [];
        const subtypes = Object.values(CAMPAIGN_DOCUMENT_SUBTYPES).filter(st => st.typeId === browser.activeTypeId);
        if (!browser.searchQuery) return subtypes;
        return subtypes.filter(st => st.label.toLowerCase().includes(browser.searchQuery.toLowerCase()));
    }, [browser.activeTypeId, browser.searchQuery]);

    // Level 3 Items
    const level3Items = useMemo(() => {
        if (browser.activeSubtypeId === null || !documents) return [];

        const typeLabel = browser.activeType?.label ?? "";
        const subtypeLabel = browser.activeSubtype?.label ?? "";
        const folderBasePath = [baseCampaignPath, typeLabel, subtypeLabel].join('\\');

        const fileTypes = Object.values(CAMPAIGN_FILE_TYPES).filter(ft => ft.subtypeId === browser.activeSubtypeId);
        const pseudoFiles = fileTypes.filter(ft => ft.label.includes('.'));
        const realFolders = fileTypes.filter(ft => !ft.label.includes('.'));
        const allDocs = documents.filter(doc => doc.subtype?.id === browser.activeSubtypeId);

        const items = [
            ...realFolders.map(ft => ({
                id: `folder-${ft.id}`,
                realId: ft.id,
                type: 'folder',
                name: ft.label,
                subtype: browser.activeSubtype,
                fileType: ft,
                path: `${folderBasePath}\\${ft.label}`,
                date: null
            })),
            ...pseudoFiles.map(ft => ({
                id: `pseudo-${ft.id}`,
                realId: ft.id,
                type: 'file',
                name: ft.label,
                subtype: browser.activeSubtype,
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

        if (!browser.searchQuery) return items;
        return items.filter(item => item.name.toLowerCase().includes(browser.searchQuery.toLowerCase()));
    }, [browser.activeSubtypeId, documents, browser.activeSubtype, browser.activeType, browser.searchQuery, baseCampaignPath]);

    const columns: Column<any>[] = [
        {
            id: 'name',
            label: 'Documents',
            render: (row) => {
                const isFileLike = row.name.includes('.');
                return (
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', py: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            {row.type === 'folder' && !isFileLike ? (
                                <FolderIcon sx={{ color: browser.activeTypeId !== null ? TYPE_COLORS[browser.activeTypeId] : '#FFC107', fontSize: 28 }} />
                            ) : (
                                getFileIcon(row.name)
                            )}
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{row.name}</Typography>
                        </Stack>
                        {row.path && row.path !== '-' && <CopyButton path={row.path} />}
                    </Stack>
                );
            }
        }
    ];

    const level3Folders = level3Items.filter(item => item.type === 'folder');
    const level3Files = level3Items.filter(item => item.type === 'file');

    return (
        <Box>
            <DocumentBrowserToolbar
                isRoot={browser.isRoot}
                isSearching={isSearching}
                searchQuery={browser.searchQuery}
                setSearchQuery={browser.setSearchQuery}
                viewMode={browser.viewMode}
                setViewMode={browser.setViewMode}
                onBack={browser.handleBack}
                onReset={browser.handleReset}
                activeType={browser.activeType}
                activeSubtype={browser.activeSubtype}
                activeFileType={browser.activeFileType}
                onTypeClick={browser.handleTypeClick}
                onSubtypeClick={browser.handleSubtypeClick}
            />

            {/* Search Results */}
            {isSearching && allSearchResults && (
                <DocumentSearchResults
                    searchQuery={browser.searchQuery}
                    results={allSearchResults as 'empty' | { types: any[]; subtypes: any[]; fileTypes: any[]; files: any[] }}
                    baseCampaignPath={baseCampaignPath}
                    onResultClick={browser.handleSearchResultClick}
                />
            )}

            {/* LEVEL 1: Root (Types) */}
            {!isSearching && browser.isRoot && (
                browser.viewMode === 'grid' ? (
                    <Grid container spacing={3}>
                        {filteredTypes.map((type) => {
                            const color = TYPE_COLORS[type.id] || '#999';
                            const path = `${baseCampaignPath}\\${type.label}`;
                            return (
                                <Grid item xs={12} sm={6} md={4} key={type.id}>
                                    <Paper
                                        variant="outlined"
                                        onClick={() => browser.handleTypeClick(type.id)}
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
                                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                            <CopyButton path={path} />
                                        </Box>
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
                                <FolderCard
                                    key={type.id}
                                    name={type.label}
                                    color={color}
                                    path={path}
                                    onClick={() => browser.handleTypeClick(type.id)}
                                    viewMode="list"
                                />
                            );
                        })}
                    </Stack>
                )
            )}

            {/* LEVEL 2: Subtypes */}
            {!isSearching && browser.isTypeLevel && (
                <Box>
                    {browser.viewMode === 'grid' ? (
                        <Grid container spacing={3}>
                            {currentSubtypes.length > 0 ? (
                                currentSubtypes.map((subtype) => {
                                    const color = browser.activeTypeId !== null ? TYPE_COLORS[browser.activeTypeId] : '#999';
                                    const path = `${baseCampaignPath}\\${browser.activeType?.label}\\${subtype.label}`;
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={subtype.id}>
                                            <FolderCard
                                                name={subtype.label}
                                                color={color}
                                                path={path}
                                                onClick={() => browser.handleSubtypeClick(subtype.id)}
                                                viewMode="grid"
                                            />
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
                                    const color = browser.activeTypeId !== null ? TYPE_COLORS[browser.activeTypeId] : '#999';
                                    const path = `${baseCampaignPath}\\${browser.activeType?.label}\\${subtype.label}`;
                                    return (
                                        <FolderCard
                                            key={subtype.id}
                                            name={subtype.label}
                                            color={color}
                                            path={path}
                                            onClick={() => browser.handleSubtypeClick(subtype.id)}
                                            viewMode="list"
                                        />
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
            {!isSearching && browser.isSubtypeLevel && (
                <Box>
                    {level3Folders.length > 0 && (
                        <Box sx={{ mb: level3Files.length > 0 ? 4 : 0 }}>
                            {browser.viewMode === 'grid' ? (
                                <Grid container spacing={3}>
                                    {level3Folders.map((item) => {
                                        const color = browser.activeTypeId !== null ? TYPE_COLORS[browser.activeTypeId] : '#999';
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
                                                        '&:hover': { borderColor: color, bgcolor: 'background.paper' }
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {getFolderIcon(item.name, 28, color)}
                                                        </Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 500, flex: 1 }}>{item.name}</Typography>
                                                    </Box>
                                                    {item.path && <CopyButton path={item.path} sx={{ alignSelf: 'flex-end' }} />}
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <Stack spacing={3}>
                                    {level3Folders.map((item) => {
                                        const color = browser.activeTypeId !== null ? TYPE_COLORS[browser.activeTypeId] : '#999';
                                        return (
                                            <FolderCard
                                                key={item.id}
                                                name={item.name}
                                                color={color}
                                                path={item.path}
                                                viewMode="list"
                                                useFileIcon
                                            />
                                        );
                                    })}
                                </Stack>
                            )}
                        </Box>
                    )}

                    {level3Files.length > 0 && (
                        <Box>
                            {level3Folders.length > 0 && (
                                <Typography variant="overline" display="block" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                                    Fichiers à la racine
                                </Typography>
                            )}
                            <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden', borderColor: 'divider' }}>
                                <DataTable columns={columns} data={level3Files} isLoading={isLoading} emptyMessage="Aucun fichier disponible." />
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
