import {Dayjs} from "dayjs";

export default interface FsecGasFillingLowPressureStepModel {
    leakRateDtri: string
    gasType: string
    experimentPressure: number
    leakTestDuration: number
    operator: string
    observations: string
    dateOfFulfilment: Dayjs | null
    gasBase: number
    gasContainer: number

}