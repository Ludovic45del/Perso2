import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";
import './FsecAssemblage.scss'
import ControlledNumberField from "../../../../core/formComponents/ControlledNumberField.tsx";
import ControlledTimePicker from "../../../../core/formComponents/ControlledTimePicker.tsx";

export default function FsecDepressurization() {

    return <Box sx={{width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
        <Box>
            <ControlledTextField
                keyName='depressurizationStep.operator'
                label='Opérateur'
                title='Opérateur'
            />
            <ControlledDatePicker
                keyName='depressurizationStep.dateOfFulfilment'
                label='Réalisé le'
                title='Réalisé le'
            />
            <ControlledNumberField keyName='depressurizationStep.pressureGauge'
                                   label='Pression manomètre'
                                   title='Pression manomètre'/>
        </Box>
        <Box>
            <ControlledNumberField keyName='depressurizationStep.enclosurePressureMeasured'
                                   label='Pression enceinte mesurée'
                                   title='Pression enceinte mesurée'/>
            <ControlledTimePicker keyName='depressurizationStep.startTime'
                                  label='Heure de début'
                                  title='Heure de début'/>
            <ControlledTimePicker keyName='depressurizationStep.endTime'
                                  label='Heure de fin'
                                  title='Heure de fin'/>
        </Box>
        <Box>
            <ControlledNumberField keyName='depressurizationStep.depressurizationTimeBeforeFiring'
                                   label='Durée de depressurisation avant tir'
                                   title='Durée de depressurisation avant tir'/>
            <ControlledNumberField keyName='depressurizationStep.computedPressureBeforeFiring'
                                   label='Pression calculée avant tir'
                                   title='Pression calculée avant tir'/>
            <ControlledTextField
                keyName='depressurizationStep.observations'
                label='Observations'
                title='Observations'
                multiline
            />
        </Box>
    </Box>

}
