import {Dayjs} from "dayjs";

export default interface FsecGasFillingHighPressureStepModel {
    leakRateDtri: string
    gasType: string
    experimentPressure: number
    operator: string
    observations: string
    dateOfFulfilment: Dayjs | null
    gasBase: number
    gasContainer: number
}