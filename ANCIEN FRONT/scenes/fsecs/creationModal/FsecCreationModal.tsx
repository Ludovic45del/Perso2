import FormModal from "../../../core/modal/FormModal.tsx";
import {
    CREATION_FSEC_DEFAULT_FORM,
    CREATION_FSEC_MODAL_CONTENT,
    CREATION_FSEC_TITLE,
    CREATION_FSEC_WARNING_BUTTON,
    CREATION_FSEC_WARNING_MESSAGE,
    CREATION_FSEC_WARNING_TITLE
} from "./FsecCreationModal.constants.tsx";
import {createFsec} from "../../../services/fsec/fsec.service.ts";

interface FsecCreationModalProps {
    closeModal: () => void
}

export default function FsecCreationModal({closeModal}: FsecCreationModalProps) {

    return <FormModal title={CREATION_FSEC_TITLE}
                      content={CREATION_FSEC_MODAL_CONTENT}
                      isFormModalOpen
                      closeFormModal={closeModal}
                      saveMethod={createFsec}
                      saveNav={`/fsec-details/value/overview`}
                      defaultValueForm={CREATION_FSEC_DEFAULT_FORM}
                      titleWarningModal={CREATION_FSEC_WARNING_TITLE}
                      messageWarningModal={CREATION_FSEC_WARNING_MESSAGE}
                      buttonLabelWarningModal={CREATION_FSEC_WARNING_BUTTON}/>
}