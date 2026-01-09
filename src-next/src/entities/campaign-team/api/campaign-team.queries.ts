/**
 * Campaign Team Queries
 * @module entities/campaign-team/api
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/api';
import {
    CampaignTeamListSchema,
    CampaignTeamMember,
    CampaignTeamMemberCreate,
} from '../model';
import { campaignTeamKeys } from './campaign-team.keys';

/**
 * Fetch team members for a campaign
 */
export function useCampaignTeam(campaignUuid: string) {
    return useQuery({
        queryKey: campaignTeamKeys.byCampaign(campaignUuid),
        queryFn: async (): Promise<CampaignTeamMember[]> => {
            // Updated endpoint based on controller analysis: 
            // list_by_campaign -> url_path="campaign/(?P<campaign_uuid>[^/.]+)"
            // Router prefix 'campaign-teams'
            // Full URL: /campaign-teams/campaign/{uuid}/
            const data = await api.get(`/campaign-teams/campaign/${campaignUuid}/`);
            return CampaignTeamListSchema.parse(data);
        },
        enabled: Boolean(campaignUuid),
    });
}

/**
 * Add a team member
 */
export function useAddTeamMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CampaignTeamMemberCreate) => {
            const response = await api.post('/campaign-teams/', data);
            return response;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: campaignTeamKeys.byCampaign(variables.campaign_uuid),
            });
        },
    });
}

/**
 * Update a team member
 */
export function useUpdateTeamMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { uuid: string; campaign_uuid: string; role_id: number; name: string }) => {
            const response = await api.put(`/campaign-teams/${data.uuid}/`, {
                campaign_uuid: data.campaign_uuid,
                role_id: data.role_id,
                name: data.name,
            });
            return response;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: campaignTeamKeys.byCampaign(variables.campaign_uuid),
            });
        },
    });
}

/**
 * Delete a team member
 */
export function useDeleteTeamMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { uuid: string; campaign_uuid: string }) => {
            await api.delete(`/campaign-teams/${data.uuid}/`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: campaignTeamKeys.byCampaign(variables.campaign_uuid),
            });
        },
    });
}
