import {Controller, useFormContext} from 'react-hook-form';
import {Radio, RadioGroup, SxProps} from '@mui/material';

export interface ControlledRadioButtonsGroupProps {
    keyName: string,
    objectName?: string,
    options: string[],
    defaultValue?: string,
    sx?: SxProps,
    onChange?: (optionSelected: any, oldValue: any, index?: number,  setMethod?: (...event: any[]) => void) => void
    index?: number
}


export default function ControlledRadioButtonsGroup({keyName, options, defaultValue, sx, onChange, objectName, index}: ControlledRadioButtonsGroupProps) {
    const {control, getValues, watch} = useFormContext();

    return <Controller
        control={control}
        name={keyName}
        defaultValue={defaultValue}
        render={({field}) => {
            return (
                <RadioGroup {...field}
                            sx={{...sx, display:'flex', flexDirection: 'row', flexWrap: 'nowrap'}}
                            value={watch(keyName)}
                            onChange={(e) =>
                                onChange && objectName? onChange(e.target.value, getValues(objectName), index, field.onChange)
                                :onChange ? onChange(e.target.value, index) : field.onChange(e.target.value)}
                >
                    {options.map((option: string, index) =>
                        <Radio key={index} value={option} size="small" color="secondary" />)}
                </RadioGroup>
            );
        }}
    />;


}