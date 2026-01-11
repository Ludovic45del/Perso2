import FsecDocumentModel from "../FsecDocument.model.ts";
import {Dayjs} from "dayjs";

export default interface FsecInstalledStepModel {
    shootingDate: Dayjs | null,
    preshootingPressure: number,
    experienceSRxx: string,
    fsecDocuments: FsecDocumentModel[],
}