import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import './FsecAssemblage.scss'
import ControlledNumberField from "../../../../core/formComponents/ControlledNumberField.tsx";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";

export default function FsecPermeation() {

    return <Box sx={{width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
        <Box>
            <ControlledTextField
                keyName='permeationStep.gasType'
                label='Type de gaz'
                title='Type de gaz'
            />
            <ControlledNumberField keyName='permeationStep.targetPressure'
                                   label='Pression visée'
                                   title='Pression visée'
            />
            <ControlledTextField
                keyName='permeationStep.operator'
                label='Opérateur'
                title='Opérateur'
            />
        </Box>
        <Box>
            <ControlledDatePicker
                keyName='permeationStep.startDate'
                label='Début'
                title='Début'
            />
            <ControlledDatePicker keyName='permeationStep.estimatedEndDate'
                                  label='Fin estimée'
                                  title='Fin estimée'/>
        </Box>
        <Box>
            <ControlledNumberField keyName='permeationStep.sensorPressure'
                                   label='Pression capteur'
                                   title='Pression capteur'
            />
            <ControlledNumberField keyName='permeationStep.computedShotPressure'
                                   label='Pression calculée tir'
                                   title='Pression calculée tir'
            />
        </Box>
    </Box>

}
