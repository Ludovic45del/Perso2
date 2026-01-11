import {Dayjs} from "dayjs";
import FsecDocumentTypeModel from "./referentials/FsecDocumentType.model.ts";
import FsecDocumentSubtypeModel from "./referentials/FsecDocumentSubtype.model.ts";

export default interface FsecDocumentModel {
    path: string
    type?: FsecDocumentTypeModel
    subtype: FsecDocumentSubtypeModel
    uuid?: string
    fsecVersionUuid?: string
    name?: string
    date?: Dayjs
}