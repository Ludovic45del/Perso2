import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";
import './FsecAssemblage.scss'
import ControlledNumberField from "../../../../core/formComponents/ControlledNumberField.tsx";

export default function FsecHighPressure() {

    return <Box sx={{width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
        <Box>
            <ControlledTextField
                keyName='gasFillingHighPressureStep.leakRateDtri'
                label='Taux de fuite DTRI'
                title='Taux de fuite DTRI'
            />
            <ControlledTextField
                keyName='gasFillingHighPressureStep.gasType'
                label='Type de gaz'
                title='Type de gaz'
            />
            <ControlledNumberField keyName='gasFillingHighPressureStep.experimentPressure'
                                   label='Pression pour l’expérience'
                                   title='Pression pour l’expérience'
            />
        </Box>
        <Box>
            <ControlledDatePicker
                keyName='gasFillingHighPressureStep.dateOfFulfilment'
                label='Réalisé le'
                title='Réalisé le'
            />
            <ControlledNumberField
                keyName='gasFillingHighPressureStep.gasBase'
                label='Embase gaz'
                title='Embase gaz'
            />
            <ControlledNumberField
                keyName='gasFillingHighPressureStep.gasContainer'
                label='Conteneur gaz'
                title='Conteneur gaz'
            />
        </Box>
        <Box>
            <ControlledTextField
                keyName='gasFillingHighPressureStep.operator'
                label='Opérateur'
                title='Opérateur'
            />
            <ControlledTextField
                keyName='gasFillingHighPressureStep.observations'
                label='Observations'
                title='Observations'
                multiline
            />
        </Box>
    </Box>

}
