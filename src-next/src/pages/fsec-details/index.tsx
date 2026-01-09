/**
 * FSEC Details Page with Steps Tabs
 * @module pages/fsec-details
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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFsec } from '@entities/fsec';
import { useAssemblyStepsByFsec, useMetrologyStepsByFsec } from '@entities/steps';

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

export default function FsecDetailsPage() {
    const navigate = useNavigate();
    const { versionUuid } = useParams<{ versionUuid: string }>();
    const [tabValue, setTabValue] = useState(0);

    const { data: fsec, isLoading, error } = useFsec(versionUuid!);
    const { data: assemblySteps } = useAssemblyStepsByFsec(versionUuid!);
    const { data: metrologySteps } = useMetrologyStepsByFsec(versionUuid!);

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

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/fsecs')}
                >
                    Retour
                </Button>
                <Typography variant="h3">{fsec.name}</Typography>
                <Chip
                    label={fsec.isActive ? 'Actif' : 'Inactif'}
                    color={fsec.isActive ? 'success' : 'default'}
                />
            </Stack>

            {/* Info Card */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary">
                            Version UUID
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {fsec.versionUuid}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary">
                            Date de livraison
                        </Typography>
                        <Typography>
                            {fsec.deliveryDate?.toLocaleDateString('fr-FR') ?? 'Non définie'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary">
                            Localisation
                        </Typography>
                        <Typography>{fsec.localisation ?? 'Non définie'}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Steps Tabs */}
            <Paper>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Vue générale" />
                    <Tab label={`Assemblage (${assemblySteps?.length ?? 0})`} />
                    <Tab label={`Métrologie (${metrologySteps?.length ?? 0})`} />
                    <Tab label="Étanchéité" />
                    <Tab label="Remplissage Gaz" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Typography variant="h6" gutterBottom>
                        Description
                    </Typography>
                    <Typography color="text.secondary">
                        {fsec.comments ?? 'Aucun commentaire'}
                    </Typography>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Typography variant="h6" gutterBottom>
                        Étapes d'assemblage
                    </Typography>
                    {assemblySteps?.length === 0 ? (
                        <Typography color="text.secondary">
                            Aucune étape d'assemblage
                        </Typography>
                    ) : (
                        assemblySteps?.map((step) => (
                            <Paper key={step.uuid} sx={{ p: 2, mb: 2 }} variant="outlined">
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" color="text.secondary">
                                            Date début
                                        </Typography>
                                        <Typography>
                                            {step.startDate?.toLocaleDateString('fr-FR') ?? '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" color="text.secondary">
                                            Date fin
                                        </Typography>
                                        <Typography>
                                            {step.endDate?.toLocaleDateString('fr-FR') ?? '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" color="text.secondary">
                                            Température
                                        </Typography>
                                        <Typography>
                                            {step.hydrometricTemperature
                                                ? `${step.hydrometricTemperature}°C`
                                                : '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Commentaires
                                        </Typography>
                                        <Typography>{step.comments ?? '-'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h6" gutterBottom>
                        Étapes de métrologie
                    </Typography>
                    {metrologySteps?.length === 0 ? (
                        <Typography color="text.secondary">
                            Aucune étape de métrologie
                        </Typography>
                    ) : (
                        metrologySteps?.map((step) => (
                            <Paper key={step.uuid} sx={{ p: 2, mb: 2 }} variant="outlined">
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Date
                                        </Typography>
                                        <Typography>
                                            {step.date?.toLocaleDateString('fr-FR') ?? '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Machine ID
                                        </Typography>
                                        <Typography>{step.machineId ?? '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Commentaires
                                        </Typography>
                                        <Typography>{step.comments ?? '-'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                        }}
                    >
                        <Typography color="text.secondary">
                            🚧 Onglet en construction
                        </Typography>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={4}>
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                        }}
                    >
                        <Typography color="text.secondary">
                            🚧 Onglet en construction
                        </Typography>
                    </Box>
                </TabPanel>
            </Paper>
        </Container>
    );
}
