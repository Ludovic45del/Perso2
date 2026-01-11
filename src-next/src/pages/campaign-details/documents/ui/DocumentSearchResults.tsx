/**
 * DocumentSearchResults - Search results view for document browser
 * @module pages/campaign-details/documents/ui
 */

import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { DataTable } from '@widgets/data-table';
import { CopyButton } from '@shared/ui';
import { getFileIcon, getFolderIcon, TYPE_COLORS } from '@widgets/folder-card';
import { CAMPAIGN_DOCUMENT_TYPES, CAMPAIGN_DOCUMENT_SUBTYPES } from '@entities/campaign/lib';

interface SearchResult {
    uuid: string;
    name: string;
    type: string;
    parentLabel?: string;
    path?: string;
}

interface SearchResults {
    types: Array<{ id: number; label: string }>;
    subtypes: Array<{ id: number; label: string; typeId: number }>;
    fileTypes: Array<{ id: number; label: string; subtypeId: number }>;
    files: SearchResult[];
}

interface DocumentSearchResultsProps {
    searchQuery: string;
    results: SearchResults | 'empty';
    baseCampaignPath: string;
    onResultClick: (type: string, id: any) => void;
}

export function DocumentSearchResults({
    searchQuery,
    results,
    baseCampaignPath,
    onResultClick,
}: DocumentSearchResultsProps) {
    if (results === 'empty') {
        return (
            <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Résultats de recherche pour "{searchQuery}"
                </Typography>
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 1 }}>
                    <Typography color="text.secondary">Aucun résultat trouvé.</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Résultats de recherche pour "{searchQuery}"
            </Typography>

            <Stack spacing={3}>
                {/* Types */}
                {results.types.length > 0 && (
                    <Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                            Dossiers principaux
                        </Typography>
                        <Grid container spacing={2}>
                            {results.types.map(type => {
                                const path = `${baseCampaignPath}\\${type.label}`;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={`res-type-${type.id}`}>
                                        <Paper
                                            variant="outlined"
                                            onClick={() => onResultClick('type', type.id)}
                                            sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'grey.50', borderColor: 'primary.main' } }}
                                        >
                                            <FolderIcon sx={{ color: TYPE_COLORS[type.id] }} />
                                            <Typography sx={{ fontWeight: 600, flex: 1 }}>{type.label}</Typography>
                                            <CopyButton path={path} />
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                )}

                {/* Subtypes */}
                {results.subtypes.length > 0 && (
                    <Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                            Sous-dossiers
                        </Typography>
                        <Grid container spacing={2}>
                            {results.subtypes.map(st => {
                                const type = CAMPAIGN_DOCUMENT_TYPES[st.typeId];
                                const path = `${baseCampaignPath}\\${type.label}\\${st.label}`;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={`res-st-${st.id}`}>
                                        <Paper
                                            variant="outlined"
                                            onClick={() => onResultClick('subtype', st.id)}
                                            sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'grey.50', borderColor: 'primary.main' } }}
                                        >
                                            <FolderIcon sx={{ color: TYPE_COLORS[st.typeId] }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ fontWeight: 600 }}>{st.label}</Typography>
                                                <Typography variant="caption" color="text.secondary">Dans {type?.label}</Typography>
                                            </Box>
                                            <CopyButton path={path} />
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                )}

                {/* File Types */}
                {results.fileTypes.length > 0 && (
                    <Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                            Catégories
                        </Typography>
                        <Grid container spacing={2}>
                            {results.fileTypes.map(ft => {
                                const st = CAMPAIGN_DOCUMENT_SUBTYPES[ft.subtypeId];
                                const t = CAMPAIGN_DOCUMENT_TYPES[st.typeId];
                                const path = `${baseCampaignPath}\\${t.label}\\${st.label}\\${ft.label}`;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={`res-ft-${ft.id}`}>
                                        <Paper
                                            variant="outlined"
                                            onClick={() => onResultClick('fileType', ft.id)}
                                            sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'grey.50', borderColor: 'primary.main' } }}
                                        >
                                            {getFolderIcon(ft.label, 24, '#999')}
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ fontWeight: 600 }}>{ft.label}</Typography>
                                                <Typography variant="caption" color="text.secondary">Dans {st?.label}</Typography>
                                            </Box>
                                            <CopyButton path={path} />
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                )}

                {/* Documents & Pseudo-files */}
                {results.files.length > 0 && (
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
                                                {row.path && <CopyButton path={row.path} />}
                                            </Stack>
                                        )
                                    }
                                ]}
                                data={results.files}
                                isLoading={false}
                                onRowClick={(row) => onResultClick(row.type, row.uuid)}
                            />
                        </Paper>
                    </Box>
                )}
            </Stack>
        </Box>
    );
}
