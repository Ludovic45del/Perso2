import {useCampaignContext} from "../../../hooks/contexts/Campaign.context.tsx";
import {Fragment, useEffect, useState} from "react";
import CampaignModel from "../../../core/domain/campaign/Campaign.model.ts";
import FormModal from "../../../core/modal/FormModal.tsx";
import {
    UPDATE_CAMPAIGN_MODAL_CONTENT,
    UPDATE_CAMPAIGN_WARNING_BUTTON,
    UPDATE_CAMPAIGN_WARNING_MESSAGE,
    UPDATE_CAMPAIGN_WARNING_TITLE
} from "./CampaignUpdateModal.constants.tsx";
import {updateCampaign} from "../../../services/campaign/campaign.service.ts";
import {mapToDate} from "../../../services/utils/utils.service.ts";
import {useCampaignTeamContext} from "../../../hooks/contexts/CampaignTeam.context.tsx";
import {useCampaignDocumentContext} from "../../../hooks/contexts/CampaignDocument.context.tsx";


interface CampaignModalProps {
    isModalOpen: boolean,
    closeModal: () => void,
    stepToRedirect: number
}


export default function UpdateCampaignModal(props: CampaignModalProps) {
    const {campaign, setCampaign} = useCampaignContext();
    const {campaignTeam, setCampaignTeam} =useCampaignTeamContext()
    const {campaignDocuments, setCampaignDocuments} = useCampaignDocumentContext()
    const [campaignForm, setCampaignForm] = useState<CampaignModel>(null);

    useEffect(() => {
        const campaignData: CampaignModel = campaign;
        campaignData.startDate = mapToDate(campaign.startDate)
        campaignData.endDate = mapToDate(campaign.endDate)
        campaignData.campaignTeam = campaignTeam
        campaignData.campaignDocuments = campaignDocuments

        setCampaignForm(campaignData);
    }, [campaign, campaignDocuments, campaignTeam]);


    const title: string = `Modification de ${campaign.year}-${campaign.installation.label}_${campaign.name}`;

    return <Fragment>{
        campaignForm?.uuid && <FormModal title={title}
                                        content={UPDATE_CAMPAIGN_MODAL_CONTENT}
                                        openStep={props.stepToRedirect}
                                        isFormModalOpen={props.isModalOpen}
                                        closeFormModal={props.closeModal}
                                        handleUpdate={(campaign: CampaignModel) => {
                                            setCampaign(campaign)
                                            setCampaignDocuments(campaign.campaignDocuments)
                                            setCampaignTeam(campaign.campaignTeam)
                                        }}
                                        saveMethod={updateCampaign}
                                        defaultValueForm={campaignForm}
                                        titleWarningModal={UPDATE_CAMPAIGN_WARNING_TITLE}
                                        messageWarningModal={UPDATE_CAMPAIGN_WARNING_MESSAGE}
                                        buttonLabelWarningModal={UPDATE_CAMPAIGN_WARNING_BUTTON}/>
    }
    </Fragment>
}