import { refreshToken } from '../account/login.services';

export function fetcher(url: string, options: RequestInit = {}) {
    return fetch(url, updateOptions(options))
        .then((response) => {
            if (response.status === 401) {
                // Token expired or no token
                return refreshToken().then(() => fetch(url, updateOptions(options))
                    .then((response) => {
                        if (response.status === 401) {
                            // 401 after refresh : user must be log again
                            window.location.assign('/login');
                        }
                        if (response.ok) {
                            return response.json();
                        } else {
                            Promise.reject(response);
                        }
                    })).then((data) => data).catch(() => {
                    // no refresh possible, we redirect user to loginServices page
                    window.location.assign('/login');
                });
            } else if (response.status < 300) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        });
}

/**
 * Add Access token if exist.
 *
 * @param options
 */
function updateOptions(options: RequestInit) {
    const update = {...options};
    const tokenStorage = localStorage.getItem('token');
    if (tokenStorage) {
        const token = JSON.parse(tokenStorage);
        update.headers = {
            ...update.headers,
            Authorization: `Bearer ${token.access}`,
        };
    }
    return update;
}