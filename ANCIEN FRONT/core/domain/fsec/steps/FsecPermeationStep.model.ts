import {Dayjs} from "dayjs";

export default interface FsecPermeationStepModel {
    gasType: string
    targetPressure: number
    operator: string
    startDate: Dayjs | null
    estimatedEndDate: Dayjs | null
    sensorPressure: number
    computedShotPressure: number
}