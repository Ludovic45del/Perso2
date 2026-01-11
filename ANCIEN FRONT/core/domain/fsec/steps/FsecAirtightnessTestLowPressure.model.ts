import {Dayjs} from "dayjs";

export default interface FsecAirtightnessTestLowPressureModel {
    leakRateDtri: string,
    gasType: string,
    experimentPressure: number,
    airtightnessTestDuration: number,
    operator: string,
    dateOfFulfilment: Dayjs | null,
}