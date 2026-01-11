import {BaseTextFieldProps, InputAdornment, TextField} from '@mui/material';
import React, {ChangeEvent} from 'react';


interface IconTextFieldProps extends BaseTextFieldProps{
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function IconTextField ({iconStart, iconEnd, ...iconTextFieldProps}: IconTextFieldProps) {
    return (
        <TextField
            size= 'small'
            {...iconTextFieldProps}
            color= 'secondary'
            InputProps={{
                startAdornment: iconStart ? (
                    <InputAdornment position="start">{iconStart}</InputAdornment>
                ) : null,
                endAdornment: iconEnd ? (
                    <InputAdornment position="end">{iconEnd}</InputAdornment>
                ) : null
            }}

        />
    );
}