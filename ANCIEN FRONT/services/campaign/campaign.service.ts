import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import CampaignModel from "../../core/domain/campaign/Campaign.model.ts";


export function getAllCampaigns(): Promise<CampaignModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/`, requestOptions);
}

export function getCampaignByName(campaign_name: string): Promise<CampaignModel> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/${campaign_name}`, requestOptions);
}

export function createCampaign(campaign: CampaignModel): Promise<CampaignModel> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(campaign)
    };

    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/`, requestOptions)
}

export function updateCampaign(campaign: CampaignModel): Promise<CampaignModel> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(campaign)
    };

    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/`, requestOptions)
}

export function deleteCampaign(uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/delete/${uuid}`, requestOptions);
}
