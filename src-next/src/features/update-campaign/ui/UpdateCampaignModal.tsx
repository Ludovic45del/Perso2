import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Tabs,
    Tab,
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CampaignCreateSchema, CampaignCreate, useUpdateCampaign, useDeleteCampaign, CampaignWithRelations } from '@entities/campaign';
import { CAMPAIGN_STATUSES, CAMPAIGN_TYPES, CAMPAIGN_INSTALLATIONS, CAMPAIGN_ROLES } from '@entities/campaign/lib';
import { useState, useEffect } from 'react';
import { useNotification } from '@shared/ui';
import { useCampaignTeam, useAddTeamMember, useUpdateTeamMember, useDeleteTeamMember, getMemberByRole } from '@entities/campaign-team';
import { useNavigate } from 'react-router-dom';
import { CampaignFormFields, CampaignFormDates, TeamMemberSection } from '@features/campaign-form';

interface UpdateCampaignModalProps {
    open: boolean;
    onClose: () => void;
    campaign: CampaignWithRelations;
}

export function UpdateCampaignModal({ open, onClose, campaign }: UpdateCampaignModalProps) {
    const typeOptions = Object.values(CAMPAIGN_TYPES).map(t => ({ value: t.id, label: t.label, color: t.color || '#999' }));
    const installationOptions = Object.values(CAMPAIGN_INSTALLATIONS).map(i => ({ value: i.id, label: i.label, color: i.color || '#999' }));

    const [tabValue, setTabValue] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const updateMutation = useUpdateCampaign();
    const deleteMutation = useDeleteCampaign();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const { data: teamMembers } = useCampaignTeam(campaign.uuid);
    const addTeamMember = useAddTeamMember();
    const updateTeamMember = useUpdateTeamMember();
    const deleteTeamMember = useDeleteTeamMember();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<CampaignCreate>({
        resolver: zodResolver(CampaignCreateSchema),
        defaultValues: {
            name: campaign.name,
            year: campaign.year,
            semester: campaign.semester as 'S1' | 'S2',
            description: campaign.description,
            typeId: campaign.type?.id ?? undefined,
            installationId: campaign.installation?.id ?? undefined,
            statusId: campaign.status?.id ?? 0,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            dtriNumber: campaign.dtriNumber,
            moe: '',
            rce: '',
            iec: '',
        },
    });

    useEffect(() => {
        if (open && teamMembers) {
            const moe = getMemberByRole(teamMembers, 'MOE');
            const rce = getMemberByRole(teamMembers, 'RCE');
            const iec = getMemberByRole(teamMembers, 'IEC');

            reset({
                name: campaign.name,
                year: campaign.year,
                semester: campaign.semester as 'S1' | 'S2',
                description: campaign.description,
                typeId: campaign.type?.id ?? undefined,
                installationId: campaign.installation?.id ?? undefined,
                statusId: campaign.status?.id ?? 0,
                startDate: campaign.startDate,
                endDate: campaign.endDate,
                dtriNumber: campaign.dtriNumber,
                moe: moe?.name ?? '',
                rce: rce?.name ?? '',
                iec: iec?.name ?? '',
            });
            setTabValue(0);
        }
    }, [open, campaign, teamMembers, reset]);

    const onSubmit = async (data: CampaignCreate) => {
        try {
            await updateMutation.mutateAsync({ uuid: campaign.uuid, data });

            const teamUpdates = [
                { name: data.moe, roleId: CAMPAIGN_ROLES[0].id, roleLabel: 'MOE' },
                { name: data.rce, roleId: CAMPAIGN_ROLES[1].id, roleLabel: 'RCE' },
                { name: data.iec, roleId: CAMPAIGN_ROLES[2].id, roleLabel: 'IEC' },
            ];

            for (const update of teamUpdates) {
                const existingMember = getMemberByRole(teamMembers, update.roleLabel);
                const newName = update.name?.trim() ?? '';

                if (existingMember && newName) {
                    if (existingMember.name !== newName) {
                        await updateTeamMember.mutateAsync({
                            uuid: existingMember.uuid,
                            campaign_uuid: campaign.uuid,
                            role_id: update.roleId,
                            name: newName,
                        });
                    }
                } else if (existingMember && !newName) {
                    await deleteTeamMember.mutateAsync({
                        uuid: existingMember.uuid,
                        campaign_uuid: campaign.uuid,
                    });
                } else if (!existingMember && newName) {
                    await addTeamMember.mutateAsync({
                        campaign_uuid: campaign.uuid,
                        role_id: update.roleId,
                        name: newName,
                    });
                }
            }

            showNotification('Campagne mise à jour avec succès', 'success');
            onClose();
        } catch (err: unknown) {
            const apiError = err as { status?: number };
            if (apiError.status === 409) {
                showNotification('Une campagne avec ce nom existe déjà', 'warning');
            } else {
                showNotification('Erreur lors de la mise à jour', 'error');
            }
        }
    };

    const currentStatusId = watch('statusId');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', pr: 1 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ px: 2, minHeight: 64, alignItems: 'center' }}>
                    <Tab label="Données générales" sx={{ height: 64, fontWeight: 700, fontSize: '0.95rem' }} />
                    <Tab label="Workflow" sx={{ height: 64, fontWeight: 700, fontSize: '0.95rem' }} />
                </Tabs>
                <IconButton onClick={onClose} size="small" sx={{ mr: 1 }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <form id="update-campaign-form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ minHeight: 400, p: 4, pt: 3 }}>
                    {tabValue === 0 && (
                        <Grid container spacing={4}>
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

                    {tabValue === 1 && (
                        <Box>
                            <Grid container spacing={2}>
                                {Object.values(CAMPAIGN_STATUSES).map((status) => (
                                    <Grid item xs={6} key={status.id}>
                                        <Paper
                                            onClick={() => setValue('statusId', status.id, { shouldDirty: true })}
                                            sx={{
                                                p: 3,
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                bgcolor: currentStatusId === status.id ? status.color : 'background.paper',
                                                color: currentStatusId === status.id ? 'white' : 'text.primary',
                                                border: '1px solid',
                                                borderColor: currentStatusId === status.id ? status.color : 'divider',
                                                borderRadius: 1.5,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    opacity: 0.9,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }
                                            }}
                                        >
                                            <Typography fontWeight={600}>{status.label}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                    <Box>
                        {!showDeleteConfirm ? (
                            <Button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                sx={{ fontWeight: 600 }}
                            >
                                Supprimer
                            </Button>
                        ) : (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="error" fontWeight={600}>
                                    Confirmer ?
                                </Typography>
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await deleteMutation.mutateAsync(campaign.uuid);
                                            showNotification('Campagne supprimée', 'success');
                                            navigate('/campagnes');
                                        } catch {
                                            showNotification('Erreur lors de la suppression', 'error');
                                        }
                                    }}
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? 'Suppression...' : 'Oui'}
                                </Button>
                                <Button type="button" onClick={() => setShowDeleteConfirm(false)} variant="text" size="small">
                                    Non
                                </Button>
                            </Stack>
                        )}
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button type="button" onClick={onClose} variant="outlined" sx={{ fontWeight: 600, textTransform: 'none' }}>
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={updateMutation.isPending}
                            sx={{ fontWeight: 700, textTransform: 'none' }}
                        >
                            {updateMutation.isPending ? 'Enregistrement...' : 'Modifier'}
                        </Button>
                    </Stack>
                </DialogActions>
            </form>
        </Dialog>
    );
}
