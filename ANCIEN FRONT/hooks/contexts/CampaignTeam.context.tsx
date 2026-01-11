import {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import CampaignTeamModel from '../../core/domain/campaign/CampaignTeam.model';
import { getAllTeamMembersByCampaignUUID } from '../../services/campaign/campaignTeam.service';

interface CampaignTeamContextI {
    campaignTeam: CampaignTeamModel[]
    setCampaignTeam: Dispatch<SetStateAction<CampaignTeamModel[]>>
}

const CampaignTeamContext = createContext<CampaignTeamContextI | null>(null);

export function CampaignTeamProvider(props: PropsWithChildren) {
    const [campaignTeam, setCampaignTeam] = useState<CampaignTeamModel[]>([]);
    const {campaignUuid} = useParams<{ campaignUuid: string }>();

    useEffect(() => {
        if (campaignUuid) {
            getAllTeamMembersByCampaignUUID(campaignUuid).then((x: CampaignTeamModel[]) => setCampaignTeam(x));
            
        }
    }, [campaignUuid]);

    return <CampaignTeamContext.Provider value={{campaignTeam: campaignTeam, setCampaignTeam}}>
        {props.children}
    </CampaignTeamContext.Provider>;
}

export const useCampaignTeamContext = () => {
    return useContext(CampaignTeamContext);
};
