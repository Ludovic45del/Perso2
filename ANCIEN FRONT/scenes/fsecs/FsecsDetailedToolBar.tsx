import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Autocomplete, Stack, Switch, TextField} from "@mui/material";
import IconTextField from "../../core/icontextfield/IconTextField.tsx";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import {RestartAlt} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import FsecCreationModal from "./creationModal/FsecCreationModal.tsx";
import FsecModel from "../../core/domain/fsec/Fsec.model.ts";


interface FsecsDetailedFiltersProps {
    fsecs: FsecModel[];
    filterDetailedFsecs: (
        name: string, embase: string, status: string, installation: boolean
    ) => void;
    setIsDetailed: Dispatch<SetStateAction<boolean>>;
    isDetailed: boolean;
}

interface FsecDetailedFiltersType {
    name: string | null,
    embase: string | null,
    status: string | null,
    installation: boolean
}

const EMPTY_FILTERS: FsecDetailedFiltersType = {
    name: '',
    embase: null,
    status: null,
    installation: false,

}

export default function FsecsToolBar({fsecs, filterDetailedFsecs, setIsDetailed, isDetailed}: FsecsDetailedFiltersProps) {
    const [filters, setFilters] = useState<FsecDetailedFiltersType>(EMPTY_FILTERS);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters((prev) => ({...prev, [key]: value}));
    };

    // Precompute unique options for all fields in a single pass
    const uniqueOptions = fsecs.reduce(
        (acc, fsec) => {
            if(fsec.embase) acc.embases.add(fsec.embase);
            acc.statuses.add(fsec.status.label);
            return acc;
        },
        {
            embases: new Set<string>(),
            statuses: new Set<string>(),

        }
    );

    useEffect(() => {
        const {name, embase, status, installation} = filters;
        filterDetailedFsecs(name, embase, status, installation);
    }, [filters, filterDetailedFsecs]);

    function resetFilter() {
        setFilters(EMPTY_FILTERS)
    }

    return (
        <div className="fsecs-toolbar-container">
            <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                <Typography>LMJ</Typography>
                <Switch
                    checked={filters.installation}
                    onChange={(event) => handleFilterChange('installation', event.target.checked)}
                    color='secondary'
                />
                <Typography>OMEGA</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                <Typography>Simplifié</Typography>
                <Switch
                    color='secondary'
                    checked={isDetailed}
                    onChange={(event) => setIsDetailed(event.target.checked) }
                />
                <Typography>Détaillé</Typography>
            </Stack>

            <IconTextField
                onChange={(event) => handleFilterChange('name', event.target.value)}
                value={filters.name}
                label="Nom"
                iconEnd={<SearchIcon/>}
            />

            <Autocomplete
                options={Array.from(uniqueOptions.embases)}
                autoComplete
                disablePortal
                inputValue={filters.embase || ''}
                onInputChange={(_, value) => handleFilterChange('embase', value || null)}
                onChange={(_, value) => handleFilterChange('embase', value)}
                renderInput={(params) => <TextField {...params} label="Embase"/>}
                value={filters.embase}
                size="small"
            />

            <Autocomplete
                options={Array.from(uniqueOptions.statuses)}
                autoComplete
                disablePortal
                inputValue={filters.status || ''}
                onInputChange={(_, value) => handleFilterChange('status', value || null)}
                onChange={(_, value) => handleFilterChange('status', value)}
                renderInput={(params) => <TextField {...params} label="Statut"/>}
                value={filters.status}
                size="small"
            />

            <Button startIcon={<RestartAlt/>} onClick={resetFilter}>
                <span>Réinitialiser</span>
            </Button>
            <Button startIcon={<AddIcon/>}
                onClick={() => setIsModalOpen(true)}
            >
                <span>Ajouter</span>
            </Button>
            {isModalOpen && <FsecCreationModal closeModal={() => setIsModalOpen(false)}/>}
        </div>

    );


}