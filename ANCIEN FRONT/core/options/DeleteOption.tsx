import Typography from '@mui/material/Typography';
import {useState} from 'react';
import IconComponent from "./IconComponents.tsx";
import DeleteModal from "../modal/DeleteModal.tsx";


interface DeleteOptionPros {
    message: string,
    deleteMethod: () => void
    mode?: string
}

export default function DeleteOption({message, deleteMethod, mode}:DeleteOptionPros) {
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
            <IconComponent iconName='DeleteOutlined' titleAccess='Supprimer'/>
            {mode == 'full' ? 'Supprimer' : ''}
        </Typography>
        {isModalOpen && <DeleteModal isOpen={isModalOpen} handleClose={handleClose} message={message} deleteMethod={deleteMethod}/>}
    </>;
}