import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import './FsecAssemblage.scss'
import ControlledNumberField from "../../../../core/formComponents/ControlledNumberField.tsx";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";

export default function FsecLowPressure() {

    return <Box sx={{width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
        <Box>

            <ControlledTextField
                keyName='gasFillingLowPressureStep.leakRateDtri'
                label='Taux de fuite DTRI'
                title='Taux de fuite DTRI'
            />
            <ControlledTextField
                keyName='gasFillingLowPressureStep.gasType'
                label='Type de gaz'
                title='Type de gaz'
            />
            <ControlledNumberField keyName='gasFillingLowPressureStep.experimentPressure'
                                   label='Pression pour l’expérience'
                                   title='Pression pour l’expérience'
            />
        </Box>
        <Box>
            <ControlledNumberField keyName='gasFillingLowPressureStep.leakTestDuration'
                                   label='Durée test étancheité'
                                   title='Durée test étancheité'
            />
            <ControlledTextField
                keyName='gasFillingLowPressureStep.operator'
                label='Opérateur'
                title='Opérateur'
            />
            <ControlledDatePicker
                keyName='gasFillingLowPressureStep.dateOfFulfilment'
                label='Réalisé le'
                title='Réalisé le'
            />
        </Box>
        <Box>
            <ControlledTextField
                keyName='gasFillingLowPressureStep.gasBase'
                label='Embase gaz'
                title='Embase gaz'
            />
            <ControlledTextField
                keyName='gasFillingLowPressureStep.gasContainer'
                label='Conteneur gaz'
                title='Conteneur gaz'
            />
            <ControlledTextField
                keyName='gasFillingLowPressureStep.observations'
                label='Observations'
                title='Observations'
                multiline
            />
        </Box>
    </Box>

}
