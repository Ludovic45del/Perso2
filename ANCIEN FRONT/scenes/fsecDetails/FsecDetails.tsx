import {Box} from "@mui/material";
import "../scenes.scss";
import {getActiveTab, TabData} from "../../services/utils/TabsUtils.service";
import TabsMenu from "../../core/TabMenu/TabsMenu";
import {Suspense, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import FsecDetailsHeader from "./FsecDetailsHeader/FseDetailsHeader.tsx";
import {FsecProvider, useFsecContext} from "../../hooks/contexts/Fsec.context.tsx";
import './FsecDetails.scene.scss';
import FsecUpdateModal from "./FsecUpdateModal/FsecUpdateModal.tsx";
import {STEPS_SEQUENCE_CONSTANTS} from "./STEPS_SEQUENCE_CONSTANTS.ts";
import FsecAssemblyStepWorkflowModal from "../fsecs/workflowModals/FsecAssemblyStepWorkflowModal.tsx";
import FsecMetrologyStepWorkflowModal from "../fsecs/workflowModals/FsecMetrologyStepWorkflowModal.tsx";
import {MetrologyMachineProvider} from "../../hooks/contexts/MetrologyMachine.context.tsx";
import {FsecRackProvider} from "../../hooks/contexts/FsecRack.context.tsx";
import {
    returnToReassembly,
    returnToRepressurization,
    setDepressurizationFailedStatus
} from "../../services/fsec/fsec.service.ts";
import {useNavigateCtrl} from "../../hooks/useNavigateCtrl.ts";
import FsecDetailedModel from "../../core/domain/fsec/FsecDetailed.model.ts";

export default function FsecDetails() {
    const {fsec: {category, depressurizationFailed, versionUuid}} = useFsecContext();
    const [tabs, setTabs] = useState<TabData[]>([]);
    const nav = useNavigateCtrl();

    const sequences = new STEPS_SEQUENCE_CONSTANTS()
    const [activeTab, setActiveTab] = useState<number | false>(getActiveTab(tabs));
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
    const [isAssemblyWorkflowModalOpen, setIsAssemblyWorkflowModalOpen] = useState<boolean>(false)
    const [isMetrologyWorkflowModalOpen, setIsMetrologyWorkflowModalOpen] = useState<boolean>(false)
    const [modalType, setModalType] = useState<string>('')

    useEffect(() => {
        switch (category?.label) {
            case "Sans Gaz":
                setTabs(sequences.gasLessSequence)
                break
            case "Avec Gaz HP":
                setTabs(sequences.gasHighPressureSequence)
                break
            case "Avec Gaz BP":
                setTabs(sequences.gasLowPressureSequence)
                break
            case "Avec Gaz BP + HP":
                setTabs(sequences.gasLowAndHighPressureSequence)
                break
            case "Avec Gaz Permeation + BP":
                setTabs(sequences.gasLowPressureWithPermeationSequence)
                break
            default:
                break
        }
    }, [category]);

    return (
        <FsecProvider>
            <Box className="scene-container">
                <FsecDetailsHeader openUpdateModal={() => setIsUpdateModalOpen(true)} category={category}/>
                <Box className="overview--tab-container">
                    <TabsMenu tabsArray={tabs} activeTab={activeTab} setActiveTab={setActiveTab} depressurizationFailed={depressurizationFailed}></TabsMenu>
                </Box>
                <hr/>
                <Box className="overview--body-container">
                    <Suspense>
                        <Outlet/>
                    </Suspense>
                </Box>
                {isUpdateModalOpen &&
                    <FsecUpdateModal isModalOpen={true}
                                     closeModal={() => setIsUpdateModalOpen(false)}
                                     closeModalForWorkflowChange={(type: string) => {
                                         setModalType(type)

                                         if (type == 'Assembly') {
                                             setIsAssemblyWorkflowModalOpen(true)
                                         }
                                         if (type == 'Metrology') {
                                             setIsMetrologyWorkflowModalOpen(true)
                                         }
                                         if (type == 'Repressurization') {
                                             setDepressurizationFailedStatus(versionUuid)
                                             returnToRepressurization(versionUuid).then((fsec: FsecDetailedModel)=>{

                                                 nav(`/fsec-details/${fsec.versionUuid}/overview`)

                                             })

                                         }
                                         if (type == 'Reassembly') {
                                             returnToReassembly(versionUuid).then((fsec: FsecDetailedModel)=>{

                                                 nav(`/fsec-details/${fsec.versionUuid}/overview`)

                                             })
                                         }

                                     }}/>}
                {(isAssemblyWorkflowModalOpen && modalType == 'Assembly') &&
                    <FsecAssemblyStepWorkflowModal isModalOpen={true}
                                                   closeModal={() => setIsAssemblyWorkflowModalOpen(false)}></FsecAssemblyStepWorkflowModal>

                }
                {(isMetrologyWorkflowModalOpen && modalType == 'Metrology') &&
                    <MetrologyMachineProvider>
                        <FsecRackProvider>
                            <FsecMetrologyStepWorkflowModal isModalOpen={true}
                                                            closeModal={() => setIsMetrologyWorkflowModalOpen(false)}></FsecMetrologyStepWorkflowModal>
                        </FsecRackProvider>
                    </MetrologyMachineProvider>
                }
            </Box>
        </FsecProvider>
    );
}
