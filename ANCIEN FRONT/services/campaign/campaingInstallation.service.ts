import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import CampaignInstallationModel from "../../core/domain/campaign/referential/CampaignInstallation.model.ts";


export function getCampaignInstallationType(): Promise<CampaignInstallationModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/installation`, requestOptions)
}