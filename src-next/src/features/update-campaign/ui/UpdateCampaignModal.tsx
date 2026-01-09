import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CampaignCreateSchema, CampaignCreate, useUpdateCampaign, useDeleteCampaign, CampaignWithRelations } from '@entities/campaign';
import { CAMPAIGN_STATUSES, CAMPAIGN_TYPES, CAMPAIGN_INSTALLATIONS, CAMPAIGN_ROLES } from '@entities/campaign/lib';
import { ChipSelect } from '@widgets/chip-select';
import { useState, useEffect } from 'react';
import { useNotification } from '@shared/ui';
import { useCampaignTeam, useAddTeamMember, useUpdateTeamMember, useDeleteTeamMember, getMemberByRole } from '@entities/campaign-team';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

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

    // Fonction locale supprimée, utilisation de l'import getMemberByRole

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
            await updateMutation.mutateAsync({
                uuid: campaign.uuid,
                data: data,
            });

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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
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
                                <Stack spacing={3}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Nom"
                                                error={Boolean(errors.name)}
                                                helperText={errors.name?.message}
                                                fullWidth
                                                required
                                            />
                                        )}
                                    />
                                    <Stack direction="row" spacing={2}>
                                        <Controller
                                            name="year"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Année"
                                                    type="number"
                                                    error={Boolean(errors.year)}
                                                    helperText={errors.year?.message}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    fullWidth
                                                    required
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="semester"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth required>
                                                    <InputLabel>Semestre</InputLabel>
                                                    <Select {...field} label="Semestre">
                                                        <MenuItem value="S1">S1</MenuItem>
                                                        <MenuItem value="S2">S2</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                    </Stack>
                                    <Controller
                                        name="typeId"
                                        control={control}
                                        render={({ field }) => (
                                            <Box>
                                                <ChipSelect
                                                    {...field}
                                                    label="Type"
                                                    options={typeOptions}
                                                    required
                                                    error={Boolean(errors.typeId)}
                                                    value={field.value ?? ''}
                                                />
                                                {errors.typeId && (
                                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                                        {errors.typeId.message}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    />
                                    <Controller
                                        name="installationId"
                                        control={control}
                                        render={({ field }) => (
                                            <Box>
                                                <ChipSelect
                                                    {...field}
                                                    label="Installation"
                                                    options={installationOptions}
                                                    required
                                                    error={Boolean(errors.installationId)}
                                                    value={field.value ?? ''}
                                                />
                                                {errors.installationId && (
                                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                                        {errors.installationId.message}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    />
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    <Stack direction="row" spacing={2}>
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            render={({ field: { value, onChange, ...field } }) => (
                                                <DatePicker
                                                    {...field}
                                                    label="Date de début"
                                                    value={value ? dayjs(value) : null}
                                                    onChange={(date) => onChange(date?.toDate() || null)}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: Boolean(errors.startDate),
                                                            helperText: errors.startDate?.message
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="endDate"
                                            control={control}
                                            render={({ field: { value, onChange, ...field } }) => (
                                                <DatePicker
                                                    {...field}
                                                    label="Date de fin"
                                                    value={value ? dayjs(value) : null}
                                                    onChange={(date) => onChange(date?.toDate() || null)}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: Boolean(errors.endDate),
                                                            helperText: errors.endDate?.message
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                    <Controller
                                        name="dtriNumber"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                value={field.value ?? ''}
                                                label="N° DTRI"
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                                fullWidth
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                value={field.value ?? ''}
                                                label="Description"
                                                multiline
                                                rows={4}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Stack>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ pt: 2 }}>
                                    <Divider sx={{ mb: 3 }}>
                                        <Typography variant="overline" color="text.secondary" fontWeight={700}>
                                            Équipe projet
                                        </Typography>
                                    </Divider>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <Controller
                                                name="moe"
                                                control={control}
                                                render={({ field }) => <TextField {...field} label="MOE" fullWidth />}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Controller
                                                name="rce"
                                                control={control}
                                                render={({ field }) => <TextField {...field} label="RCE" fullWidth />}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Controller
                                                name="iec"
                                                control={control}
                                                render={({ field }) => <TextField {...field} label="IEC" fullWidth />}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
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
                                <Button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    variant="text"
                                    size="small"
                                >
                                    Non
                                </Button>
                            </Stack>
                        )}
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button type="button" onClick={onClose} variant="text" color="inherit" sx={{ fontWeight: 600 }}>
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={updateMutation.isPending}
                            sx={{
                                px: 4,
                                fontWeight: 700,
                                borderRadius: 1.5,
                                textTransform: 'none'
                            }}
                        >
                            {updateMutation.isPending ? 'Enregistrement...' : 'Modifier'}
                        </Button>
                    </Stack>
                </DialogActions>
            </form>
        </Dialog>
    );
}
