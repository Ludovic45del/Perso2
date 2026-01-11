import {Modal, Stack} from '@mui/material';
import Box from '@mui/material/Box';
import {styleModalBox} from '../../data/ModalTheme';
import Button from '@mui/material/Button';
import ModalTitle from "../../core/modal/ModalTitle.tsx";
import {useState} from "react"
import {FormProvider, useForm} from "react-hook-form";
import {
    addAdditionalCommentToBasicParts,
    addAdditionalCommentToEcStructuring,
    addAdditionalCommentToInventoryLmj,
    addAdditionalCommentToInventoryOmega
} from "../../services/stock/inventory.service.ts";
import ControlledTextField from "../formComponents/ControlledTextField.tsx";
import {useSnackBarContext} from "../../scenes/home/Home.scene.tsx";
import {
    addAdditionalCommentToConsumablesGlues,
    addAdditionalCommentToOtherConsumables
} from "../../services/stock/consumables.service.ts";
import {
    addAdditionalCommentToSpecialStructuring,
    addAdditionalCommentToStructuring
} from "../../services/stock/structuring.service.ts";

export interface ModalProps {
    isOpen?: boolean
    handleClose: (reason?: ('saveButton' | 'cancelButton' | 'quitButton')) => void
    uuid: string
    type: string
    comment : string
}

export default function AddCommentModal({isOpen = true, handleClose, uuid, type, comment}: ModalProps) {
    const snackBar = useSnackBarContext()
    const [newObject] = useState({comment: comment});

    const success  = () => {
        snackBar.openSnackbar('Le commentaire à bien été ajouté', 'success');
        handleClose()
        setTimeout(()=>{
            window.location.reload()
        }, 2000)
    }

    const sendData = () => {
        switch (type) {
            case 'basic-parts':
                addAdditionalCommentToBasicParts(methods.getValues('comment'), uuid).then(() => {
                   success()
                })
                break;
            case 'lmj':
                addAdditionalCommentToInventoryLmj(methods.getValues('comment'), uuid).then(() => {
                   success()
                })
                break;
            case 'omega':
                addAdditionalCommentToInventoryOmega(methods.getValues('comment'), uuid).then(() => {
                   success()
                })
                break;
            case 'ec-structuring':
                addAdditionalCommentToEcStructuring(methods.getValues('comment'), uuid).then(() => {
                   success()
                })
                break;
            case 'consumables-glues':
                addAdditionalCommentToConsumablesGlues(methods.getValues('comment'), uuid).then(() => {
                   success()
                })
                break;
            case 'other-consumables':
                addAdditionalCommentToOtherConsumables(methods.getValues('comment'), uuid).then(() => {
                   success()
                })
                break;
            case 'structuring':
                addAdditionalCommentToStructuring(methods.getValues('comment'), uuid).then(() => {
                   success()
                })
                break;
            case 'special-structuring':
                addAdditionalCommentToSpecialStructuring(methods.getValues('comment'), uuid).then(() => {
                    success()
                })
                break;
            default:
                break;
        }

    }

    const methods = useForm<any>({
        defaultValues: newObject,
        mode: 'onChange',
    });

    return <Modal open={isOpen} onClose={() => handleClose()}>
        <Box sx={{...styleModalBox, width: 400}}>
            <ModalTitle title='Ajouter un commentaire' close={() => handleClose()}/>
            <FormProvider {...methods}>
                <Box sx={{margin: '2em 0'}}>
                    <ControlledTextField
                        keyName='comment'
                        label='Commentaire'
                        title='Commentaire'
                        multiline
                        rowsNumber={5}
                        sx={{width: '100%'}}
                    />
                </Box>
            </FormProvider>
            <Stack direction='row' display='flex' justifyContent='flex-end' spacing={2} height={32}>
                <Button onClick={sendData}>Ajouter</Button>
                <Button onClick={() => handleClose()}>Annuler</Button>
            </Stack>
        </Box>
    </Modal>

}