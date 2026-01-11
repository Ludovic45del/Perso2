/**
 * Case Transformation Utilities
 * @module shared/lib/caseTransform
 * 
 * Provides recursive conversion between camelCase and snake_case for API communication.
 * Used to standardize data transformation between frontend (camelCase) and backend (snake_case).
 */

/**
 * Converts a camelCase string to snake_case
 * @example camelToSnakeKey('startDate') => 'start_date'
 */
export function camelToSnakeKey(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converts a snake_case string to camelCase
 * @example snakeToCamelKey('start_date') => 'startDate'
 */
export function snakeToCamelKey(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Recursively converts all keys of an object from camelCase to snake_case
 * Handles nested objects and arrays.
 * 
 * @example
 * camelToSnake({ startDate: '2024-01-01', endDate: null })
 * // => { start_date: '2024-01-01', end_date: null }
 */
export function camelToSnake<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => camelToSnake(item)) as T;
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            const snakeKey = camelToSnakeKey(key);
            result[snakeKey] = camelToSnake(value);
        }
        return result as T;
    }

    return obj;
}

/**
 * Recursively converts all keys of an object from snake_case to camelCase
 * Handles nested objects and arrays.
 * 
 * @example
 * snakeToCamel({ start_date: '2024-01-01', end_date: null })
 * // => { startDate: '2024-01-01', endDate: null }
 */
export function snakeToCamel<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => snakeToCamel(item)) as T;
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            const camelKey = snakeToCamelKey(key);
            result[camelKey] = snakeToCamel(value);
        }
        return result as T;
    }

    return obj;
}
