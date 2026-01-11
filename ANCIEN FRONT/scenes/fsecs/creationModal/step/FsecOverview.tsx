import Box from "@mui/material/Box";
import ControlledAutocomplete from "../../../../core/formComponents/ControlledAutocomplete.tsx";
import {useEffect, useState} from "react";
import {getAllCampaigns} from "../../../../services/campaign/campaign.service.ts";
import CampaignModel from "../../../../core/domain/campaign/Campaign.model.ts";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import './FsecOverview.scss'
import {getFsecCategories} from "../../../../services/fsec/fsecCategory.service.ts";
import FsecCategoryModel from "../../../../core/domain/fsec/referentials/FsecCategory.model.ts";
import DataChip from "../../../../core/chip/DataChip.tsx";
import {useFormContext} from "react-hook-form";
import FsecModel from "../../../../core/domain/fsec/Fsec.model.ts";
import {
    fsecCampaignValidation,
    fsecCategoryValidation,
    fsecDescriptionValidation,
    fsecNameValidation
} from "../FsecSchema.tsx";
import CampaignInstallationModel from "../../../../core/domain/campaign/referential/CampaignInstallation.model.ts";

interface CampaignForm {
    uuid: string,
    name: string,
    installation: CampaignInstallationModel,
    year: number
}

export default function FsecOverview() {
    const [campaigns, setCampaigns] = useState<CampaignForm[]>([])
    const [categories, setCategories] = useState<FsecCategoryModel[]>([])
    const {formState:{defaultValues}} = useFormContext<FsecModel>()


    useEffect(() => {
        getAllCampaigns().then((campaigns: CampaignModel[]) => {
            setCampaigns(campaigns.map(campaign => ({
                    name: campaign.name,
                    installation: campaign.installation,
                    uuid: campaign.uuid,
                    year: campaign.year
                })
            ))
        })
        getFsecCategories().then((categories: FsecCategoryModel[]) => setCategories(categories))
    }, []);

    return <Box className="fsec--overview-container">

        <Box>
            <ControlledAutocomplete
                keyName='campaign'
                options={campaigns}
                title='Campagne'
                label='Campagne'
                isRequired
                isOptionEqualToValue={(option, value) => option.uuid === value}
                getOptionLabel={campaign => `${campaign.year}-${campaign.installation.label}_${campaign.name}`}
                validationSchema={fsecCampaignValidation}
            />

            <ControlledTextField
                keyName='name'
                label='Nom'
                title='Nom de la FSEC'
                isRequired
                validationSchema={fsecNameValidation}
            />

            <ControlledAutocomplete
                keyName='category'
                options={categories}
                title='Catégorie'
                label='Catégorie'
                isRequired
                renderOption={(props: any, option: FsecCategoryModel) =>
                    <li {...props}>
                        <DataChip label={option.label} color={option.color}/>
                    </li>
                }
                InputProps={(params: any, field) => ({
                    ...params.InputProps,
                    startAdornment: field.value ?
                        <DataChip label={field.value.label} color={field.value.color}/> : undefined
                })}
                isOptionEqualToValue={(option: FsecCategoryModel, value: FsecCategoryModel) => option.id === value.id}
                getOptionLabel={(option: FsecCategoryModel) => option.label}
                validationSchema={fsecCategoryValidation}
            />

            <ControlledTextField
                keyName='comments'
                label='Remarques'
                title='Remarques'
                multiline
                rowsNumber={5}
                validationSchema={fsecDescriptionValidation}
            />
        </Box>
        <Box>
            {defaultValues.fsecTeam.map((team, index) =>
                <ControlledTextField
                keyName={`fsecTeam.${index}.name`}
                label={team.role.label}
                title={team.role.label}
            />)}

        </Box>
        <Box>
            {defaultValues.fsecDocument.map((fsecDocument, index) => <ControlledTextField
                keyName={`fsecDocument.${index}.path`}
                label='Path'
                title={fsecDocument.subtype.label}
            />)}
        </Box>
    </Box>
}
