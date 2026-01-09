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
            data: FsecCreate;
        }): Promise<Fsec> => {
            const apiData = fsecCreateToApi(data);
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
