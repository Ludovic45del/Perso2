import {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState} from 'react';
import CampaignModel from '../../core/domain/campaign/Campaign.model';
import {useSnackBarContext} from "../../scenes/home/Home.scene.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {getCampaignByName} from "../../services/campaign/campaign.service.ts";

interface CampaignContextI {
    campaign: CampaignModel
    setCampaign: Dispatch<SetStateAction<CampaignModel>>
}

const CampaignContext = createContext<CampaignContextI | null>(null);
export function CampaignProvider(props: PropsWithChildren) {
    const snackBar = useSnackBarContext()
    const nav = useNavigate()

    const [campaign, setCampaign] = useState<CampaignModel>({} as CampaignModel);
    const {campaignName} = useParams<{ campaignName: string }>();

    useEffect(() => {
        if (campaignName) {
            getCampaignByName(campaignName).then((campaign: CampaignModel) => setCampaign(campaign)).catch(responseError => {
                responseError.json().then((json: any) => {
                    snackBar.openSnackbar(json.message, 'error');
                });
                nav('/campagnes')
            });
        }
    }, [campaignName]);

    return <CampaignContext.Provider value={{campaign, setCampaign}}>
        {props.children}
    </CampaignContext.Provider>;
}

export const useCampaignContext = () => {
    const context = useContext(CampaignContext);

    if (!context) {
        throw new Error('useCampaignContext must be used in CampaignProvider');
    }

    return context;
};
