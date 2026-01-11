import Title from '../Title/Title';
import {Controller, useFormContext} from 'react-hook-form';
import {DesktopTimePicker} from '@mui/x-date-pickers/DesktopTimePicker';
import {Dayjs} from 'dayjs';

interface ControlledTimePickerProps {
    title?: string;
    label: string;
    keyName: string;
    validationSchema?: unknown;
    disabled?: boolean;
}

export default function ControlledTimePicker({
                                                 title,
                                                 label,
                                                 keyName,
                                                 validationSchema,
                                                 disabled
                                             }: ControlledTimePickerProps) {
    const {formState: {errors}, control} = useFormContext();
    // do not show the open picker icon when the control is disabled
    const slots = (disabled ? {openPickerIcon: (): any => null} : {});

    return <>
        {title && <Title title={title} variant="h6"/>}
        <Controller
            name={keyName}
            control={control}
            rules={validationSchema}
            render={({field: {ref, onChange, ...rest}}) => (
                <DesktopTimePicker slotProps={{
                    textField: {
                        size: 'small',
                        color: 'secondary',
                        error: !!errors[keyName],
                        helperText: errors[keyName]?.message?.toString()
                    }
                }}
                                   slots={slots}
                                   timezone="Europe/Paris"
                                   label={label}
                                   onChange={(date: Dayjs) => {
                                       onChange(date);

                                   }}
                                   {...rest} disabled={disabled}
                                   format="HH:mm:ss"/>
            )}/>
    </>;
}