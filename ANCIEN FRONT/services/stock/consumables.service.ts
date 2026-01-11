import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import ConsumablesGluesModel from "../../core/domain/stock/ConsumablesGluesModel.ts";
import OtherConsumablesModel from "../../core/domain/stock/OtherConsumablesModel.ts";

export function getAllConsumablesGlues(): Promise<ConsumablesGluesModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/get-all-consumables-glues`, requestOptions);
}

export function getAllOtherConsumables(): Promise<OtherConsumablesModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/get-all-other-consumables`, requestOptions);
}

export function deleteConsumablesGlues(uuid: string): Promise<ConsumablesGluesModel[]> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/consumables-glues/${uuid}`, requestOptions);
}

export function deleteOtherConsumables(uuid: string): Promise<OtherConsumablesModel[]> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/other-consumables/${uuid}`, requestOptions);
}

export function createConsumablesGlues(object : ConsumablesGluesModel): Promise<ConsumablesGluesModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/consumables-glues`, requestOptions);
}

export function createOtherConsumables(object: OtherConsumablesModel): Promise<OtherConsumablesModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/other-consumables`, requestOptions);
}
export function addAdditionalCommentToConsumablesGlues(comment: string, uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment, uuid})

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/consumables-glues`, requestOptions);
}
export function addAdditionalCommentToOtherConsumables(comment: string, uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment, uuid})

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/other-consumables`, requestOptions);
}