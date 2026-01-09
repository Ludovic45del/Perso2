/**
 * API Client - Fetch wrapper with error handling and Zod validation
 * @module shared/api
 */

import { ZodSchema } from 'zod';

const API_BASE_URL = '/api/v1';

export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public data?: unknown
    ) {
        super(`API Error: ${status} ${statusText}`);
        this.name = 'ApiError';
    }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

async function request<T>(
    endpoint: string,
    options: RequestOptions = {},
    schema?: ZodSchema<T>
): Promise<T> {
    const { body, ...init } = options;

    const config: RequestInit = {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(response.status, response.statusText, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    const data = await response.json();

    // Validate with Zod schema if provided (Zero Trust)
    if (schema) {
        return schema.parse(data);
    }

    return data as T;
}

export const api = {
    get: <T>(endpoint: string, schema?: ZodSchema<T>) =>
        request<T>(endpoint, { method: 'GET' }, schema),

    post: <T>(endpoint: string, body: unknown, schema?: ZodSchema<T>) =>
        request<T>(endpoint, { method: 'POST', body }, schema),

    put: <T>(endpoint: string, body: unknown, schema?: ZodSchema<T>) =>
        request<T>(endpoint, { method: 'PUT', body }, schema),

    patch: <T>(endpoint: string, body: unknown, schema?: ZodSchema<T>) =>
        request<T>(endpoint, { method: 'PATCH', body }, schema),

    delete: <T>(endpoint: string, schema?: ZodSchema<T>) =>
        request<T>(endpoint, { method: 'DELETE' }, schema),
};
