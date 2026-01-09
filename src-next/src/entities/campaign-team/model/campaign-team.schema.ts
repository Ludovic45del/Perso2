/**
 * Campaign Team Schema
 * @module entities/campaign-team/model
 */

import { z } from 'zod';
import { getCampaignRole } from '@entities/campaign/lib';

export const CampaignTeamApiSchema = z.object({
    uuid: z.string().uuid(),
    campaign_uuid: z.string().uuid(),
    role_id: z.number().int().nullable(),
    name: z.string(),
});

export const CampaignTeamSchema = CampaignTeamApiSchema.transform((api) => ({
    uuid: api.uuid,
    campaignUuid: api.campaign_uuid,
    role: getCampaignRole(api.role_id),
    name: api.name,
}));

export type CampaignTeamMember = z.infer<typeof CampaignTeamSchema>;
export const CampaignTeamListSchema = z.array(CampaignTeamApiSchema).transform((list) =>
    list.map((api) => CampaignTeamSchema.parse(api))
);

export interface CampaignTeamMemberCreate {
    campaign_uuid: string;
    role_id: number;
    name: string;
}
