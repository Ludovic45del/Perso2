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
import ConsumablesGluesModel from "../../domain/stock/ConsumablesGluesModel.ts";
import {createConsumablesGlues} from "../../../services/stock/consumables.service.ts";

export interface ModalProps {
    isOpen?: boolean,
    handleClose: (reason?: ('saveButton' | 'cancelButton' | 'quitButton')) => void,
    handleUpdate?: () => void,
    updateList?: (list: ConsumablesGluesModel[]) => void
}


export default function ConsumablesGluesCreationModal({isOpen = true, handleClose, updateList}: ModalProps) {

    const snackBar = useSnackBarContext()
    const [newObject] = useState(null);


    const sendData = () => {
        createConsumablesGlues(methods.getValues()).then((response: ConsumablesGluesModel[]) => {
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
            <p>Création d'une ligne dans les stocks (Colles)</p>
            <FormProvider {...methods}>
                <Box sx={{height: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Box>
                            <ControlledTextField
                                keyName='item'
                                label='Article'
                                title='Article'
                            />
                            <ControlledTextField
                                keyName='stocks'
                                label='Stock'
                                title='Stock'
                            />

                            <ControlledTextField
                                keyName='unit'
                                label='Unité'
                                title='Unité'
                            />
                            <ControlledDatePicker
                                keyName='expiryDate'
                                label='Date de péremption'
                                title='Date de péremption'
                            />
                        </Box>
                    </Box>
                    <Box sx={{height: '100%', display: 'flex', width: '50%', flexDirection: 'column'}}>
                        <Box className='date-fields-container'>
                            <ControlledTextField
                                keyName='reference'
                                label='Référence'
                                title='Référence'
                            />
                            <ControlledTextField
                                keyName='buyingType'
                                label="Type d\'achat"
                                title="Type d\'achat"
                            />
                            <ControlledTextField
                                keyName='supplier'
                                label='Fournisseur'
                                title='Fournisseur'
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