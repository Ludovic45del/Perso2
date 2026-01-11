import FsecTeamModel from "../FsecTeam.model.ts";
import {Dayjs} from "dayjs";
import FsecAssemblyBenchModel from "../referentials/FsecAssemblyBench.model.ts";

export default interface FsecAssemblyStepModel {
    startDate: Dayjs | null,
    endDate: Dayjs | null,
    comments: string,
    fsecTeam: FsecTeamModel[],
    assemblyBench: FsecAssemblyBenchModel[],
    versionUuid: string,
}