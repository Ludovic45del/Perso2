import {Controller, useFormContext} from 'react-hook-form';
import {Switch} from '@mui/material';


interface ControlledSwitchProps {
    keyName: string,
    onChange?: (checked: boolean, setMethod: (...event: any[]) => void) => void
}

export default function ControlledSwitch({keyName, onChange}: ControlledSwitchProps) {
    const {control} = useFormContext();

    return <Controller
        name={keyName}
        control={control}
        render={({field}) => (
            <Switch
                onChange={(e) => onChange ?
                    onChange(e.target.checked, field.onChange) :
                    field.onChange(e.target.checked)}
                checked={field.value}
                color='secondary'
            />
        )}

    />;
}