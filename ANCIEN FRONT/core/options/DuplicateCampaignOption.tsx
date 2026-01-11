import Typography from '@mui/material/Typography';
import {useState} from 'react';
import IconComponent from "./IconComponents.tsx";
import DuplicateCampaignModal from "../modal/stepper/DuplicateCampaignModal.tsx";
import CampaignModel from "../domain/campaign/Campaign.model.ts";


interface DuplicateCampaignOptionProps {
    message: string,
    campaign: CampaignModel
}

export default function DuplicateCampaignOption({message, campaign}:DuplicateCampaignOptionProps) {
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
        {isModalOpen && <DuplicateCampaignModal campaign={campaign} isOpen={isModalOpen} handleClose={handleClose} message={message}/>}
    </>;
}