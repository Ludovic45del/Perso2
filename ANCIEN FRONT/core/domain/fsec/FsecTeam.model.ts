import FsecRoleModel from "./referentials/FsecRole.model.ts";

export default interface FsecTeamModel {
    uuid?: string
    fsecVersionUuid?: string
    name: string
    role: FsecRoleModel
}