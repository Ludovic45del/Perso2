import FormModal from "../../../core/modal/FormModal.tsx";

import {updateFsec} from "../../../services/fsec/fsec.service.ts";
import {
    UPDATE_FSEC_MODAL_CONTENT_GASLESS,
    UPDATE_FSEC_MODAL_CONTENT_HIGH_PRESSURE,
    UPDATE_FSEC_MODAL_CONTENT_LOW_AND_HIGH_PRESSURE,
    UPDATE_FSEC_MODAL_CONTENT_LOW_PRESSURE, UPDATE_FSEC_MODAL_CONTENT_LOW_PRESSURE_WITH_PERMEATION,
    UPDATE_FSEC_TITLE,
    UPDATE_FSEC_WARNING_BUTTON,
    UPDATE_FSEC_WARNING_MESSAGE,
    UPDATE_FSEC_WARNING_TITLE
} from "./FsecUpdateModal.constants.tsx";
import {Fragment, useEffect, useState} from "react";
import {useFsecContext} from "../../../hooks/contexts/Fsec.context.tsx";
import FsecActiveModel from "../../../core/domain/fsec/FsecActive.model.ts";
import {FsecRackProvider} from "../../../hooks/contexts/FsecRack.context.tsx";
import {MetrologyMachineProvider} from "../../../hooks/contexts/MetrologyMachine.context.tsx";
import {prepareFsecForUpdateService} from "../../../services/fsec/PrepareFsecForUpdate.service.ts";

interface FsecUpdateModalProps {
    isModalOpen: boolean,
    closeModal: () => void,
    closeModalForWorkflowChange?: (type: string) => void,

}

export default function FsecUpdateModal(props: FsecUpdateModalProps) {
    const {fsec, setFsec} = useFsecContext();
    const [fsecForm, setFsecForm] = useState<FsecActiveModel>(null);

    const get_right_content = () => {
        switch (fsec?.category?.label) {
            case "Sans Gaz":
                return UPDATE_FSEC_MODAL_CONTENT_GASLESS
            case "Avec Gaz HP":
                return UPDATE_FSEC_MODAL_CONTENT_HIGH_PRESSURE
            case "Avec Gaz BP":
                return UPDATE_FSEC_MODAL_CONTENT_LOW_PRESSURE
            case "Avec Gaz BP + HP":
                return UPDATE_FSEC_MODAL_CONTENT_LOW_AND_HIGH_PRESSURE
            case "Avec Gaz Permeation + BP":
                return UPDATE_FSEC_MODAL_CONTENT_LOW_PRESSURE_WITH_PERMEATION
            default:
                break
        }
    }

    useEffect(() => {
        const newFsecObj = structuredClone(fsec);

        const fsecData: FsecActiveModel = prepareFsecForUpdateService(newFsecObj)

        setFsecForm(fsecData);
    }, [fsec]);

    return <FsecRackProvider>
        <MetrologyMachineProvider>
            <Fragment>{
                fsecForm?.versionUuid && <FormModal title={UPDATE_FSEC_TITLE}
                                                    content={get_right_content()}
                                                    isFormModalOpen={props.isModalOpen}
                                                    closeFormModal={props.closeModal}
                                                    saveMethod={updateFsec}
                                                    handleUpdate={(fsec: FsecActiveModel) => {
                                                        setFsec(prevState => {
                                                            return {
                                                                ...prevState,
                                                                assemblyStep: [
                                                                    ...prevState.assemblyStep.filter(step => step.versionUuid !== fsec.assemblyStep.versionUuid),
                                                                    fsec.assemblyStep
                                                                ],
                                                                metrologyStep: [
                                                                    ...prevState.metrologyStep.filter(step => step.versionUuid !== fsec.metrologyStep.versionUuid),
                                                                    fsec.metrologyStep
                                                                ],
                                                                picturesStep: [
                                                                    ...prevState.picturesStep.filter(step => step.versionUuid !== fsec.picturesStep.versionUuid),
                                                                    fsec.picturesStep
                                                                ]
                                                            }
                                                        })
                                                    }}
                                                    defaultValueForm={fsecForm}
                                                    titleWarningModal={UPDATE_FSEC_WARNING_TITLE}
                                                    messageWarningModal={UPDATE_FSEC_WARNING_MESSAGE}
                                                    buttonLabelWarningModal={UPDATE_FSEC_WARNING_BUTTON}
                                                    closeModalForWorkflowChange={props.closeModalForWorkflowChange}
                                                    depressurizationFailed={fsec?.depressurizationFailed}/>
            }
            </Fragment>
        </MetrologyMachineProvider>
    </FsecRackProvider>
}