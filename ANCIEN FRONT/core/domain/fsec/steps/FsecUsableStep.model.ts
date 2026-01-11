import FsecDocumentModel from "../FsecDocument.model.ts";
import FsecTeamModel from "../FsecTeam.model.ts";
import {Dayjs} from "dayjs";

export default interface FsecUsableStepModel {
    deliveryDate: Dayjs | null,
    fsecDocuments: FsecDocumentModel[],
    fsecTeam: FsecTeamModel[],
}