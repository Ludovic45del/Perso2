import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";
import './FsecAssemblage.scss'
import {
    fsecAssemblyEndDateValidation,
    fsecAssemblyStartDateValidation, fsecDescriptionValidation,
} from "../../../fsecs/creationModal/FsecSchema.tsx";
import {useEffect, useState} from "react";
import FsecAssemblyBenchModel from "../../../../core/domain/fsec/referentials/FsecAssemblyBench.model.ts";
import {getAllAssemblyBenches} from "../../../../services/fsec/fsecAssemblyBench.service.ts";
import ControlledAutocomplete from "../../../../core/formComponents/ControlledAutocomplete.tsx";
import Button from "@mui/material/Button";
import {useFormContext} from "react-hook-form";
import dayjs from "dayjs";

export default function FsecAssemblage() {

    const [assemblyBench, setAssemblyBench] = useState<FsecAssemblyBenchModel[]>([]);
    const {setValue, watch} = useFormContext()

    useEffect(() => {
        getAllAssemblyBenches().then((benches: FsecAssemblyBenchModel[]) => {
            setAssemblyBench(benches);
        })
    }, []);

    return <Box className='fsec--assemblage-container'>
        <Box>

            <ControlledTextField
                keyName='assemblyStep.fsecTeam.0.name'
                label='Assembleur'
                title='Assembleur'
            />
            <Button className="assembly--step-button" variant="contained" onClick={() => setValue('assemblyStep.startDate', dayjs(new Date()))}>Commencer assemblage</Button>
            <ControlledDatePicker
                keyName='assemblyStep.startDate'
                label='Début'
                title="Date de début d'assemblage"
                validationSchema={fsecAssemblyStartDateValidation}
                disable={true}
            />
        </Box>
        <Box>
            {(assemblyBench && watch('assemblyStep')?.assemblyBench) && <ControlledAutocomplete
                keyName='assemblyStep.assemblyBench'
                options={assemblyBench}
                label="Banc d'assemblage"
                title="Banc d'assemblage"
                mulitple
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option: FsecAssemblyBenchModel) => option.label}
            />}
        </Box>
        <Box>
            <ControlledTextField
                keyName='assemblyStep.comments'
                label='Remarques'
                title='Remarques'
                multiline
                validationSchema={fsecDescriptionValidation}
            />
            <Button className="assembly--step-button" variant="contained" disabled={watch('assemblyStep')?.startDate?.toString() == null} onClick={() => setValue('assemblyStep.endDate', dayjs(new Date()))}>Assemblage terminé</Button>
            <ControlledDatePicker
                keyName='assemblyStep.endDate'
                label='Fin'
                title="Date de fin d'assemblage"
                validationSchema={fsecAssemblyEndDateValidation}
                disable={true}
            />
        </Box>
    </Box>

}
