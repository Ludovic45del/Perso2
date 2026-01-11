/**
 * SearchInput - Reusable search input component
 * @module shared/ui
 * 
 * This component provides a styled search input with an icon,
 * consistent with the design used in the Documents section.
 */

import { TextField, InputAdornment, SxProps, Theme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    /** Width when not focused */
    width?: number | string;
    /** Width when focused */
    focusWidth?: number | string;
    /** Custom sx overrides */
    sx?: SxProps<Theme>;
}

export function SearchInput({
    value,
    onChange,
    placeholder = 'Rechercher...',
    autoFocus = false,
    width = 200,
    focusWidth = 300,
    sx,
}: SearchInputProps) {
    return (
        <TextField
            size="small"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus={autoFocus}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                ),
                sx: {
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 1
                    },
                    height: 40,
                    width: width,
                    transition: 'all 0.2s',
                    '&:focus-within': {
                        width: focusWidth,
                        bgcolor: 'background.paper'
                    },
                    ...sx,
                }
            }}
        />
    );
}
