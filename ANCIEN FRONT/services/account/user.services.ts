import { fetcher } from '../utils/fetch-utils.service';
import { BASE_API_CIBLE_HREF } from '../../constants';

export function getUsername() {
    return fetcher(`${BASE_API_CIBLE_HREF}/account`);
}
