import {Modal, Stack} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ModalTitle from "../ModalTitle.tsx";
import {styleModalBox} from "../../../data/ModalTheme.ts";
import ControlledTextField from "../../formComponents/ControlledTextField.tsx";
import ControlledDatePicker from "../../formComponents/ControlledDatePicker.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {useSnackBarContext} from "../../../scenes/home/Home.scene.tsx";
import {createInventoryOmega} from "../../../services/stock/inventory.service.ts";
import {useState} from "react";
import InventoryOmegaModel from "../../domain/stock/InventoryOmegaModel.ts";

export interface ModalProps {
    isOpen?: boolean,
    handleClose: (reason?: ('saveButton' | 'cancelButton' | 'quitButton')) => void,
    handleUpdate?: () => void,
    updateList?: (list: InventoryOmegaModel[]) => void
}


export default function InventoryOmegaCreationModal({isOpen = true, handleClose, updateList}: ModalProps) {

    const snackBar = useSnackBarContext()
    const [newObject] = useState(null);


    const sendData = () => {
        createInventoryOmega(methods.getValues()).then((response: InventoryOmegaModel[]) => {
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
            <p>Création d'une ligne dans les stocks (OMEGA)</p>
            <FormProvider {...methods}>
                <Box sx={{height: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Box>
                            <ControlledTextField
                                keyName='drmnCampaignNumber'
                                label='N° Campagne DRMN'
                                title='Numéro'
                            />
                            <ControlledTextField
                                keyName='iec'
                                label='IEC'
                                title='IEC'
                            />

                            <ControlledTextField
                                keyName='elementsOrTargetDescription'
                                label='Description'
                                title='Description cibles ou éléments'
                            />

                            <ControlledTextField
                                keyName='digitsIfUntaggedElement'
                                label='Nombre'
                                title='Nombre si élément non marqué'
                            />

                            <ControlledTextField
                                keyName='targetsOrElementNumber'
                                label='Numéro'
                                title='Numéro cible ou éléments'
                            />
                        </Box>
                    </Box>
                    <Box sx={{height: '100%', display: 'flex', width: '50%', flexDirection: 'column'}}>
                        <Box className='date-fields-container'>
                            <ControlledTextField
                                keyName='boxNumberOrBoxDescription'
                                label='Numéro'
                                title='Numéro boite ou descriptif boite'
                            />
                            <ControlledTextField
                                keyName='localisation'
                                label='Emplacement'
                                title='Emplacement'
                            />
                            <ControlledDatePicker
                                label='Date de livraison'
                                keyName='deliveryDate'
                                title='Date de livraison'
                            />
                            <ControlledDatePicker
                                keyName='exitDate'
                                label='Date de sortie'
                                title='Date de sortie'
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