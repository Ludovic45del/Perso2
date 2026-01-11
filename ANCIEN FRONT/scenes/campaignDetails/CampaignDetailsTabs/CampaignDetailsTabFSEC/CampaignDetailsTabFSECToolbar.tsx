import {useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {RestartAlt} from "@mui/icons-material";
import FsecModel from "../../../../core/domain/fsec/Fsec.model.ts";


interface FsecsFiltersProps {
    fsecs: FsecModel[];
    filterFsecs: (
       status: string, category: string
    ) => void;
}

interface FsecFiltersType {
    status: string | null,
    category: string | null,
}

const EMPTY_FILTERS: FsecFiltersType = {
    status: null,
    category: null,
}

export default function CampaignDetailsTabFSECToolbar({fsecs, filterFsecs}: FsecsFiltersProps) {
    const [filters, setFilters] = useState<FsecFiltersType>(EMPTY_FILTERS);

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters((prev) => ({...prev, [key]: value}));
    };

    // Precompute unique options for all fields in a single pass
    const uniqueOptions = fsecs.reduce(
        (acc, fsec) => {
            acc.statuses.add(fsec.status.label);
            acc.categories.add(fsec.category.label);
            return acc;
        },
        {
            statuses: new Set<string>(),
            categories: new Set<string>(),
        }
    );

    useEffect(() => {
        const {status, category} = filters;
        filterFsecs(status, category);
    }, [filters, filterFsecs]);

    function resetFilter() {
        setFilters(EMPTY_FILTERS)
    }

    return (
        <div className="fsecs-toolbar-container">
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
        </div>
    );


}