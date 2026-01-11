import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import FsecRackModel from "../../core/domain/fsec/referentials/FsecRack.model.ts";


export function getAllFsecRacks(): Promise<FsecRackModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/racks`, requestOptions);
}