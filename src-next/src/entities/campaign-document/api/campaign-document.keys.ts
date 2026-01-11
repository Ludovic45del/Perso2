/**
 * Campaign Document Query Keys
 * @module entities/campaign-document/api
 */

export const campaignDocumentKeys = {
    all: ['campaign-documents'] as const,
    byCampaign: (campaignUuid: string) => [...campaignDocumentKeys.all, 'campaign', campaignUuid] as const,
    detail: (uuid: string) => [...campaignDocumentKeys.all, 'detail', uuid] as const,
};
