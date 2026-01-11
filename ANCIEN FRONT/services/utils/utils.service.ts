import dayjs from "dayjs";


export function mapToDate(date: dayjs.Dayjs | null): dayjs.Dayjs | null{
    return dayjs(date).isValid() ? dayjs(date).add(3, 'hours') : null
}