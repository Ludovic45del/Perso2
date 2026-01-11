import FsecTeamModel from "../FsecTeam.model.ts";
import FsecDocumentModel from "../FsecDocument.model.ts";
import {Dayjs} from "dayjs";

export default interface FsecPicturesStepModel {
    lastUpdated: Dayjs | null,
    comments: string,
    fsecTeam: FsecTeamModel[],
    fsecDocuments: FsecDocumentModel[],
    versionUuid: string,

}