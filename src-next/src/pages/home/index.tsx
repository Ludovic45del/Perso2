/**
 * Home Page
 * @module pages/home
 */

import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <Container maxWidth={false} sx={{ py: 8 }}>
            <Box textAlign="center">
                <Typography variant="h1" gutterBottom>
                    CIBLE
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                    Application de gestion des campagnes et FSEC
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/campagnes')}
                    >
                        Voir les campagnes
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/fsecs')}
                    >
                        Voir les FSEC
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}
