/**
 * Create FSEC Modal UI
 * @module features/create-fsec/ui
 *
 * Pattern: Same as features/create-campaign/ui/CreateCampaignModal.tsx
 * Layout selon rapport FSEC MODALE:
 * - Colonne 1: Campagne*, Nom*, Catégorie*, Remarques
 * - Colonne 2: MOE, REC, IEC (Équipe FSEC)
 * - Colonne 3: Documents DESIGN (6 types prédéfinis)
 */

import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Alert,
    Divider,
    Grid,
    Box,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FsecCreateSchema, FsecCreate, useCreateFsec, FSEC_CREATE_DEFAULT } from '@entities/fsec';
import { FSEC_CATEGORY_OPTIONS } from '@entities/fsec/lib';
import { useState } from 'react';
import { FsecFormFields, FsecTeamSection, FsecDocumentsSection } from '@features/fsec-form';

interface CreateFsecModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId?: string;
}

export function CreateFsecModal({ isOpen, onClose, campaignId }: CreateFsecModalProps) {
    const createMutation = useCreateFsec();
    const [tabValue, setTabValue] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
    } = useForm<FsecCreate>({
        resolver: zodResolver(FsecCreateSchema),
        defaultValues: {
            ...FSEC_CREATE_DEFAULT,
            campaignId: campaignId ?? null,
        },
    });

    const onSubmit = async (data: FsecCreate) => {
        try {
            await createMutation.mutateAsync(data);
            resetForm();
            onClose();
        } catch (error) {
            console.error('FSEC creation failed:', error);
        }
    };

    const handleClose = () => {
        resetForm();
        setTabValue(0);
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', pr: 1 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ px: 2, minHeight: 64, alignItems: 'center' }}>
                    <Tab label="Données générales" sx={{ height: 64, fontWeight: 700, fontSize: '0.95rem' }} />
                </Tabs>
                <IconButton onClick={handleClose} size="small" sx={{ mr: 1 }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <form id="create-fsec-form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ minHeight: 400, p: 4, pt: 3 }}>
                    {tabValue === 0 && (
                        <>
                            {createMutation.isError && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    Erreur lors de la création du FSEC
                                </Alert>
                            )}

                            {/* Layout 3 colonnes selon rapport FSEC MODALE */}
                            <Grid container spacing={4}>
                                {/* Colonne 1: Infos de base */}
                                <Grid item xs={12} md={4}>
                                    <FsecFormFields
                                        control={control}
                                        errors={errors}
                                        categoryOptions={FSEC_CATEGORY_OPTIONS}
                                    />
                                </Grid>

                                {/* Colonne 2: Équipe FSEC */}
                                <Grid item xs={12} md={4}>
                                    <FsecTeamSection control={control} />
                                </Grid>

                                {/* Colonne 3: Documents DESIGN */}
                                <Grid item xs={12} md={4}>
                                    <FsecDocumentsSection control={control} />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        type="button"
                        onClick={handleClose}
                        variant="outlined"
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={createMutation.isPending}
                        sx={{ fontWeight: 700, textTransform: 'none' }}
                    >
                        {createMutation.isPending ? 'Création...' : 'Créer'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
