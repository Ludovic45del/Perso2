import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import FsecAssemblyBenchModel from "../../core/domain/fsec/referentials/FsecAssemblyBench.model.ts";


export function getAllAssemblyBenches(): Promise<FsecAssemblyBenchModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/assembly-bench`, requestOptions);
}