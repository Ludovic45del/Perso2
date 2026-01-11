import { Modal, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { styleModalBox } from '../../data/ModalTheme';
import Button from '@mui/material/Button';
import ModalTitle from "../../core/modal/ModalTitle.tsx";
import {MouseEvent} from "react"
import CampaignModel from "../domain/campaign/Campaign.model.ts";

export interface ModalProps {
    isOpen?: boolean
    handleClose: (reason?: ( 'saveButton'|'cancelButton' | 'quitButton')) => void
    campaignRow?: CampaignModel
    handleUpdate?: () => void
}

interface DeleteModalProps extends ModalProps{
    message: string,
    deleteMethod: (event?: MouseEvent<HTMLButtonElement>) => void
}

export default function DeleteModal({isOpen=true, handleClose, message, deleteMethod}: DeleteModalProps)  {

    return <Modal open={isOpen} onClose={() => handleClose()} >
            <Box sx={{...styleModalBox, width: 400}}>
                <ModalTitle title='Supprimer' close={() => handleClose()}/>
                <p>{message}</p>
                <Stack direction='row' display='flex' justifyContent='flex-end' spacing={2} height={32}>
                    <Button onClick={deleteMethod}>Supprimer</Button>
                    <Button onClick={() => handleClose()}>Annuler</Button>
                </Stack>
            </Box>
        </Modal>

}