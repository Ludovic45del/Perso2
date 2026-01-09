/**
 * Create Campaign Modal UI
 * @module features/create-campaign/ui
 */

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
    Alert,
    Typography,
    Divider,
    Grid,
    Box,
    IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { ChipSelect } from '@widgets/chip-select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CampaignCreateSchema, CampaignCreate, useCreateCampaign } from '@entities/campaign';
import { useAddTeamMember } from '@entities/campaign-team';
import { useCreateCampaignStore } from '../model';
import { CAMPAIGN_TYPES, CAMPAIGN_INSTALLATIONS, CAMPAIGN_ROLES } from '@entities/campaign/lib';
import { useState } from 'react';

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
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 3 }}>
                    <Button type="button" onClick={handleClose} variant="text" color="inherit" sx={{ fontWeight: 600 }}>
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={createMutation.isPending}
                        sx={{
                            px: 4,
                            fontWeight: 700,
                            borderRadius: 1.5,
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
