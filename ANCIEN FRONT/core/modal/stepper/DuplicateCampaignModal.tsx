import {Modal, Stack} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useEffect, useState} from "react"
import ModalTitle from "../ModalTitle.tsx";
import {styleModalBox} from "../../../data/ModalTheme.ts";
import CampaignModel from "../../domain/campaign/Campaign.model.ts";
import CampaignTypeModel from "../../domain/campaign/referential/CampaignType.model.ts";
import CampaignInstallationModel from "../../domain/campaign/referential/CampaignInstallation.model.ts";
import {getAllCampaignTypes} from "../../../services/campaign/campaignType.service.ts";
import {getCampaignInstallationType} from "../../../services/campaign/campaingInstallation.service.ts";
import ControlledTextField from "../../formComponents/ControlledTextField.tsx";
import {
    campaignDescriptionValidation,
    campaignEndDateValidation,
    campaignInstallationValidation,
    campaignNameValidation,
    campaignSemesterValidation,
    campaignStartDateValidation,
    campaignTypeValidation,
    campaignYearValidation
} from "../../../scenes/campaigns/creationModal/campaignSchema.ts";
import ControlledAutocomplete from "../../formComponents/ControlledAutocomplete.tsx";
import DataChip from "../../chip/DataChip.tsx";
import ControlledNumberField from "../../formComponents/ControlledNumberField.tsx";
import ControlledDatePicker from "../../formComponents/ControlledDatePicker.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {createCampaign} from "../../../services/campaign/campaign.service.ts";
import {useNavigate} from "react-router-dom";
import {useSnackBarContext} from "../../../scenes/home/Home.scene.tsx";
import {mapToDate} from "../../../services/utils/utils.service.ts";

export interface ModalProps {
    isOpen?: boolean,
    handleClose: (reason?: ('saveButton' | 'cancelButton' | 'quitButton')) => void,
    handleUpdate?: () => void
}

interface DuplicateCampaignModalProps extends ModalProps {
    message: string,
    campaign: CampaignModel
}

export default function DuplicateCampaignModal({
                                                   isOpen = true,
                                                   handleClose,
                                                   message,
                                                   campaign
                                               }: DuplicateCampaignModalProps) {

    const nav = useNavigate();
    const snackBar = useSnackBarContext()


    const prepareObject = (campaignToMap: CampaignModel) => {

        campaignToMap.startDate = mapToDate(campaignToMap.startDate)
        campaignToMap.endDate = mapToDate(campaignToMap.endDate)

        if(!campaignToMap.campaignTeam){
            campaignToMap.campaignTeam = [{name:'', role: {label:'MOE', id: 0}},{name:'', role: {label:'RCE', id: 1}},{name:'', role: {label:'IEC', id:2}}]
        }

        campaignToMap.toBeDuplicated = true

        return campaignToMap
    }

    const sendData = () => {
        createCampaign(methods.getValues()).then((response: CampaignModel) => {
            nav(`/campagne-details/${response.year}-${response.installation.label}_${response.name}/overview`)
            window.location.reload();
            snackBar.openSnackbar('La campagne a bien été dupliquée', 'success');

        }).catch(responseError => {
            responseError.json().then((json: any) => {
                snackBar.openSnackbar(json.message, 'error');
            });
        });
    }
    const [types, setTypes] = useState<CampaignTypeModel[]>([]);
    const [installations, setInstallations] = useState<CampaignInstallationModel[]>([]);

    const methods = useForm<any>({
        defaultValues: prepareObject(campaign),
        mode: 'onChange',
    });

    useEffect(() => {
        getAllCampaignTypes().then((types: CampaignTypeModel[]) => {
            setTypes(types);
        })
        getCampaignInstallationType().then((installations: CampaignInstallationModel[]) => {
            setInstallations(installations)
        })
    }, []);

    return <Modal open={isOpen} onClose={() => handleClose()}>
        <Box sx={{...styleModalBox, width: 800}}>
            <ModalTitle title='Dupliquer' close={() => handleClose()}/>
            <p>{message}</p>
            <FormProvider {...methods}>
                <Box sx={{height: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Box>
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
                    </Box>
                    <Box sx={{height: '100%', display: 'flex', width: '50%', flexDirection: 'column'}}>
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
                </Box>
            </FormProvider>
            <Stack direction='row' display='flex' justifyContent='flex-end' spacing={2} height={32}>
                <Button onClick={() => sendData()}>Dupliquer</Button>
                <Button onClick={() => handleClose()}>Annuler</Button>
            </Stack>
        </Box>
    </Modal>

}