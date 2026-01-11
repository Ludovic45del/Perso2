/**
 * Date utilities - Parsing and formatting
 * @module shared/lib
 */

/**
 * Parse ISO date string to Date object
 * Returns null for null/undefined input
 */
export function parseIsoDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
}

/**
 * Format Date to ISO string (date only, no time)
 * Returns null for null input
 */
export function formatDateToIso(date: Date | null | undefined): string | null {
    if (!date) return null;
    return date.toISOString().split('T')[0];
}

/**
 * Format Date for display (French locale)
 */
export function formatDateDisplay(date: Date | null | undefined): string {
    if (!date) return '-';
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
