import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";

export function uploadFile(formData: FormData): Promise<any> {
    const requestOptions: RequestInit = {
        method: 'POST',
        body: formData
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/stocks/upload-file`, requestOptions);
}