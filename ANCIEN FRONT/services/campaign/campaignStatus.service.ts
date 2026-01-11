import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import CampaignStatusModel from "../../core/domain/campaign/referential/CampaignStatus.model.ts";


export function getAllCampaignStatus(): Promise<CampaignStatusModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/status`, requestOptions);
}