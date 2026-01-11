import Typography from '@mui/material/Typography';
import {useState} from 'react';
import IconComponent from "./IconComponents.tsx";
import DuplicateFsecModal from "../modal/stepper/DuplicateFsecModal.tsx";
import FsecDetailedModel from "../domain/fsec/FsecDetailed.model.ts";

interface DuplicateFsecOptionProps {
    message: string,
    fsec: FsecDetailedModel
}

export default function DuplicateFsecOption({message, fsec}:DuplicateFsecOptionProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    return <>
        <Typography sx={{
            display: 'flex',
            alignItems: 'center',
            '&:hover': {backgroundColor: 'lightgrey'},
            cursor: 'pointer',
            gap: '0.5em'

        }}
                    padding={1}
                    onClick={() => setIsModalOpen(isOpen => !isOpen )}>
            <IconComponent iconName='ContentCopy' titleAccess='Dupliquer'/>
            Dupliquer
        </Typography>
        {isModalOpen && <DuplicateFsecModal fsec={fsec} isOpen={isModalOpen} handleClose={handleClose} message={message}/>}
    </>;
}