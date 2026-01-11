import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import ControlledAutocomplete from "../../../../core/formComponents/ControlledAutocomplete.tsx";
import DataChip from "../../../../core/chip/DataChip.tsx";
import {fsecDescriptionValidation} from "../../creationModal/FsecSchema.tsx";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";
import {useFormContext} from "react-hook-form";
import {useMetrologyMachineContext} from "../../../../hooks/contexts/MetrologyMachine.context.tsx";
import {useFsecRackContext} from "../../../../hooks/contexts/FsecRack.context.tsx";
import FsecRackModel from "../../../../core/domain/fsec/referentials/FsecRack.model.ts";
import FsecMetrologyWorkflowStepModel from "../../../../core/domain/fsec/steps/FsecMetrologyWorkflowStep.model.ts";

export default function FsecMetrologyStep() {
    const {formState: {defaultValues}} = useFormContext<FsecMetrologyWorkflowStepModel>()
    const {metrologyMachines} = useMetrologyMachineContext();
    const {setValue} = useFormContext()
    const {fsecRacks} = useFsecRackContext();

    const rackOptions: FsecRackModel[] = defaultValues?.rack?.isFull ?
        fsecRacks.concat(defaultValues.rack as FsecRackModel).sort((a, b) => a.id - b.id) :
        fsecRacks

    return <Box sx={{width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr'}}>
        <Box sx={{paddingBottom:'16px'}}>
            <ControlledTextField
                sx={{ paddingBottom: '16px'}}
                keyName='fsecTeam.0.name'
                label='Métrologue'
                title='Métrologue'
            />
            {defaultValues.fsecDocuments.map((fsecDocument, index) => <ControlledTextField
                sx={{ paddingBottom: '16px'}}
                keyName={`fsecDocuments.${index}.path`}
                label='Path'
                title={fsecDocument.subtype.label}
                key={index}
            />)}
        </Box>
        <Box>
            <ControlledAutocomplete
                sx={{ paddingBottom: '16px'}}
                keyName='machine'
                options={metrologyMachines}
                title='Machine de métrologie'
                label='Machine de métrologie'
                renderOption={(props: any, option) =>
                    <li {...props}>
                        <DataChip label={option.label} color={option.color}/>
                    </li>
                }
                InputProps={(params: any, field: any) => ({
                    ...params.InputProps,
                    startAdornment: field.value ?
                        <DataChip label={field.value.label} color={field.value.color}/> : undefined
                })}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={option => option.label}
            />
            <ControlledAutocomplete
                keyName='rack'
                options={rackOptions}
                label='Conteneur ou rack'
                title='Conteneur ou rack'
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option: FsecRackModel) => option.label}
                getOptionDisabled={(option: FsecRackModel) => option.isFull}
            />
        </Box>
        <Box>
            <ControlledTextField
                sx={{ paddingBottom: '16px'}}
                keyName='comments'
                label='Remarques'
                title='Remarques'
                multiline
                validationSchema={fsecDescriptionValidation}
            />
            <Button sx={{ margin: '2em 0'}} variant="contained" onClick={() => setValue('date', dayjs(new Date()))}>Metrologie Réalisée</Button>
            <ControlledDatePicker
                keyName='date'
                label='Date métrologie'
                title="Date de Métrologie"
                disable={true}
            />
        </Box>
    </Box>

}
