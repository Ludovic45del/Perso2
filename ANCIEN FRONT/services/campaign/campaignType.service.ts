import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import CampaignTypeModel from "../../core/domain/campaign/referential/CampaignType.model.ts";


export function getAllCampaignTypes(): Promise<CampaignTypeModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/type`, requestOptions);
}