import Title from '../Title/Title';
import {InputProps, SxProps, TextField, Theme} from '@mui/material';
import {HTMLInputTypeAttribute} from 'react';
import {FieldValues, RegisterOptions, useFormContext} from 'react-hook-form';
import Box from "@mui/material/Box";
import {getNextValueIfNestedProperty} from "../../services/utils/getNextValueIfNestedProperty.service.ts";


interface controlledTextFieldProps {
    title?: string,
    label?: string,
    keyName: string,
    isRequired?: boolean,
    validationSchema?: RegisterOptions<FieldValues, string> | undefined,
    multiline?: boolean,
    rowsNumber?: number,
    sx?: SxProps<Theme>,
    type?: HTMLInputTypeAttribute,
    tooltipLabel?: string
    InputProps?: InputProps
    disable?: boolean
    defaultValue?: any
    boxSx?: SxProps<Theme>,
}

export default function ControlledTextField({
                                                title,
                                                label,
                                                keyName,
                                                isRequired,
                                                type,
                                                validationSchema,
                                                multiline,
                                                rowsNumber,
                                                sx,
                                                tooltipLabel,
                                                InputProps,
                                                disable,
                                                defaultValue,
                                                boxSx
                                            }: controlledTextFieldProps) {
    const {register, formState: {errors}} = useFormContext();

    const error = getNextValueIfNestedProperty(keyName, errors)

    return <Box sx={boxSx} key={keyName}>
        {title && <Title title={title} tooltipLabel={tooltipLabel} variant="h6"/>}
        <TextField
            label={label}
            size="small"
            required={isRequired}
            {...register(keyName, validationSchema)}
            error={!!error}
            helperText={error ? <>{error.message}</> : undefined}
            multiline={multiline}
            rows={rowsNumber}
            sx={sx}
            type={type}
            InputProps={InputProps}
            disabled={disable}
            color='secondary'
            defaultValue={defaultValue}
        />
    </Box>;

}