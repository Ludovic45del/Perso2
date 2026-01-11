import Typography from '@mui/material/Typography';
import {useState} from 'react';
import IconComponent from "./IconComponents.tsx";
import AddCommentModal from "../modal/AddCommentModal.tsx";


interface addCommentProps {
    uuid: string
    type: string
    comment: string
}

export default function AddAdditionalCommentOption({uuid, type, comment}:addCommentProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    return <>
        <Typography sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {backgroundColor: 'lightgrey'},
            cursor: 'pointer',
            gap: '0.5em'
        }}
                    padding={1}
                    onClick={() => setIsModalOpen(isOpen => !isOpen )}>
            <IconComponent iconName='AddComment' titleAccess='Ajouter un commentaire'/>
        </Typography>
        {isModalOpen && <AddCommentModal isOpen={isModalOpen} handleClose={handleClose} uuid={uuid} type={type} comment={comment}/>}
    </>;
}