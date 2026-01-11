import Title from '../Title/Title';
import { InputProps, SxProps, TextField, Theme } from '@mui/material';
import { KeyboardEvent, ChangeEvent} from 'react';
import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';
import Box from "@mui/material/Box";
import {getNextValueIfNestedProperty} from "../../services/utils/getNextValueIfNestedProperty.service.ts";


interface controlledNumberFieldProps {
    title?: string,
    label?: string,
    keyName: string,
    isRequired?: boolean,
    validationSchema?: RegisterOptions<FieldValues, string> | undefined,
    sx?: SxProps<Theme>,
    tooltipLabel?: string
    InputProps?: InputProps
    disable?: boolean
    defaultValue?: any
}

export default function ControlledNumberField({
                                                title,
                                                label,
                                                keyName,
                                                isRequired,
                                                validationSchema,
                                                sx,
                                                tooltipLabel,
                                                InputProps,
                                                disable,defaultValue
                                            }: controlledNumberFieldProps) {
    const {register, formState: {errors}, setValue} = useFormContext();

    const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key;
        const input = event.target as HTMLInputElement;
        const value = input.value;


        if (
            key === 'Backspace' ||
            key === 'Delete' ||
            key === 'Tab' ||
            key === 'Escape' ||
            key === 'Enter' ||
            (key === 'a' && event.ctrlKey === true) ||
            (key === 'c' && event.ctrlKey === true) ||
            (key === 'v' && event.ctrlKey === true) ||
            (key === 'x' && event.ctrlKey === true) ||
            (key === 'ArrowLeft' || key === 'ArrowRight')
        ) {
            return;
        }


        if ((key === '.' && value.includes('.')) || (key === ',' && value.includes(','))) {
            event.preventDefault();
            return;
        }

        if ((key === '.' || key === ',') && value === '') {
            event.preventDefault();
            return;
        }

        if (!/[0-9.,]/.test(key)) {
            event.preventDefault();
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/,/g, '.');
        setValue(e.target.name, value);
    };


    const error = getNextValueIfNestedProperty(keyName, errors)

    return <Box>
        {title && <Title title={title} tooltipLabel={tooltipLabel} variant="h6"/>}
        <TextField
            label={label}
            size="small"
            required={isRequired}
            {...register(keyName, {...validationSchema, valueAsNumber: true} as RegisterOptions<FieldValues, string>)}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error ? <>{error?.message}</> : undefined}
            sx={sx}
            color='secondary'
            InputProps={InputProps}
            disabled={disable}
            defaultValue={defaultValue}
        />
    </Box>;

}