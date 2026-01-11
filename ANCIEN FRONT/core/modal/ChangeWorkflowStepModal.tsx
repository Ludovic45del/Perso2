import Button from '@mui/material/Button';
import { Modal, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { styleModalBox } from '../../data/ModalTheme';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import { ModalProps } from './DeleteModal';
import ModalTitle from "../../core/modal/ModalTitle.tsx";


interface ChangeWorkflowStepProps  extends ModalProps{
    onSubmit: SubmitHandler<FieldValues>
    title: string
    message: string,
    buttonLabel: string
}


export default function ChangeWorkflowStepModal({isOpen, handleClose, onSubmit, title, message, buttonLabel}: ChangeWorkflowStepProps) {
    const {handleSubmit} = useFormContext();

    return (
        <Modal
            open={isOpen}
        >
            <Box sx={{...styleModalBox, width: 'auto'}}>
                <ModalTitle title={title} close={() => handleClose()}/>
                <p>{message}</p>
                <Stack direction='row' display='flex' justifyContent='flex-end' spacing={2} height={32}>
                    <Button onClick={() => handleSubmit(onSubmit)().finally(() => handleClose())}>{buttonLabel}</Button>
                    <Button onClick={() => handleClose()}>Annuler</Button>
                </Stack>
            </Box>
        </Modal>
    );
}