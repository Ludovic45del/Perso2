import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import './FsecAssemblage.scss'
import ControlledNumberField from "../../../../core/formComponents/ControlledNumberField.tsx";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";

export default function FsecRepressurization() {

    return <Box sx={{width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
        <Box>
            <ControlledTextField
                keyName='repressurizationStep.operator'
                label='Opérateur'
                title='Opérateur'
            />
            <ControlledTextField
                keyName='repressurizationStep.gasType'
                label='Type de gaz'
                title='Type de gaz'
            />
        </Box>
        <Box>
            <ControlledDatePicker keyName='repressurizationStep.startDate'
                                  label='Début'
                                  title='Début'/>
            <ControlledDatePicker keyName='repressurizationStep.estimatedEndDate'
                                  label='Fin estimée'
                                  title='Fin estimée'/>
        </Box>
        <Box>
            <ControlledNumberField keyName='repressurizationStep.sensorPressure'
                                   label='Pression capteur'
                                   title='Pression capteur'
            />
            <ControlledNumberField keyName='repressurizationStep.computedPressure'
                                   label='Pression calculée'
                                   title='Pression calculée'
            />
        </Box>
    </Box>

}
