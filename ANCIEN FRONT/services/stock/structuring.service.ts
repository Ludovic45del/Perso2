import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import SpecialStructuringModel from "../../core/domain/stock/SpecialStructuringModel.ts";
import StructuringModel from "../../core/domain/stock/StructuringModel.ts";

export function getAllStructuring(): Promise<StructuringModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/get-all-structuring`, requestOptions);
}

export function getAllSpecialStructuring(): Promise<SpecialStructuringModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/get-all-special-structuring`, requestOptions);
}

export function deleteStructuring(uuid: string): Promise<StructuringModel[]> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/structuring/${uuid}`, requestOptions);
}

export function deleteSpecialStructuring(uuid: string): Promise<SpecialStructuringModel[]> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/special-structuring/${uuid}`, requestOptions);
}

export function createStructuring(object: StructuringModel): Promise<StructuringModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/structuring`, requestOptions);
}

export function createSpecialStructuring(object: SpecialStructuringModel): Promise<SpecialStructuringModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/special-structuring`, requestOptions);
}

export function addAdditionalCommentToStructuring(comment: string, uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment, uuid})

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/structuring`, requestOptions);
}
export function addAdditionalCommentToSpecialStructuring(comment: string, uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment, uuid})

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/special-structuring`, requestOptions);
}