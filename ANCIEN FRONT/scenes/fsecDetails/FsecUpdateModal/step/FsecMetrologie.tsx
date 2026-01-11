import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import './FsecMetrologie.scss'
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";
import {useFormContext} from "react-hook-form";
import ControlledAutocomplete from "../../../../core/formComponents/ControlledAutocomplete.tsx";
import DataChip from "../../../../core/chip/DataChip.tsx";
import FsecActiveModel from "../../../../core/domain/fsec/FsecActive.model.ts";
import {
    fsecAssemblyStartDateValidation,
    fsecDescriptionValidation,
} from "../../../fsecs/creationModal/FsecSchema.tsx";
import {useFsecRackContext} from "../../../../hooks/contexts/FsecRack.context.tsx";
import FsecRackModel from "../../../../core/domain/fsec/referentials/FsecRack.model.ts";
import {useMetrologyMachineContext} from "../../../../hooks/contexts/MetrologyMachine.context.tsx";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

export default function FsecMetrologie() {
    const {formState: {defaultValues}} = useFormContext<FsecActiveModel>()
    const {metrologyMachines} = useMetrologyMachineContext();
    const {setValue} = useFormContext()
    const {fsecRacks} = useFsecRackContext();
    const rackOptions: FsecRackModel[] = defaultValues?.rack?.isFull ?
        fsecRacks.concat(defaultValues.rack as FsecRackModel).sort((a, b) => a.id - b.id) :
        fsecRacks
    return <Box className='fsec--metrologie-container'>
        <Box>
            <ControlledTextField
                keyName='metrologyStep.fsecTeam.0.name'
                label='Métrologue'
                title='Métrologue'
            />
            {defaultValues.metrologyStep?.fsecDocuments.map((fsecDocument, index) => <ControlledTextField
                keyName={`metrologyStep.fsecDocuments.${index}.path`}
                label='Path'
                title={fsecDocument.subtype.label}
                key={index}
            />)}
        </Box>
        <Box>
            <ControlledAutocomplete
                keyName='metrologyStep.machine'
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
                keyName='metrologyStep.comments'
                label='Remarques'
                title='Remarques'
                multiline
                validationSchema={fsecDescriptionValidation}
            />
            <Button className="metrology--step-button" variant="contained" onClick={() => setValue('metrologyStep.date', dayjs(new Date()))}>Metrologie Réalisée</Button>
            <ControlledDatePicker
                keyName='metrologyStep.date'
                label='Date métrologie'
                title="Date de Métrologie"
                disable={true}
            />
        </Box>
    </Box>
}
