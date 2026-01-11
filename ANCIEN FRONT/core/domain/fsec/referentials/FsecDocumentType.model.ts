import FsecDocumentSubtypeModel from "./FsecDocumentSubtype.model.ts";

export default interface FsecDocumentTypeModel {
    id: number,
    label: string
    subtype?: FsecDocumentSubtypeModel[]
}