import {Dayjs} from "dayjs";

export default interface FsecDepressurizationStepModel {
    operator: string
    dateOfFulfilment:  Dayjs | null
    pressureGauge: number
    enclosurePressureMeasured: number
    startTime:  Dayjs | null
    endTime:  Dayjs | null
    observations: string
    depressurizationTimeBeforeFiring: number
    computedPressureBeforeFiring: number
}