import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";
import './FsecAssemblage.scss'
import ControlledNumberField from "../../../../core/formComponents/ControlledNumberField.tsx";

export default function FsecAirthightness() {

    return <Box sx={{width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
        <Box>

            <ControlledTextField
                keyName='airthightnessTestLowPressureStep.leakRateDtri'
                label='Taux de fuite DTRI'
                title='Taux de fuite DTRI'
            />
            <ControlledTextField
                keyName='airthightnessTestLowPressureStep.gasType'
                label='Type de gaz'
                title='Type de gaz'

            />
        </Box>
        <Box>
            <ControlledNumberField keyName='airthightnessTestLowPressureStep.airtightnessTestDuration'
                                   label='Durée test d’étanchéité'
                                   title='Durée test d’étanchéité'/>
            <ControlledNumberField keyName='airthightnessTestLowPressureStep.experimentPressure'
                                   label='Pression pour l’expérience'
                                   title='Pression pour l’expérience'
            />
        </Box>
        <Box>
            <ControlledTextField
                keyName='airthightnessTestLowPressureStep.operator'
                label='Opérateur'
                title='Opérateur'

            />
            <ControlledDatePicker
                keyName='airthightnessTestLowPressureStep.dateOfFulfilment'
                label='Réalisé le'
                title='Réalisé le'
            />
        </Box>
    </Box>

}
