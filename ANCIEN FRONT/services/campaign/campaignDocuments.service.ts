import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import {CampaignDocumentsModel} from "../../core/domain/campaign/CampaignDocuments.model.ts";
import CampaignDocumentTypeModel from "../../core/domain/campaign/referential/CampaignDocumentTypes.model.ts";


export function getAllDocumentsByCampaignName(campaign_name: string): Promise<CampaignDocumentsModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/documents/${campaign_name}`, requestOptions);
}

export function getCampaignDocumentType(): Promise<CampaignDocumentTypeModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/documents/type`, requestOptions);
}