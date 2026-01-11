import {Modal, Stack} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ModalTitle from "../ModalTitle.tsx";
import {styleModalBox} from "../../../data/ModalTheme.ts";
import ControlledTextField from "../../formComponents/ControlledTextField.tsx";
import ControlledDatePicker from "../../formComponents/ControlledDatePicker.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {useSnackBarContext} from "../../../scenes/home/Home.scene.tsx";
import {useState} from "react";
import StructuringModel from "../../domain/stock/StructuringModel.ts";
import {createStructuring} from "../../../services/stock/structuring.service.ts";

export interface ModalProps {
    isOpen?: boolean,
    handleClose: (reason?: ('saveButton' | 'cancelButton' | 'quitButton')) => void,
    handleUpdate?: () => void,
    updateList?: (list: StructuringModel[]) => void
}


export default function StructuringCreationModal({isOpen = true, handleClose, updateList}: ModalProps) {

    const snackBar = useSnackBarContext()
    const [newObject] = useState(null);


    const sendData = () => {
        createStructuring(methods.getValues()).then((response: StructuringModel[]) => {
            snackBar.openSnackbar('La ligne a bien été créée', 'success');
            updateList(response)
            handleClose()
        }).catch(responseError => {
            responseError.json().then((json: any) => {
                snackBar.openSnackbar(json.message, 'error');
            });
        });
    }

    const methods = useForm<any>({
        defaultValues: newObject,
        mode: 'onChange',
    });


    return <Modal open={isOpen} onClose={() => handleClose()}>
        <Box sx={{...styleModalBox, width: 800}}>
            <ModalTitle title='Création' close={() => handleClose()}/>
            <p>Création d'une ligne dans les stocks (Structurations)</p>
            <FormProvider {...methods}>
                <Box sx={{height: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Box>
                            <ControlledTextField
                                keyName='who'
                                label='Qui'
                                title='Qui'
                            />
                            <ControlledDatePicker
                                label='Date de réalisation'
                                keyName='fulfillmentDate'
                                title='Date de réalisation'
                            />
                            <ControlledTextField
                                keyName='structuringNumber'
                                label='N° de Structuration'
                                title='Numéro'
                            />
                            <ControlledTextField
                                keyName='pamsNumber'
                                label='N° PAMS'
                                title='Numéro'
                            />
                        </Box>
                    </Box>
                    <Box sx={{height: '100%', display: 'flex', width: '50%', flexDirection: 'column'}}>
                        <Box className='date-fields-container'>
                            <ControlledTextField
                                keyName='localisation'
                                label='Emplacement'
                                title='Emplacement'
                            />
                            <ControlledTextField
                                keyName='fsec'
                                label='Edifice cible'
                                title='Edifice cible'
                            />
                            <ControlledDatePicker
                                label="Date d\'utilisation"
                                keyName='usageDate'
                                title="Date d\'utilisation"
                            />
                            <ControlledTextField
                                keyName='comments'
                                label='Remarques'
                                title='Remarques'
                            />
                        </Box>
                    </Box>
                </Box>
            </FormProvider>
            <Stack direction='row' display='flex' justifyContent='flex-end' spacing={2} height={32}>
                <Button onClick={() => sendData()}>Créer</Button>
                <Button onClick={() => handleClose()}>Annuler</Button>
            </Stack>
        </Box>
    </Modal>

}