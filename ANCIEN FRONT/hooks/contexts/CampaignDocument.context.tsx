import {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {DocumentTypeEnum} from '../../core/enums/documentType.enum';
import {CampaignDocumentsModel} from "../../core/domain/campaign/CampaignDocuments.model.ts";
import {getAllDocumentsByCampaignName} from "../../services/campaign/campaignDocuments.service.ts";

interface CampaignDocumentContextI {
    campaignDocuments: CampaignDocumentsModel[]
    filteredCampaignDocuments: CampaignDocumentsModel[]
    setCampaignDocuments: Dispatch<SetStateAction<CampaignDocumentsModel[]>>
}

const CampaignDocumentContext = createContext<CampaignDocumentContextI | null>(null);

export function CampaignDocumentProvider(props: PropsWithChildren) {
    const [campaignDocuments, setCampaignDocuments] = useState<CampaignDocumentsModel[]>([]);
    const [filteredCampaignDocuments] = useState<CampaignDocumentsModel[]>([])
    const {campaignName} = useParams<{ campaignName: string }>();

    useEffect(() => {
        if (campaignName) {
            getAllDocumentsByCampaignName(campaignName).then((x: CampaignDocumentsModel[]) => setCampaignDocuments(x));
            
        }
    }, [campaignName]);

    return <CampaignDocumentContext.Provider value={{campaignDocuments, filteredCampaignDocuments, setCampaignDocuments}}>
        {props.children}
    </CampaignDocumentContext.Provider>;
}

export const useCampaignDocumentContext = (type?: DocumentTypeEnum) => {
    const context = useContext(CampaignDocumentContext);
    if (!context) {
        throw new Error('useCampaignDocumentContext must be used in CampaignDocumentProvider');
    }
    if (type) {
        context.filteredCampaignDocuments = context.campaignDocuments.filter(obj => obj.type.label === type)
    }
    return context;
};
