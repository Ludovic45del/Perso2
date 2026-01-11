import FormModal from "../../../core/modal/FormModal.tsx";
import {createCampaign} from "../../../services/campaign/campaign.service.ts";
import {
    CREATION_CAMPAIGN_DEFAULT_FORM,
    CREATION_CAMPAIGN_MODAL_CONTENT,
    CREATION_CAMPAIGN_TITLE, CREATION_CAMPAIGN_WARNING_BUTTON, CREATION_CAMPAIGN_WARNING_MESSAGE,
    CREATION_CAMPAIGN_WARNING_TITLE
} from "./CreationModal.constants.tsx";


interface CampaignCreationModalProps {
    closeModal: () => void
}

export default function CampaignCreationModal({closeModal}: CampaignCreationModalProps) {


    return <FormModal title={CREATION_CAMPAIGN_TITLE}
                      content={CREATION_CAMPAIGN_MODAL_CONTENT}
                      isFormModalOpen={true}
                      closeFormModal={closeModal}
                      saveMethod={createCampaign}
                      saveNav={`/campagne-details/value/overview`}
                      defaultValueForm={CREATION_CAMPAIGN_DEFAULT_FORM}
                      titleWarningModal={CREATION_CAMPAIGN_WARNING_TITLE}
                      messageWarningModal={CREATION_CAMPAIGN_WARNING_MESSAGE}
                      buttonLabelWarningModal={CREATION_CAMPAIGN_WARNING_BUTTON}/>
}