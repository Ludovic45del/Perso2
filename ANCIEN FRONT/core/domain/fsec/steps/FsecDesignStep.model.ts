import FsecTeamModel from "../FsecTeam.model.ts";
import FsecDocumentModel from "../FsecDocument.model.ts";
import CampaignModel from "../../campaign/Campaign.model.ts";

export default interface FsecDesignStepModel {
    name: string,
    comments: string,
    campaign: CampaignModel,
    fsecTeam: FsecTeamModel[],
    fsecDocuments: FsecDocumentModel[],
}