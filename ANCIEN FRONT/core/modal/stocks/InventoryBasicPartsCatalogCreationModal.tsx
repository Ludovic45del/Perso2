import {Modal, Stack} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ModalTitle from "../ModalTitle.tsx";
import {styleModalBox} from "../../../data/ModalTheme.ts";
import ControlledTextField from "../../formComponents/ControlledTextField.tsx";
import ControlledDatePicker from "../../formComponents/ControlledDatePicker.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {useSnackBarContext} from "../../../scenes/home/Home.scene.tsx";
import {createInventoryBasicPartsCatalogModel} from "../../../services/stock/inventory.service.ts";
import {useState} from "react";
import InventoryBasicPartsCatalogModel from "../../domain/stock/InventoryBasicPartsCatalog.ts";

export interface ModalProps {
    isOpen?: boolean,
    handleClose: (reason?: ('saveButton' | 'cancelButton' | 'quitButton')) => void,
    handleUpdate?: () => void,
    updateList?: (list: InventoryBasicPartsCatalogModel[]) => void
}


export default function InventoryBasicPartsCatalogCreationModal({isOpen = true, handleClose, updateList}: ModalProps) {

    const snackBar = useSnackBarContext()
    const [newObject] = useState(null);


    const sendData = () => {
        createInventoryBasicPartsCatalogModel(methods.getValues()).then((response: InventoryBasicPartsCatalogModel[]) => {
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
            <p>Création d'une ligne dans les stocks (Catalogue pièces élémentaires)</p>
            <FormProvider {...methods}>
                <Box sx={{height: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Box>
                            <ControlledTextField
                                keyName='elementName'
                                label='Nom élement'
                                title='Nom élement'
                            />
                            <ControlledTextField
                                keyName='boxNumberOrBoxDescription'
                                label='Numéro boite ou descriptif boite'
                                title='Numéro'
                            />
                            <ControlledTextField
                                keyName='elementsOrTargetDescription'
                                label='Description'
                                title='Description cibles ou éléments'
                            />
                            <ControlledTextField
                                keyName='availability'
                                label='Disponibilité'
                                title='Disponibilité'
                            />
                        </Box>
                    </Box>
                    <Box sx={{height: '100%', display: 'flex', width: '50%', flexDirection: 'column'}}>
                        <Box className='date-fields-container'>
                            <ControlledDatePicker
                                keyName='deliveryDate'
                                label='Date de livraison'
                                title='Date de livraison'
                            />
                            <ControlledDatePicker
                                keyName='exitDate'
                                label='Date de sortie'
                                title='Date de sortie'
                            />
                            <ControlledTextField
                                keyName='usedCampaign'
                                label='Campagne utilisée'
                                title='Campagne utilisée'
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