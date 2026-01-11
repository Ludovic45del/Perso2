/**
 * FSEC Details Page with Steps Tabs
 * @module pages/fsec-details
 *
 * Aligned with Audit "Ancien Front - FSEC Sans Gaz"
 */

import {
    Box,
    Typography,
    Container,
    Paper,
    CircularProgress,
    Alert,
    Button,
    Stack,
    Grid,
    Tabs,
    Tab,
    Chip,
    Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFsec } from '@entities/fsec';
import {
    useAssemblyStepsByFsec,
    useMetrologyStepsByFsec,
    useSealingStepsByFsec,
    usePicturesStepsByFsec,
} from '@entities/steps';
import { UpdateFsecModal } from '@features/update-fsec';

// Helper for TabPanel
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

// Helper for Audit-style Fields (Title + Value)
const ReadOnlyField = ({ title, value, isEmpty = false }: { title: string, value?: string | React.ReactNode, isEmpty?: boolean }) => (
    <Box mb={2}>
        <Typography variant="h6" color="text.primary" gutterBottom>
            {title}
        </Typography>
        {isEmpty ? (
            <Typography color="text.disabled" fontStyle="italic">
                (Non renseigné)
            </Typography>
        ) : (
            <Typography variant="body1" color="text.secondary">
                {value ?? '-'}
            </Typography>
        )}
    </Box>
);

