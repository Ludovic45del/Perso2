import Title from '../Title/Title';
import {Controller, useFormContext} from 'react-hook-form';
import {
    Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteRenderGroupParams,
    AutocompleteRenderInputParams,
    SxProps,
    TextField
} from '@mui/material';
import React, {HTMLAttributes, ReactNode, useState} from 'react';
import {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderOptionState
} from '@mui/material/Autocomplete/Autocomplete';
import Box from "@mui/material/Box";
import {getNextValueIfNestedProperty} from "../../services/utils/getNextValueIfNestedProperty.service.ts";


interface autocompleteOptionProps<Option> {
    options: Option[],
    renderOption?: (props: HTMLAttributes<HTMLLIElement>, option: Option, state: AutocompleteRenderOptionState, ownerState: unknown) => ReactNode,
    getOptionLabel?: (option: Option) => string,
    isOptionEqualToValue?: (option: Option, value: Option) => boolean
    renderTags?: (value: Option[], getTagProps: AutocompleteRenderGetTagProps, ownerState: unknown) => React.ReactNode
    groupBy?: (options: Option) => string
    renderGroup?: (params: AutocompleteRenderGroupParams) => ReactNode
    getOptionDisabled?: (option: Option) => boolean,
}

interface controlledAutocompleteProps extends autocompleteOptionProps<any> {
    title?: string,
    label?: string,
    keyName: string,
    objectName?: string
    isRequired?: boolean,
    validationSchema?: unknown,
    InputProps?: (props: any, field: any) => object,
    onChange?: (optionSelected: any, data?: any, reason?: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any>) => void,
    sx?: SxProps,
    mulitple?: boolean,
    disableCloseOnSelect?: boolean,
    defaultValue?: any
    isDisabled?: boolean
}

export default function ControlledAutocomplete(props: controlledAutocompleteProps) {
    const {formState: {errors}, control, getValues} = useFormContext();

    const [value, setValue] = useState('');

    const error = getNextValueIfNestedProperty(props.keyName, errors)

    return <Box>
        {props.title && <Title title={props.title} variant="h6"/>}
        <Controller
            render={({field}) => (
                <Autocomplete
                    {...field}
                    value={field.value || null}
                    options={props.options}
                    getOptionDisabled={props.getOptionDisabled}
                    getOptionLabel={props.getOptionLabel}
                    isOptionEqualToValue={props.isOptionEqualToValue}
                    renderOption={props.renderOption}
                    inputValue={props.InputProps && field.value ? '' : value}
                    onInputChange={(_, value) => setValue(value)}
                    renderInput={(params: AutocompleteRenderInputParams) =>
                        <TextField {...params}
                                   label={props.label}
                                   size={'small'}
                                   required={props.isRequired}
                                   error={!!error}
                                   helperText={<>{error?.message}</>}
                                   color={error ? 'error' : 'secondary'}
                                   InputProps={props.InputProps ? props.InputProps(params, field) : {...params.InputProps}}
                        />}
                    renderTags={props.renderTags}
                    groupBy={props.groupBy}
                    renderGroup={props.renderGroup}
                    onChange={(_, value, reason, details) =>
                        (props.onChange && props.objectName) ? props.onChange(value, getValues(props.objectName || '')) :
                            props.onChange ? props.onChange(value, field.onChange, reason, details) :
                                field.onChange(value)}
                    size="small"
                    sx={props.sx}
                    multiple={props.mulitple}
                    disableCloseOnSelect={props.disableCloseOnSelect}
                    autoComplete
                    autoHighlight
                    noOptionsText='Vide'
                    disabled={props.isDisabled}
                />
            )}
            name={props.keyName}
            control={control}
            defaultValue={props.defaultValue}
            rules={props.validationSchema}/>
    </Box>;
}

