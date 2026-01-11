import {Dayjs} from "dayjs";

export default interface FsecRepressurizationStepModel {
    operator: string
    gasType: string
    startDate: Dayjs | null
    estimatedEndDate: Dayjs | null
    sensorPressure: number
    computedPressure: number
}