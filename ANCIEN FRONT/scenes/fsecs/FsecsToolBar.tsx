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


interface FsecsFiltersProps {
    fsecs: FsecModel[];
    filterFsecs: (
        name: string, campaignName : string, status: string, category: string, year: number, installation: boolean
    ) => void;
    setIsDetailed: Dispatch<SetStateAction<boolean>>;
    isDetailed: boolean;
}

interface FsecFiltersType {
    name: string | null,
    campaignName: string | null,
    status: string | null,
    category: string | null,
    year: number | null,
    installation: boolean
}

const EMPTY_FILTERS: FsecFiltersType = {
    name: '',
    campaignName: '',
    status: null,
    category: null,
    year: null,
    installation: false,
}

export default function FsecsToolBar({fsecs, filterFsecs, setIsDetailed, isDetailed}: FsecsFiltersProps) {
    const [filters, setFilters] = useState<FsecFiltersType>(EMPTY_FILTERS);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters((prev) => ({...prev, [key]: value}));
    };

    // Precompute unique options for all fields in a single pass
    const uniqueOptions = fsecs.reduce(
        (acc, fsec) => {
            acc.years.add(fsec.campaign?.year);
            acc.statuses.add(fsec.status.label);
            acc.categories.add(fsec.category.label);
            return acc;
        },
        {
            years: new Set<number>(),
            statuses: new Set<string>(),
            categories: new Set<string>(),
        }
    );

    useEffect(() => {
        const {name, campaignName, status, category, year, installation} = filters;
        filterFsecs(name, campaignName, status, category, year, installation);
    }, [filters, filterFsecs]);

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

            <IconTextField
                onChange={(event) => handleFilterChange('campaignName', event.target.value)}
                value={filters.campaignName}
                label="Campagne associée"
                iconEnd={<SearchIcon/>}
            />

            <Autocomplete
                options={Array.from(uniqueOptions.years)}
                autoComplete
                disablePortal
                inputValue={filters.year?.toString() || ''}
                onInputChange={(_, value) => handleFilterChange('year', value ? Number(value) : null)}
                onChange={(_, value) => handleFilterChange('year', value)}
                renderInput={(params) => <TextField {...params} label="Année"/>}
                getOptionLabel={(option) => option.toString()}
                value={filters.year}
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


            <Autocomplete
                options={Array.from(uniqueOptions.categories)}
                autoComplete
                disablePortal
                inputValue={filters.category || ''}
                onInputChange={(_, value) => handleFilterChange('category', value || null)}
                onChange={(_, value) => handleFilterChange('category', value)}
                renderInput={(params) => <TextField {...params} label="Catégories"/>}
                value={filters.category}
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