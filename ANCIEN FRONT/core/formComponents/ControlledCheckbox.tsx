import {Checkbox, SxProps} from '@mui/material';
import {Controller, useFormContext} from 'react-hook-form';
import Box from '@mui/material/Box';


interface ControlledCheckboxProps {
    keyname: string,
    objectName?: string
    label?: string,
    onChange?: (isSelected: boolean, data: any, index?: number) => void,
    indeterminate?: boolean
    index? :number
    sx?: SxProps
}

export default function ControlledCheckbox({keyname, label, sx, onChange, objectName, indeterminate, index}: ControlledCheckboxProps) {
    const {control, getValues, watch} = useFormContext();

    return <Controller
        name={keyname}
        control={control}
        defaultValue={false}
        render={({field}) => (<Box display="flex" alignItems="center" flexWrap="nowrap" overflow="hidden" sx={sx}>
                <Checkbox
                    onChange={(e) =>
                        onChange && objectName? onChange(e.target.checked, getValues(objectName), index)
                            :onChange ? onChange(e.target.checked, index)
                                : field.onChange(e.target.checked)}
                    checked={watch(keyname)}
                    indeterminate={indeterminate}
                    color="secondary"
                    size="small"
                />{label}
            </Box>

        )}
    />;
}