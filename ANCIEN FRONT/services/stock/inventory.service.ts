import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import InventoryBasicPartsCatalogModel from "../../core/domain/stock/InventoryBasicPartsCatalog.ts";
import InventoryEcStructuringModel from "../../core/domain/stock/InventoryEcStructuringModel.ts";
import InventoryLmjModel from "../../core/domain/stock/InventoryLmjModel.ts";
import InventoryOmegaModel from "../../core/domain/stock/InventoryOmegaModel.ts";


export function getAllInventoryBasicPartsCatalog(): Promise<InventoryBasicPartsCatalogModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/get-all-inventory-basic-parts-catalog`, requestOptions);
}

export function getAllInventoryEcStructuring(): Promise<InventoryEcStructuringModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/get-all-inventory-ec-structuring`, requestOptions);
}

export function getAllInventoryLmj(): Promise<InventoryLmjModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/get-all-inventory-lmj`, requestOptions);
}

export function getAllInventoryOmega(): Promise<InventoryOmegaModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/get-all-inventory-omega`, requestOptions);
}

export function deleteInventoryBasicPartsCatalog(uuid: string): Promise<InventoryBasicPartsCatalogModel[]> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-basic-parts-catalog/${uuid}`, requestOptions);
}

export function deleteInventoryEcStructuring(uuid: string): Promise<InventoryEcStructuringModel[]> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-ec-structuring/${uuid}`, requestOptions);
}

export function deleteInventoryLmj(uuid: string): Promise<InventoryLmjModel[]> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-lmj/${uuid}`, requestOptions);
}

export function deleteInventoryOmega(uuid: string): Promise<InventoryOmegaModel[]> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-omega/${uuid}`, requestOptions);
}

export function createInventoryBasicPartsCatalogModel(object : InventoryBasicPartsCatalogModel): Promise<InventoryBasicPartsCatalogModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-basic-parts-catalog`, requestOptions);
}

export function createInventoryEcStructuring(object : InventoryEcStructuringModel): Promise<InventoryEcStructuringModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-ec-structuring`, requestOptions);
}

export function createInventoryLmj(object : InventoryLmjModel): Promise<InventoryLmjModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-lmj`, requestOptions);
}

export function createInventoryOmega(object : InventoryOmegaModel): Promise<InventoryOmegaModel[]> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-omega`, requestOptions);
}

export function addAdditionalCommentToBasicParts(comment: string, uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment, uuid})

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-basic-parts-catalog`, requestOptions);
}

export function addAdditionalCommentToEcStructuring(comment: string, uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment, uuid})

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-ec-structuring`, requestOptions);
}
export function addAdditionalCommentToInventoryLmj(comment: string, uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment, uuid})

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-lmj`, requestOptions);
}
export function addAdditionalCommentToInventoryOmega(comment: string, uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment, uuid})

    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/inventory-omega`, requestOptions);
}