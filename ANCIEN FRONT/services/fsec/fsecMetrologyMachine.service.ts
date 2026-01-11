import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import MetrologyMachineModel from "../../core/domain/fsec/referentials/MetrologyMachine.model.ts";


export function getAllMetrologyMachinesAvailable(): Promise<MetrologyMachineModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/metrology-machine`, requestOptions);
}