export default function FsecDetailsPage() {
    const navigate = useNavigate();
    const { versionUuid } = useParams<{ versionUuid: string }>();
    const [tabValue, setTabValue] = useState(0);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const { data: fsec, isLoading, error } = useFsec(versionUuid!);
    const { data: assemblySteps } = useAssemblyStepsByFsec(versionUuid!);
    const { data: metrologySteps } = useMetrologyStepsByFsec(versionUuid!);
    const { data: sealingSteps } = useSealingStepsByFsec(versionUuid!);
    const { data: picturesSteps } = usePicturesStepsByFsec(versionUuid!);

    if (isLoading) {
        return (
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !fsec) {
        return (
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Alert severity="error">Erreur lors du chargement du FSEC</Alert>
            </Container>
        );
    }

    // Determine tabs based on Audit for "Sans Gaz"
    const isSansGaz = fsec.categoryId === 1;
    const TABS = [
        "Vue générale",
        "Assemblage",
        "Métrologie",
        "Vue/Photo",
        ...(isSansGaz ? [] : ["Résultats"])
    ];

    // Assembly Step Helper
    const currentAssembly = assemblySteps?.[0]; // Assuming one active for display
    const currentMetrology = metrologySteps?.[0];
    const currentSealing = sealingSteps?.[0]; // For interface IO in Metrology tab?
    const currentPictures = picturesSteps?.[0];

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/fsecs')}
                >
                    Retour
                </Button>
                <Typography variant="h3">{fsec.name}</Typography>
                <Chip
                    label={isSansGaz ? 'Sans Gaz' : 'FSEC'}
                    color="primary"
                    variant="outlined"
                />
                <Chip
                    label={fsec.isActive ? 'Actif' : 'Inactif'}
                    color={fsec.isActive ? 'success' : 'default'}
                />
                <Button variant="contained" onClick={() => setIsUpdateModalOpen(true)}>
                    Modifier
                </Button>
            </Stack>

            {/* Steps Tabs */}
            <Paper>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                    variant="scrollable"
                >
                    {TABS.map((label, index) => (
                        <Tab key={index} label={label} />
                    ))}
                </Tabs>

                {/* === TAB 1: OVERVIEW === */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <ReadOnlyField
                                title="Date du tir"
                                value={fsec.shootingDate?.toLocaleDateString('fr-FR')}
                            />
                            <ReadOnlyField title="Identifiant Embase" value="" isEmpty />
                            <ReadOnlyField title="Planning" value="" isEmpty />
                            <ReadOnlyField title="FA" value="" isEmpty />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box mb={2}>
                                <Typography variant="h6">Pièces Jointes</Typography>
                                {fsec.fsecDocuments?.map((doc: any, i: number) => (
                                    <Box key={i} display="flex" justifyContent="space-between">
                                        <Typography color="text.secondary">{doc.subtype?.label ?? 'Doc'}</Typography>
                                        <Typography>{doc.path}</Typography>
                                    </Box>
                                ))}
                                {(!fsec.fsecDocuments || fsec.fsecDocuments.length === 0) && <Typography color="text.disabled">-</Typography>}
                            </Box>

                            <Box mb={2}>
                                <Typography variant="h6">Equipe projet</Typography>
                                {fsec.fsecTeam?.map((team: any, i: number) => (
                                    <Box key={i} display="flex" justifyContent="space-between">
                                        <Typography color="text.secondary">{team.role?.label ?? 'Role'}</Typography>
                                        <Typography>{team.name}</Typography>
                                    </Box>
                                ))}
                                {(!fsec.fsecTeam || fsec.fsecTeam.length === 0) && <Typography color="text.disabled">-</Typography>}
                            </Box>

                            <ReadOnlyField title="Photo" value="" isEmpty />
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* === TAB 2: ASSEMBLAGE === */}
                <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box mb={2}>
                                <Typography variant="h6">Banc utilisé</Typography>
                                {currentAssembly?.assemblyBench ? (
                                    <Typography>Banc: {currentAssembly.assemblyBench.label}</Typography>
                                ) : (
                                    <Typography color="text.disabled">-</Typography>
                                )}
                            </Box>

                            <ReadOnlyField
                                title="Assembleur"
                                value={currentAssembly?.fsecTeam?.[0]?.name}
                            />

                            <ReadOnlyField
                                title="Observations"
                                value={currentAssembly?.comments}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ReadOnlyField title="Listing éléments" value="" isEmpty />
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* === TAB 3: CONTROLE / METROLOGIE === */}
                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <ReadOnlyField
                                title="Nom Métrologue"
                                value={currentMetrology?.fsecTeam?.[0]?.name}
                            />

                            <Box mb={2}>
                                <Typography variant="h6">Livrables</Typography>
                                {currentMetrology?.fsecDocuments?.map((doc: any, i: number) => (
                                    <Typography key={i}>{doc.subtype?.label}: {doc.path}</Typography>
                                ))}
                                {(!currentMetrology?.fsecDocuments || currentMetrology.fsecDocuments.length === 0) && <Typography color="text.disabled">-</Typography>}
                            </Box>

                            <ReadOnlyField
                                title="Nom de la machine"
                                value={currentMetrology?.machine?.label}
                            />

                            <ReadOnlyField
                                title="Conteneur ou rack"
                                value={fsec?.rackId ? `Rack ${fsec.rackId}` : '-'}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ReadOnlyField
                                title="Réalisé le"
                                value={currentMetrology?.date?.toLocaleDateString('fr-FR')}
                            />
                            {/* Interface IO usually in Sealing, but Audit says displayed here */}
                            <ReadOnlyField
                                title="Interface IO"
                                value={currentSealing?.interfaceIO ?? '-'}
                            />

                            <ReadOnlyField
                                title="Observation"
                                value={currentMetrology?.comments}
                            />

                            <ReadOnlyField title="Responsable" value="" isEmpty />
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* === TAB 4: VUE / PHOTO === */}
                <TabPanel value={tabValue} index={3}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <ReadOnlyField
                                title="Operateur"
                                value={currentPictures?.fsecTeam?.[0]?.name}
                            />

                            <ReadOnlyField title="Réalisé le" value="" isEmpty />
                            <ReadOnlyField title="Observation" value="" isEmpty />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box mb={2}>
                                <Typography variant="h6">Photos pour le MOE</Typography>
                                {currentPictures?.fsecDocuments?.map((doc: any, i: number) => (
                                    <Typography key={i}>{doc.path}</Typography>
                                ))}
                                {(!currentPictures?.fsecDocuments || currentPictures.fsecDocuments.length === 0) && <Typography color="text.disabled">-</Typography>}
                            </Box>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* === TAB 5: RESULTATS === */}
                {!isSansGaz && (
                    <TabPanel value={tabValue} index={4}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <ReadOnlyField title="Alignement" value="" isEmpty />
                                <ReadOnlyField
                                    title="Date de tir"
                                    value={fsec.shootingDate?.toLocaleDateString('fr-FR')}
                                />
                                <ReadOnlyField
                                    title="Expérience SRxx"
                                    value={fsec.experienceSrxx}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ReadOnlyField title="Livraison" value="" isEmpty />
                            </Grid>
                        </Grid>
                    </TabPanel>
                )}
            </Paper>

            <UpdateFsecModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                fsec={fsec}
            />
        </Container>
    );
}
