import Box from "@mui/material/Box";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import ControlledAutocomplete from "../../../../core/formComponents/ControlledAutocomplete.tsx";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";
import '../CreationModal.scss'
import {useEffect, useState} from "react";
import {getAllCampaignTypes} from "../../../../services/campaign/campaignType.service.ts";
import DataChip from "../../../../core/chip/DataChip.tsx";
import {
    campaignDescriptionValidation,
    campaignEndDateValidation, campaignInstallationValidation,
    campaignNameValidation, campaignSemesterValidation,
    campaignStartDateValidation,
    campaignTypeValidation,
    campaignYearValidation
} from "../campaignSchema.ts";
import {getCampaignInstallationType} from "../../../../services/campaign/campaingInstallation.service.ts";
import ControlledNumberField from "../../../../core/formComponents/ControlledNumberField.tsx";
import CampaignTypeModel from "../../../../core/domain/campaign/referential/CampaignType.model.ts";
import CampaignInstallationModel from "../../../../core/domain/campaign/referential/CampaignInstallation.model.ts";

export default function Overview() {
    const [types, setTypes] = useState<CampaignTypeModel[]>([])
    const [installations, setInstallations] = useState<CampaignInstallationModel[]>([])

    useEffect(() => {
        getAllCampaignTypes().then((types: CampaignTypeModel[]) => {
            setTypes(types);
        })
        getCampaignInstallationType().then((installations: CampaignInstallationModel[]) => {
            setInstallations(installations)
        })
    }, []);


    return <Box className='overview-container'>
        <Box className='general-fields-container'>
            <ControlledTextField
                keyName='name'
                label='Nom'
                title='Nom de la campagne'
                isRequired
                validationSchema={campaignNameValidation}
            />

            <ControlledAutocomplete
                keyName='type'
                options={types}
                title='Type de campagne'
                label='Type'
                isRequired={true}
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
                validationSchema={campaignTypeValidation}
            />

            <ControlledAutocomplete
                keyName='installation'
                options={installations}
                title='Installation'
                label='Installation'
                isRequired={true}
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
                validationSchema={campaignInstallationValidation}
            />

            <ControlledNumberField
                keyName='year'
                label='Année'
                title='Année'
                isRequired
                validationSchema={campaignYearValidation}
            />

            <ControlledAutocomplete
                keyName='semester'
                options={['S1', 'S2']}
                title='Semestre'
                label='Semestre'
                isRequired={true}
                validationSchema={campaignSemesterValidation}
            />

            <ControlledNumberField
                keyName='dtriNumber'
                label='DTRI'
                title='Numéro DTRI'
            />
        </Box>
        <Box className='date-fields-container'>
            <ControlledDatePicker
                label='Début'
                keyName='startDate'
                title='Date de début'
                validationSchema={campaignStartDateValidation}
            />

            <ControlledDatePicker
                label='Fin'
                keyName='endDate'
                title='Date de fin'
                validationSchema={campaignEndDateValidation}
            />
        </Box>

        <Box className='project-team-container'>
            <ControlledTextField
                keyName='campaignTeam.0.name'
                label='MOE'
                title='MOE'
            />
            <ControlledTextField
                keyName='campaignTeam.1.name'
                label='RCE'
                title='RCE'
            />
            <ControlledTextField
                keyName='campaignTeam.2.name'
                label='IEC'
                title='IEC'
            />
        </Box>

        <ControlledTextField
            keyName='description'
            label='Description'
            title='Description'
            multiline
            boxSx={{flexGrow: 1}}
            sx={{
                height: "calc(100% - 32px)",
                "& .MuiInputBase-root": {
                    height: "calc(100% - 32px)",
                    alignItems: "flex-start"
                }
            }}
            validationSchema={campaignDescriptionValidation}
        />
    </Box>

}