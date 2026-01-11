import {Dayjs} from "dayjs";
import CampaignStatusModel from "./referential/CampaignStatus.model.ts";
import CampaignTypeModel from "./referential/CampaignType.model.ts";
import CampaignInstallationModel from "./referential/CampaignInstallation.model.ts";
import CampaignTeamModel from "./CampaignTeam.model.ts";
import {CampaignDocumentsModel} from "./CampaignDocuments.model.ts";
import ToDuplicateModel from "../ToDuplicateModel.ts";

export default interface CampaignModel extends ToDuplicateModel{
    uuid?: string
    name: string,
    semester: string | null,
    lastUpdate?: Dayjs | null
    year: number,

    status: CampaignStatusModel
    type: CampaignTypeModel
    installation: CampaignInstallationModel
    campaignTeam: CampaignTeamModel[]
    campaignDocuments: CampaignDocumentsModel[]

    startDate: Dayjs | null,
    endDate: Dayjs | null,
    description: string,
    dtriNumber: number | null,

}