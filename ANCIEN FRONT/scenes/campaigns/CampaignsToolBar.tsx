import {useEffect, useState} from "react";
import {Autocomplete, Stack, Switch, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconTextField from "../../core/icontextfield/IconTextField.tsx";
import SearchIcon from "@mui/icons-material/Search";
import DataChip from "../../core/chip/DataChip.tsx";
import CampaignModel from "../../core/domain/campaign/Campaign.model.ts";
import Button from "@mui/material/Button";
import {RestartAlt} from "@mui/icons-material";
import CampaignTypeModel from "../../core/domain/campaign/referential/CampaignType.model.ts";
import AddIcon from "@mui/icons-material/Add";
import CampaignCreationModal from "./creationModal/CampaignCreationModal.tsx";


interface CampaignsFiltersProps {
    campaigns: CampaignModel[];
    filterCampaigns: (
        name: string,
        type: CampaignTypeModel,
        status: string,
        semester: string,
        year: number,
        installation: boolean
    ) => void;
}

interface CampaignFiltersType {
    name: string | null,
    semester: string | null,
    year: number | null,
    type: CampaignTypeModel | null,
    status: string | null,
    installation: boolean
}

const EMPTY_FILTERS: CampaignFiltersType = {
    name:'',
    installation: false,
    year: null,
    type: null,
    status: null,
    semester: null
}

export default function CampaignsToolBar({campaigns, filterCampaigns}: CampaignsFiltersProps) {
    const [filters, setFilters] = useState<CampaignFiltersType>(EMPTY_FILTERS);
    const [inputType, setInputType] = useState('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)


    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters((prev) => ({...prev, [key]: value}));
    };

    // Precompute unique options for all fields in a single pass
    const uniqueOptions = campaigns
        .filter(campaign => campaign.installation.label === (filters.installation ? 'OMEGA' : 'LMJ'))
        .reduce(
        (acc, campaign) => {
            acc.years.add(campaign.year);
            acc.semesters.add(campaign.semester);
            acc.types.set(campaign.type.id, campaign.type);
            acc.statuses.add(campaign.status.label);
            return acc;
        },
        {
            years: new Set<number>(),
            semesters: new Set<string>(),
            types: new Map<number, CampaignTypeModel>(),
            statuses: new Set<string>(),
        }
    );

    useEffect(() => {
        const {name, type, status, semester, year, installation} = filters;
        filterCampaigns(name, type, status, semester, year, installation );
    }, [filters, filterCampaigns]);

    function resetFilter() {
        setFilters(EMPTY_FILTERS)
    }

    return (
        <div className="campaigns-toolbar-container">
            <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                <Typography>LMJ</Typography>
                <Switch
                    checked={filters.installation}
                    onChange={(event) => handleFilterChange('installation', event.target.checked)}
                    color='secondary'
                />
                <Typography>OMEGA</Typography>
            </Stack>
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
                options={Array.from(uniqueOptions.semesters)}
                autoComplete
                disablePortal
                inputValue={filters.semester || ''}
                onInputChange={(_, value) => handleFilterChange('semester', value || null)}
                onChange={(_, value) => handleFilterChange('semester', value)}
                renderInput={(params) => <TextField {...params} label="Semestre"/>}
                value={filters.semester}
                size="small"
            />

            <IconTextField
                onChange={(event) => handleFilterChange('name', event.target.value)}
                value={filters.name}
                label="Nom"
                iconEnd={<SearchIcon/>}
            />

            <Autocomplete
                options={Array.from(uniqueOptions.types.values())}
                autoComplete
                disablePortal
                inputValue={filters.type?.label ? '' : (inputType)}
                onInputChange={(_, value) => setInputType(value)}
                onChange={(_, value) => handleFilterChange('type', value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Type"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: filters.type ?
                                <DataChip label={filters.type.label} color={filters.type.color}/> : '',
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <DataChip label={option.label} color={option.color}/>
                    </li>
                )}
                getOptionLabel={(option: CampaignTypeModel) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={filters.type}
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
                    onClick={() => setIsModalOpen(true)}>
                <span>Ajouter</span>
            </Button>
            {isModalOpen && <CampaignCreationModal closeModal={() => setIsModalOpen(false)}/>}
        </div>
    );


}