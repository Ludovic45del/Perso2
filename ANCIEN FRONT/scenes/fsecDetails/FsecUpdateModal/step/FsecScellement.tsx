import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import './FsecScellement.scss'

import ControlledAutocomplete from "../../../../core/formComponents/ControlledAutocomplete.tsx";
import {useFsecRackContext} from "../../../../hooks/contexts/FsecRack.context.tsx";
import {useFormContext} from "react-hook-form";
import FsecActiveModel from "../../../../core/domain/fsec/FsecActive.model.ts";
import FsecRackModel from "../../../../core/domain/fsec/referentials/FsecRack.model.ts";

export default function FsecScellement() {
    const {fsecRacks} = useFsecRackContext();
    const {formState: {defaultValues}} = useFormContext<FsecActiveModel>()
    const rackOptions: FsecRackModel[] = defaultValues?.rack?.isFull ?
        fsecRacks.concat(defaultValues.rack as FsecRackModel).sort((a, b) => a.id - b.id) :
        fsecRacks


    return <Box className='fsec--scellement-container'>
        <ControlledAutocomplete
            keyName='rack'
            options={rackOptions}
            label='Conteneur ou rack'
            title='Conteneur ou rack'
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option: FsecRackModel) => option.label}
        />
        <ControlledTextField
            keyName='sealingStep.interfaceIO'
            label='Interface IO'
            title='Interface IO'
        />
        <ControlledTextField
            keyName='sealingStep.comments'
            label='Remarques'
            title='Remarques'
            multiline
        />
    </Box>
}
