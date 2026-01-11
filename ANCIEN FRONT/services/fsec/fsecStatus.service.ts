import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import FsecStatusModel from "../../core/domain/fsec/referentials/FsecStatus.model.ts";


export function getAllFsecStatusByCategory(category: string): Promise<FsecStatusModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(category)
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/status`, requestOptions);
}
