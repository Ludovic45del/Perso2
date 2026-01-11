import MetrologyMachineModel from "../referentials/MetrologyMachine.model.ts";
import FsecTeamModel from "../FsecTeam.model.ts";
import FsecDocumentModel from "../FsecDocument.model.ts";
import {Dayjs} from "dayjs";
import FsecRackModel from "../referentials/FsecRack.model.ts";

export default interface FsecMetrologyWorkflowStepModel {
    machine: MetrologyMachineModel,
    comments: string,
    fsecTeam: FsecTeamModel[],
    fsecDocuments: FsecDocumentModel[],
    versionUuid: string,
    date: Dayjs
    rack: FsecRackModel,
}