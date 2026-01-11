import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";
import {
    fsecAssemblyWorkflowSEndDateValidation,
    fsecAssemblyWorkflowStartDateValidation,
    fsecDescriptionValidation,
} from "../../creationModal/FsecSchema.tsx";
import {useEffect, useState} from "react";
import FsecAssemblyBenchModel from "../../../../core/domain/fsec/referentials/FsecAssemblyBench.model.ts";
import {getAllAssemblyBenches} from "../../../../services/fsec/fsecAssemblyBench.service.ts";
import ControlledAutocomplete from "../../../../core/formComponents/ControlledAutocomplete.tsx";
import Button from "@mui/material/Button";
import {useFormContext} from "react-hook-form";
import dayjs from "dayjs";

export default function FsecAssemblyStep() {

    const [assemblyBench, setAssemblyBench] = useState<FsecAssemblyBenchModel[]>([]);
    const {setValue, watch} = useFormContext()

    useEffect(() => {
        getAllAssemblyBenches().then((benches: FsecAssemblyBenchModel[]) => {
            setAssemblyBench(benches);
        })
    }, []);

    return <Box sx={{width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr'}}>
        <Box>
            <ControlledTextField
                keyName='fsecTeam.0.name'
                label='Assembleur'
                title='Assembleur'
            />
            <Button className="assembly--step-button" variant="contained"
                    sx={{ margin: '2em 0'}}
                    onClick={() => setValue('startDate', dayjs(new Date()))}>Commencer assemblage</Button>
            <ControlledDatePicker
                keyName='startDate'
                label='Début'
                title="Date de début d'assemblage"
                validationSchema={fsecAssemblyWorkflowStartDateValidation}
                disable={true}
            />
        </Box>
        <Box>
            {assemblyBench && <ControlledAutocomplete
                sx={{ paddingBottom: '16px'}}
                keyName='assemblyBench'
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
                keyName='comments'
                label='Remarques'
                title='Remarques'
                multiline
                validationSchema={fsecDescriptionValidation}
            />
            <Button className="assembly--step-button" variant="contained"
                    sx={{ margin: '2em 0'}}
                    disabled={watch('startDate')?.toString() == null}
                    onClick={() => setValue('endDate', dayjs(new Date()))}>Assemblage terminé</Button>
            <ControlledDatePicker
                keyName='endDate'
                label='Fin'
                title="Date de fin d'assemblage"
                validationSchema={fsecAssemblyWorkflowSEndDateValidation}
                disable={true}
            />
        </Box>
    </Box>

}
