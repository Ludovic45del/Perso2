import CampaignRoleModel from "./referential/CampaignRole.model.ts";


export default interface CampaignTeamModel {
    uuid?: string
    campaign_uuid?: string
    name: string
    role: CampaignRoleModel
}