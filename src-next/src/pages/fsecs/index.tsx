/**
 * FSECs List Page
 * @module pages/fsecs
 */

import {
    Box,
    Typography,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Button,
    Stack,
    Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFsecs } from '@entities/fsec';

export default function FsecsPage() {
    const navigate = useNavigate();
    const { data: fsecs, isLoading, error } = useFsecs();

    if (isLoading) {
        return (
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Alert severity="error">
                    Erreur lors du chargement des FSEC: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h3">Liste des FSEC</Typography>
                <Button variant="outlined" onClick={() => navigate('/')}>
                    Retour
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Livraison</TableCell>
                            <TableCell>Localisation</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fsecs?.map((fsec) => (
                            <TableRow
                                key={fsec.versionUuid}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/fsec-details/${fsec.versionUuid}`)}
                            >
                                <TableCell>
                                    <Typography fontWeight={500}>{fsec.name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={fsec.isActive ? 'Actif' : 'Inactif'}
                                        size="small"
                                        color={fsec.isActive ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    {fsec.deliveryDate?.toLocaleDateString('fr-FR') ?? '-'}
                                </TableCell>
                                <TableCell>{fsec.localisation ?? '-'}</TableCell>
                                <TableCell>
                                    <Button size="small" variant="outlined">
                                        Détails
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {fsecs?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography color="text.secondary">
                                        Aucun FSEC trouvé
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
