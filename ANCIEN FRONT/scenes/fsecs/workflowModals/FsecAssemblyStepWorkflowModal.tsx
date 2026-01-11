import {
    CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_DEFAULT_FORM, CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_MODAL_CONTENT,
    CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_TITLE, CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_WARNING_BUTTON,
    CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_WARNING_MESSAGE,
    CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_WARNING_TITLE
} from "./FsecAssemblyStepWorkflowModal.constants.tsx";
import FormModal from "../../../core/modal/FormModal.tsx";
import {returnToAssembly} from "../../../services/fsec/fsec.service.ts";


interface FsecAssemblyWorkflowtepModalProps {
    isModalOpen: boolean,
    closeModal: () => void
}

export default function FsecAssemblyStepWorkflowModal({isModalOpen, closeModal}: FsecAssemblyWorkflowtepModalProps) {

    return <FormModal title={CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_TITLE}
                      content={CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_MODAL_CONTENT}
                      isFormModalOpen={isModalOpen}
                      closeFormModal={closeModal}
                      isWorkflowReturnModal={true}
                      saveMethod={returnToAssembly}
                      saveNav={`/fsec-details/value/overview`}
                      defaultValueForm={CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_DEFAULT_FORM}
                      titleWarningModal={CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_WARNING_TITLE}
                      messageWarningModal={CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_WARNING_MESSAGE}
                      buttonLabelWarningModal={CREATION_FSEC_ASSEMBLY_WORKFLOW_STEP_WARNING_BUTTON}/>
}