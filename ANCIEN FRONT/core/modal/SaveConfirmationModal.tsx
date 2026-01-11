import Button from '@mui/material/Button';
import { Modal, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { styleModalBox } from '../../data/ModalTheme';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import { ModalProps } from './DeleteModal';
import ModalTitle from "../../core/modal/ModalTitle.tsx";
import Typography from "@mui/material/Typography";


interface SaveWarningProps  extends ModalProps{
    onSubmit: SubmitHandler<FieldValues>
    title: string
    message: string,
    buttonLabel: string
}


export default function SaveConfirmationModal({isOpen, handleClose, onSubmit, title, message, buttonLabel}: SaveWarningProps) {
    const {handleSubmit} = useFormContext();

    return (
        <Modal
            open={isOpen}
        >
            <Box sx={{...styleModalBox, width: 800}}>
                <ModalTitle title={title} close={() => handleClose('cancelButton')}/>
                <Typography>{message.split('\\\\n').map((line, index) => <p key={index}>{line}</p>)}</Typography>
                <Stack direction='row' display='flex' justifyContent='flex-end' spacing={2} height={32}>
                    <Button onClick={() => handleSubmit(onSubmit)().finally(() => handleClose('saveButton'))}>{buttonLabel}</Button>
                    <Button onClick={() => handleClose('cancelButton')}>Annuler</Button>
                </Stack>
            </Box>
        </Modal>
    );
}