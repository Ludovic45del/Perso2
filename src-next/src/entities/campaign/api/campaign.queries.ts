/**
 * Campaign API Service - TanStack Query Hooks
 * @module entities/campaign/api
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/api';
import {
    Campaign,
    CampaignSchema,
    CampaignListSchema,
    CampaignCreate,
    campaignCreateToApi,
    CampaignWithRelations,
} from '../model';

/**
 * Type for partial campaign updates (PATCH)
 * Uses snake_case to match backend API expectations
 */
export interface CampaignPatch {
    status_id?: number;
    type_id?: number;
    installation_id?: number;
    name?: string;
    year?: number;
    semester?: string;
    start_date?: string | null;
    end_date?: string | null;
    dtri_number?: number | null;
    description?: string | null;
}
import { campaignKeys } from './campaign.keys';
import { getCampaignType, getCampaignStatus, getCampaignInstallation } from '../lib';

/**
 * Hydrate campaign with referential data
 */
function hydrateCampaign(campaign: Campaign): CampaignWithRelations {
    return {
        ...campaign,
        type: getCampaignType(campaign.typeId),
        status: getCampaignStatus(campaign.statusId),
        installation: getCampaignInstallation(campaign.installationId),
    };
}

/**
 * Fetch all campaigns (with hydrated relations)
 */
export function useCampaigns() {
    return useQuery({
        queryKey: campaignKeys.lists(),
        queryFn: async (): Promise<CampaignWithRelations[]> => {
            const data = await api.get('/campaigns/');
            const rawCampaigns = CampaignListSchema.parse(data);
            return rawCampaigns.map(hydrateCampaign);
        },
    });
}

/**
 * Fetch single campaign by UUID (hydrated)
 */
export function useCampaign(uuid: string) {
    return useQuery({
        queryKey: campaignKeys.detail(uuid),
        queryFn: async (): Promise<CampaignWithRelations> => {
            const data = await api.get(`/campaigns/${uuid}/`);
            const rawCampaign = CampaignSchema.parse(data);
            return hydrateCampaign(rawCampaign);
        },
        enabled: Boolean(uuid),
    });
}

/**
 * Create new campaign
 */
export function useCreateCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CampaignCreate): Promise<Campaign> => {
            const apiData = campaignCreateToApi(data);
            const response = await api.post('/campaigns/', apiData);
            return CampaignSchema.parse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
        },
    });
}

/**
 * Update existing campaign
 */
export function useUpdateCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            data,
        }: {
            uuid: string;
            data: CampaignCreate;
        }): Promise<Campaign> => {
            const apiData = campaignCreateToApi(data);
            const response = await api.put(`/campaigns/${uuid}/`, apiData);
            return CampaignSchema.parse(response);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: campaignKeys.detail(variables.uuid),
            });
        },
    });
}

/**
 * Partial update campaign (e.g. status)
 */
export function usePatchCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            uuid,
            data,
        }: {
            uuid: string;
            data: CampaignPatch;
        }): Promise<Campaign> => {
            const response = await api.patch(`/campaigns/${uuid}/`, data);
            return CampaignSchema.parse(response);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: campaignKeys.detail(variables.uuid),
            });
        },
    });
}

/**
 * Delete campaign
 */
export function useDeleteCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (uuid: string): Promise<void> => {
            await api.delete(`/campaigns/${uuid}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
        },
    });
}
