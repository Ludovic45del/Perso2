/**
 * Campaign Team Query Keys
 * @module entities/campaign-team/api
 */

export const campaignTeamKeys = {
    all: ['campaign-teams'] as const,
    byCampaign: (campaignUuid: string) => [...campaignTeamKeys.all, 'campaign', campaignUuid] as const,
    detail: (uuid: string) => [...campaignTeamKeys.all, 'detail', uuid] as const,
};
