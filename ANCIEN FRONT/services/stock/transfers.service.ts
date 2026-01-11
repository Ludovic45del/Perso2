import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import TransfersModel from "../../core/domain/stock/TransfersModel.ts";


export function getAllTransfers(): Promise<TransfersModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/get-all-transfers`, requestOptions);
}

export function createTransfers(object: TransfersModel): Promise<TransfersModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/transfers`, requestOptions);
}