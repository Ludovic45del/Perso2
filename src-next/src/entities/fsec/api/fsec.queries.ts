/**
 * FSEC API Service - TanStack Query Hooks
 * @module entities/fsec/api
 * 
 * Endpoints verified from: cible/api/urls.py
 * - GET /fsecs/ → list all
 * - GET /fsecs/{version_uuid}/ → detail
 * - GET /fsecs/campaign/{uuid}/ → list by campaign (custom action)
 * - POST /fsecs/ → create
 * - PUT /fsecs/{version_uuid}/ → update
 * - DELETE /fsecs/{version_uuid}/ → delete
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/api';
import {
    Fsec,
    FsecSchema,
    FsecListSchema,
    FsecCreate,
    FsecUpdate,
    fsecCreateToApi,
} from '../model';
import { fsecKeys } from './fsec.keys';

/**
 * Fetch all FSECs
 */
export function useFsecs() {
    return useQuery({
        queryKey: fsecKeys.lists(),
        queryFn: async (): Promise<Fsec[]> => {
            const data = await api.get('/fsecs/');
            return FsecListSchema.parse(data);
        },
    });
}

/**
 * Fetch single FSEC by version UUID
 */
export function useFsec(versionUuid: string) {
    return useQuery({
        queryKey: fsecKeys.detail(versionUuid),
        queryFn: async (): Promise<Fsec> => {
            const data = await api.get(`/fsecs/${versionUuid}/`);
            return FsecSchema.parse(data);
        },
        enabled: Boolean(versionUuid),
    });
}

/**
 * Fetch FSECs by campaign UUID
 * Endpoint: GET /fsecs/campaign/{campaign_uuid}/
 */
export function useFsecsByCampaign(campaignUuid: string) {
    return useQuery({
        queryKey: fsecKeys.byCampaign(campaignUuid),
        queryFn: async (): Promise<Fsec[]> => {
            const data = await api.get(`/fsecs/campaign/${campaignUuid}/`);
            return FsecListSchema.parse(data);
        },
        enabled: Boolean(campaignUuid),
    });
}

/**
 * Create new FSEC
 */
export function useCreateFsec() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: FsecCreate): Promise<Fsec> => {
            const apiData = fsecCreateToApi(data);
            const response = await api.post('/fsecs/', apiData);
            return FsecSchema.parse(response);
        },
        onSuccess: (newFsec) => {
            // Invalidate list to refetch
            queryClient.invalidateQueries({ queryKey: fsecKeys.lists() });
            // Also invalidate campaign-specific list if we know the campaign
            if (newFsec.campaignId) {
                queryClient.invalidateQueries({
                    queryKey: fsecKeys.byCampaign(newFsec.campaignId),
                });
            }
        },
    });
}

/**
 * Transform FsecUpdate to API format (snake_case keys for backend compatibility)
 * 
 * Backend expects snake_case keys with nested referentials having { id } structure.
 * Role IDs: 1=MOE, 2=REC, 3=Assembleur, 4=Métrologue, 5=Équipe Photos
 * Document subtype IDs defined in backend referential.
 */
function fsecUpdateToApi(data: FsecUpdate): Record<string, unknown> {
    return {
        // Referentials with nested { id } structure
        category: data.categoryId ? { id: data.categoryId } : null,
        status: { id: data.statusId },
        rack: data.rackId ? { id: data.rackId } : null,

        // Design Step (snake_case)
        design_step: {
            name: data.designStep.name.toUpperCase(),
            comments: data.designStep.comments,
            campaign: data.designStep.campaignId ? { uuid: data.designStep.campaignId } : null,
            fsec_team: data.designStep.fsecTeam
                .filter(m => m.name)
                .map(m => ({
                    name: m.name,
                    role: { id: m.roleId }
                })),
            fsec_documents: data.designStep.fsecDocuments
                .filter(d => d.path)
                .map(d => ({
                    path: d.path,
                    subtype: { id: d.subtypeId }
                }))
        },

        // Assembly Step (snake_case)
        assembly_step: data.assemblyStep ? {
            start_date: data.assemblyStep.startDate?.toISOString() ?? null,
            end_date: data.assemblyStep.endDate?.toISOString() ?? null,
            assembly_bench: data.assemblyStep.assemblyBenchId ? [{ id: data.assemblyStep.assemblyBenchId }] : [],
            fsec_team: data.assemblyStep.assemblerName ? [{ name: data.assemblyStep.assemblerName, role: { id: 3 } }] : [],
            comments: data.assemblyStep.comments
        } : null,

        // Metrology Step (snake_case)
        metrology_step: data.metrologyStep ? {
            date: data.metrologyStep.date?.toISOString() ?? null,
            machine: data.metrologyStep.machineId ? { id: data.metrologyStep.machineId } : null,
            fsec_team: data.metrologyStep.metrologueName ? [{ name: data.metrologyStep.metrologueName, role: { id: 4 } }] : [],
            fsec_documents: [
                { path: data.metrologyStep.visradControlePath, subtype: { id: 6 } },
                { path: data.metrologyStep.fichierMetroPath, subtype: { id: 7 } },
                { path: data.metrologyStep.ecartMetroPath, subtype: { id: 9 } }
            ].filter(d => d.path),
            comments: data.metrologyStep.comments
        } : null,

        // Sealing Step (snake_case)
        sealing_step: data.sealingStep ? {
            interface_io: data.sealingStep.interfaceIO,
            comments: data.sealingStep.comments
        } : null,

        // Pictures Step (snake_case)
        pictures_step: data.picturesStep ? {
            last_updated: data.picturesStep.lastUpdated?.toISOString() ?? null,
            fsec_team: data.picturesStep.equipeName ? [{ name: data.picturesStep.equipeName, role: { id: 5 } }] : [],
            fsec_documents: data.picturesStep.fsecDocuments
                .filter(d => d.path)
                .map(d => ({
                    path: d.path,
                    subtype: { id: 8 }
                })),
            comments: data.picturesStep.comments
        } : null,

        // Usable Step (snake_case)
        usable_step: {
            delivery_date: data.usableStep.deliveryDate?.toISOString() ?? null
        },

        // Installed Step (snake_case)
        installed_step: {
            shooting_date: data.installedStep.shootingDate?.toISOString() ?? null,
            preshooting_pressure: data.installedStep.preshootingPressure,
            experience_srxx: data.installedStep.experienceSrxx
        }
    };
}


/**
 * Update existing FSEC
 */
export function useUpdateFsec() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            versionUuid,
            data,
        }: {
            versionUuid: string;
            data: FsecCreate | FsecUpdate;
        }): Promise<Fsec> => {
            // Determine if it's FsecUpdate or FsecCreate based on structure
            const apiData = 'designStep' in data
                ? fsecUpdateToApi(data as FsecUpdate)
                : fsecCreateToApi(data as FsecCreate);
            const response = await api.put(`/fsecs/${versionUuid}/`, apiData);
            return FsecSchema.parse(response);
        },
        onSuccess: (updatedFsec, variables) => {
            queryClient.invalidateQueries({ queryKey: fsecKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: fsecKeys.detail(variables.versionUuid),
            });
            if (updatedFsec.campaignId) {
                queryClient.invalidateQueries({
                    queryKey: fsecKeys.byCampaign(updatedFsec.campaignId),
                });
            }
        },
    });
}

/**
 * Delete FSEC
 */
export function useDeleteFsec() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (versionUuid: string): Promise<void> => {
            await api.delete(`/fsecs/${versionUuid}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: fsecKeys.lists() });
        },
    });
}
