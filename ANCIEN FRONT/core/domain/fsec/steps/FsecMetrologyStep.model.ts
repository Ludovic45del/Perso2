import MetrologyMachineModel from "../referentials/MetrologyMachine.model.ts";
import FsecTeamModel from "../FsecTeam.model.ts";
import FsecDocumentModel from "../FsecDocument.model.ts";
import {Dayjs} from "dayjs";

export default interface FsecMetrologyStepModel {
    machine: MetrologyMachineModel,
    comments: string,
    fsecTeam: FsecTeamModel[],
    fsecDocuments: FsecDocumentModel[],
    versionUuid: string,
    date: Dayjs

}