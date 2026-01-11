import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import CampaignTeamModel from "../../core/domain/campaign/CampaignTeam.model.ts";

export function getAllTeamMembersByCampaignUUID(campaign_uuid: string): Promise<CampaignTeamModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/campaign/team/${campaign_uuid}`, requestOptions);
}
