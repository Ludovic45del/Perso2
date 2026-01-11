import CampaignDocumentSubtypeModel from "./CampaignDocumentSubtype.model.ts";

export default interface CampaignDocumentTypeModel {
    id: number,
    label: string
    subtype?: CampaignDocumentSubtypeModel[]
}