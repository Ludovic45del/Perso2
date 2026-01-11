import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import CampaignRoleModel from "../../core/domain/campaign/referential/CampaignRole.model.ts";


export function getAllRoles(): Promise<CampaignRoleModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/roles`, requestOptions);
}