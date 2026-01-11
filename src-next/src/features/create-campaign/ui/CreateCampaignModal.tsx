/**
 * Create Campaign Modal UI
 * @module features/create-campaign/ui
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
import { CampaignCreateSchema, CampaignCreate, useCreateCampaign } from '@entities/campaign';
import { useAddTeamMember } from '@entities/campaign-team';
import { useCreateCampaignStore } from '../model';
import { CAMPAIGN_TYPES, CAMPAIGN_INSTALLATIONS, CAMPAIGN_ROLES } from '@entities/campaign/lib';
import { useState } from 'react';
import { CampaignFormFields, CampaignFormDates, TeamMemberSection } from '@features/campaign-form';

export function CreateCampaignModal() {
    const typeOptions = Object.values(CAMPAIGN_TYPES).map(t => ({ value: t.id, label: t.label, color: t.color || '#999' }));
    const installationOptions = Object.values(CAMPAIGN_INSTALLATIONS).map(i => ({ value: i.id, label: i.label, color: i.color || '#999' }));

    const { isOpen, close, reset } = useCreateCampaignStore();
    const createMutation = useCreateCampaign();
    const addTeamMember = useAddTeamMember();
    const [teamMemberErrors, setTeamMemberErrors] = useState<string[]>([]);
    const [tabValue, setTabValue] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
    } = useForm<CampaignCreate>({
        resolver: zodResolver(CampaignCreateSchema),
        defaultValues: {
            name: '',
            year: new Date().getFullYear(),
            semester: 'S1',
            typeId: undefined,
            installationId: undefined,
            dtriNumber: null,
            description: null,
            moe: '',
            rce: '',
            iec: '',
        },
    });

    const onSubmit = async (data: CampaignCreate) => {
        setTeamMemberErrors([]);
        try {
            const campaign = await createMutation.mutateAsync(data);

            const teamMembers = [
                { name: data.moe, role_id: CAMPAIGN_ROLES[0].id, label: 'MOE' },
                { name: data.rce, role_id: CAMPAIGN_ROLES[1].id, label: 'RCE' },
                { name: data.iec, role_id: CAMPAIGN_ROLES[2].id, label: 'IEC' },
            ];

            const failedMembers: string[] = [];
            for (const member of teamMembers) {
                if (member.name && member.name.trim() !== '') {
                    try {
                        await addTeamMember.mutateAsync({
                            campaign_uuid: campaign.uuid,
                            role_id: member.role_id,
                            name: member.name,
                        });
                    } catch (err) {
                        console.error(`Failed to add team member (${member.label}):`, err);
                        failedMembers.push(member.label);
                    }
                }
            }

            if (failedMembers.length > 0) {
                setTeamMemberErrors(failedMembers);
            } else {
                resetForm();
                reset();
            }
        } catch (error) {
            console.error('Campaign creation failed:', error);
        }
    };

    const handleClose = () => {
        setTeamMemberErrors([]);
        resetForm();
        setTabValue(0);
        close();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="md"
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

            <form id="create-campaign-form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ minHeight: 400, p: 4, pt: 3 }}>
                    {tabValue === 0 && (
                        <Grid container spacing={4}>
                            <Grid item xs={createMutation.isError || teamMemberErrors.length > 0 ? 12 : 0} sx={{ display: createMutation.isError || teamMemberErrors.length > 0 ? 'block' : 'none' }}>
                                {createMutation.isError && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        Erreur lors de la création de la campagne
                                    </Alert>
                                )}
                                {teamMemberErrors.length > 0 && (
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        La campagne a été créée mais les membres suivants n'ont pas pu être ajoutés : {teamMemberErrors.join(', ')}.
                                    </Alert>
                                )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <CampaignFormFields
                                    control={control}
                                    errors={errors}
                                    typeOptions={typeOptions}
                                    installationOptions={installationOptions}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <CampaignFormDates control={control} errors={errors} />
                            </Grid>

                            <Grid item xs={12}>
                                <TeamMemberSection control={control} />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        type="button"
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            fontWeight: 600,
                            textTransform: 'none'
                        }}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={createMutation.isPending}
                        sx={{
                            fontWeight: 700,
                            textTransform: 'none'
                        }}
                    >
                        {createMutation.isPending ? 'Création...' : 'Créer'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
