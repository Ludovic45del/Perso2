/**
 * DataChip Component - Colored Chip for Types/Status
 * @module widgets/data-chip
 * 
 * Source: Legacy src/core/chip/DataChip.tsx
 */

import { Chip, ChipProps } from '@mui/material';

interface DataChipProps extends Omit<ChipProps, 'color'> {
    label: string;
    color?: string | null;
}

export function DataChip({ label, color, sx, ...props }: DataChipProps) {
    return (
        <Chip
            label={label}
            size="small"
            sx={{
                backgroundColor: color ?? '#e0e0e0',
                color: getContrastColor(color ?? '#e0e0e0'),
                fontWeight: 500,
                ...sx,
            }}
            {...props}
        />
    );
}

/**
 * Get contrasting text color for readability
 */
function getContrastColor(hexColor: string): string {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
}
