import {Dayjs} from "dayjs";
import CampaignDocumentTypeModel from "./referential/CampaignDocumentTypes.model.ts";
import CampaignDocumentSubtypeModel from "./referential/CampaignDocumentSubtype.model.ts";


export interface CampaignDocumentsModel {
    uuid?: string
    campaign_uuid?: string
    name: string
    path: string
    date?: Dayjs
    type: CampaignDocumentTypeModel
    subtype: CampaignDocumentSubtypeModel
}