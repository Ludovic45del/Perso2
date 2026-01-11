import FsecDetailedModel from "../../domain/fsec/FsecDetailed.model.ts";
import {useNavigate} from "react-router-dom";
import {useSnackBarContext} from "../../../scenes/home/Home.scene.tsx";
import {mapToDate} from "../../../services/utils/utils.service.ts";

import {FormProvider, useForm} from "react-hook-form";
import Box from "@mui/material/Box";
import ControlledAutocomplete from "../../formComponents/ControlledAutocomplete.tsx";
import {
    fsecCategoryValidation,
    fsecDescriptionValidation,
    fsecNameValidation
} from "../../../scenes/fsecs/creationModal/FsecSchema.tsx";
import ControlledTextField from "../../formComponents/ControlledTextField.tsx";
import FsecCategoryModel from "../../domain/fsec/referentials/FsecCategory.model.ts";
import DataChip from "../../chip/DataChip.tsx";
import {useEffect, useState} from "react";
import {getFsecCategories} from "../../../services/fsec/fsecCategory.service.ts";
import {styleModalBox} from "../../../data/ModalTheme.ts";
import ModalTitle from "../ModalTitle.tsx";
import {Modal, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import FsecTeamModel from "../../domain/fsec/FsecTeam.model.ts";
import FsecDocumentModel from "../../domain/fsec/FsecDocument.model.ts";
import {createFsec} from "../../../services/fsec/fsec.service.ts";
import FsecModel from "../../domain/fsec/Fsec.model.ts";

export interface ModalProps {
    isOpen?: boolean,
    handleClose: (reason?: ('saveButton' | 'cancelButton' | 'quitButton')) => void,
    handleUpdate?: () => void
}

interface DuplicateFsecModalProps extends ModalProps {
    message: string,
    fsec: FsecDetailedModel
}

export default function DuplicateFsecModal({
                                               isOpen = true,
                                               handleClose,
                                               message,
                                               fsec
                                           }: DuplicateFsecModalProps) {

    const nav = useNavigate();
    const snackBar = useSnackBarContext()


    const prepareObject = (fsecToMap: FsecDetailedModel) => {

        fsecToMap.lastUpdated = mapToDate(fsecToMap.lastUpdated)
        fsecToMap.createdAt = mapToDate(fsecToMap.createdAt)
        if (!fsecToMap.designStep.fsecTeam) {
            fsecToMap.designStep.fsecTeam = [{name: '', role: {label: 'MOE', id: 0}}, {
                name: '',
                role: {label: 'RCE', id: 1}
            }, {name: '', role: {label: 'IEC', id: 2}}]
        }
        if (!fsecToMap.designStep.fsecDocuments) {
            fsecToMap.designStep.fsecDocuments = [
                {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 0, label: 'Visrad initial'}},
                {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 1, label: 'Vues'}},
                {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 2, label: '.STP Métro'}},
                {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 3, label: 'Fiches Car'}},
                {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 4, label: 'Fiche de réception'}},
                {path: '', type: {id: 0, label: 'DESIGN'}, subtype: {id: 5, label: 'Gamme d’assemblage'}},
            ]
        }


        return fsecToMap
    }

    const [categories, setCategories] = useState<FsecCategoryModel[]>([])


    useEffect(() => {
        getFsecCategories().then((categories: FsecCategoryModel[]) => setCategories(categories))
    }, []);

    const sendData = () => {

        const fsecForm = methods.getValues()

        const fsecToSend: FsecModel = {
            fsecUuid: fsecForm.fsecUuid,
            versionUuid: fsecForm.versionUuid,
            comments: fsecForm.designStep.comments,
            fsecDocument: fsecForm.designStep.fsecDocuments,
            fsecTeam: fsecForm.designStep.fsecTeam,
            campaign: fsecForm.designStep.campaign,
            name: fsecForm.designStep.name,
            category: fsecForm.category,
            status: fsecForm.status,
            toBeDuplicated: true

        }

        createFsec(fsecToSend).then((response: FsecModel) => {
            nav(`/fsec-details/${response.versionUuid}/overview`)
            window.location.reload();
            snackBar.openSnackbar('La FSEC a bien été dupliquée', 'success');

        }).catch(responseError => {
            responseError.json().then((json: any) => {
                snackBar.openSnackbar(json.message, 'error');
            });
        });

    }

    const methods = useForm<any>({
        defaultValues: prepareObject(fsec),
        mode: 'onChange',
    });

    return <Modal open={isOpen} onClose={() => handleClose()}>
        <Box sx={{...styleModalBox, width: 800}}>
            <ModalTitle title='Dupliquer' close={() => handleClose()}/>
            <p>{message}</p>
            <FormProvider {...methods}>
                <Box sx={{height: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <ControlledTextField
                            keyName='designStep.name'
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
                            keyName='designStep.comments'
                            label='Remarques'
                            title='Remarques'
                            multiline
                            rowsNumber={5}
                            validationSchema={fsecDescriptionValidation}
                        />
                    </Box>
                    <Box sx={{height: '100%', display: 'flex', width: '50%', flexDirection: 'column'}}>
                        <Box>
                            {methods?.getValues()?.designStep?.fsecTeam.map((team: FsecTeamModel, index: number) =>
                                <ControlledTextField
                                    keyName={`designStep.fsecTeam.${index}.name`}
                                    label={team.role.label}
                                    title={team.role.label}
                                />)}
                        </Box>
                        <Box>
                            {methods?.getValues()?.designStep?.fsecDocuments.map((fsecDocument: FsecDocumentModel, index: number) =>
                                <>
                                    {fsecDocument.subtype.label == 'Fiches Car' ?
                                        <ControlledTextField
                                            keyName={`designStep.fsecDocuments.${index}.path`}
                                            label='Path'
                                            title={fsecDocument.subtype.label}
                                        />
                                        : <></>}
                                </>
                            )}
                        </Box>
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