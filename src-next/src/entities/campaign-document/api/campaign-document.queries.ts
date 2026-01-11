/**
 * Campaign Document Queries
 * @module entities/campaign-document/api
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/api';
import { CampaignDocumentListSchema, CampaignDocument } from '../model';
import { campaignDocumentKeys } from './campaign-document.keys';

/**
 * Fetch documents for a campaign
 */
export function useCampaignDocuments(campaignUuid: string) {
    return useQuery({
        queryKey: campaignDocumentKeys.byCampaign(campaignUuid),
        queryFn: async (): Promise<CampaignDocument[]> => {
            // URL: /campaign-documents/campaign/{uuid}/
            const data = await api.get(`/campaign-documents/campaign/${campaignUuid}/`);
            return CampaignDocumentListSchema.parse(data);
        },
        enabled: Boolean(campaignUuid),
    });
}
