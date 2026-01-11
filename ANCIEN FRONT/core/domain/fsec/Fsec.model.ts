import {Dayjs} from "dayjs";
import CampaignModel from "../campaign/Campaign.model.ts";
import FsecCategoryModel from "./referentials/FsecCategory.model.ts";
import FsecTeamModel from "./FsecTeam.model.ts";
import FsecStatusModel from "./referentials/FsecStatus.model.ts";
import FsecDocumentModel from "./FsecDocument.model.ts";
import FsecRackModel from "./referentials/FsecRack.model.ts";
import ToDuplicateModel from "../ToDuplicateModel.ts";



export default interface FsecModel extends ToDuplicateModel{
    versionUuid?: string
    fsecUuid?: string,
    campaign: CampaignModel,
    name: string,
    category: FsecCategoryModel,
    status: FsecStatusModel,
    comments?: string,
    lastUpdated?: Dayjs | null,
    startDate?: Dayjs | null,
    isActive?: boolean,
    embase?: string,
    rack?: FsecRackModel,
    local?: string,
    iec?: string,
    tci?: string,
    deliveryDate?: string,
    shootingDate?: string,
    restitution?: string,
    fsecTeam: FsecTeamModel[]
    fsecDocument: FsecDocumentModel[]

}


