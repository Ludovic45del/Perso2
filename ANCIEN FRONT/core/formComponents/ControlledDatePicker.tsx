import Title from '../Title/Title';
import { Controller, useFormContext } from 'react-hook-form';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Box from "@mui/material/Box";
import {getNextValueIfNestedProperty} from "../../services/utils/getNextValueIfNestedProperty.service.ts";

interface controlledDatePickerProps {
    title?: string;
    label: string;
    keyName: string;
    validationSchema?: unknown;
    isRequired?: boolean;
    disable?: boolean
}

export default function ControlledDatePicker({title, label, keyName, validationSchema, isRequired, disable}: controlledDatePickerProps) {
    const {formState: {errors}, control, trigger} = useFormContext();

    const error = getNextValueIfNestedProperty(keyName, errors)
    return <Box>
        {title && <Title title={title} variant="h6"/>}
        <Controller
            name={keyName}
            control={control}
            rules={validationSchema}
            render={({field: {ref, onChange, ...rest}}) => (
                <DesktopDatePicker slotProps={{
                                        textField: {
                                            size: 'small',
                                            color: 'secondary',
                                            error: !!error,
                                            helperText: error?.message?.toString(),
                                            required: isRequired,
                                        }
                                    }}
                                   timezone="Europe/Paris"
                                   label={label}
                                   disabled={disable}
                                   onChange={(date) => {
                                       if (date) {
                                           onChange(dayjs(date).add(3, 'hours'))
                                           if (keyName === 'startDate') trigger('endDate')
                                           if (keyName === 'endDate') trigger('startDate')

                                       }else onChange(null);
                                   }}
                                   {...rest}/>

            )}/>
    </Box>;
}