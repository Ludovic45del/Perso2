import { BASE_API_HREF } from '../../constants';

export function loginServices(username: string, password: string) {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    };
    return fetch(`${BASE_API_HREF}/token/`, requestOptions);
}

export function refreshToken() {
    const item = localStorage.getItem('token');
    if (item === null || !JSON.parse(item).refresh) {
        return Promise.reject('No refresh token found');
    } else {
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({refresh: JSON.parse(item).refresh})
        };
        return fetch(`${BASE_API_HREF}/token/refresh/`, requestOptions)
            .then(data => data.json())
            .then((newToken) => {
                localStorage.setItem('token', JSON.stringify(newToken));
            });
    }
}

/**
 * User Logout.
 * Delete localstorage then redirect user to home page.
 */
export function logout() {
    localStorage.removeItem('token');
    window.location.assign('/');
}