import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import FsecCategoryModel from "../../core/domain/fsec/referentials/FsecCategory.model.ts";


export function getFsecCategories(): Promise<FsecCategoryModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/category`, requestOptions);
}