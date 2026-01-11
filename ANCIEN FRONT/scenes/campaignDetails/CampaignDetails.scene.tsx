import {CampaignProvider} from "../../hooks/contexts/Campaign.context";
import {Box} from "@mui/material";
import "./CampaignDetails.scene.scss";
import "../scenes.scss";
import {getActiveTab, TabData} from "../../services/utils/TabsUtils.service";
import TabsMenu from "../../core/TabMenu/TabsMenu";
import CampaignDetailsHeader from "./CampaignDetailsHeader/CampaignDetailsHeader";
import {Suspense, useState} from "react";
import {Outlet} from "react-router-dom";
import {CampaignDocumentProvider} from "../../hooks/contexts/CampaignDocument.context";
import {CampaignTeamProvider} from "../../hooks/contexts/CampaignTeam.context";
import UpdateCampaignModal from "./campaignUpdateModal/CampaignUpdateModal.tsx";

export default function CampaignDetailsScene() {
    const tabs: TabData[] = [
        {label: "Overview", path: "overview", stepToRedirectInModal: 0},
        {label: "Documentaire", path: "documentaire", stepToRedirectInModal: 1},
        {label: "CAO", path: "cao", stepToRedirectInModal: 1},
        {label: "Assemblage", path: "assemblage", stepToRedirectInModal:1},
        {label: "Métrologie", path: "metrologie", stepToRedirectInModal: 1},
        {label: "FSEC", path: "fsec", stepToRedirectInModal: 0},
        {label: "FA", path: "fa", stepToRedirectInModal:0},
        {label: "Transport", path: "transport", stepToRedirectInModal:1},
        {label: "Fichiers PALS", path: "fichiers-pals", stepToRedirectInModal:1},
    ];
    const [activeTab, setActiveTab] = useState<number | false>(getActiveTab(tabs));
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)

    return (
        <CampaignProvider>
            <Box className="scene-container">
                <CampaignDetailsHeader openUpdateModal={() => setIsUpdateModalOpen(true)}/>
                <Box className="overview--tab-container">
                    <TabsMenu tabsArray={tabs} activeTab={activeTab} setActiveTab={setActiveTab}></TabsMenu>
                </Box>
                <CampaignTeamProvider>
                    <CampaignDocumentProvider>
                        <Box className="overview--body-container">
                            <hr/>
                            <Suspense>
                                <Outlet/>
                            </Suspense>
                        </Box>
                        {isUpdateModalOpen &&
                            <UpdateCampaignModal isModalOpen={true}
                                                 closeModal={() => setIsUpdateModalOpen(false)}
                                                 stepToRedirect={activeTab ? tabs[activeTab].stepToRedirectInModal : 0}/>}
                    </CampaignDocumentProvider>
                </CampaignTeamProvider>
            </Box>
        </CampaignProvider>
    );
}
