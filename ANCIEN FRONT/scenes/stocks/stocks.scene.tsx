import { Box } from "@mui/material";
import "../scenes.scss";
import {Suspense, useState} from "react";
import {Outlet} from "react-router-dom";
import Title from "../../core/Title/Title.tsx";
import TabsMenu from "../../core/TabMenu/TabsMenu.tsx";
import {getActiveTab, TabData} from "../../services/utils/TabsUtils.service.ts";
import FileUploadButton from "../../core/fileUpload/fileUploadButton.tsx";

export default function StocksScene() {
    const tabs: TabData[] = [
        {label: "Structuration", path: "structuring"},
        {label: "Consommables", path: "consumables"},
        {label: "Inventaire cibles et éléments", path: "inventory"},
        {label: "Mouvements", path: "transfers"},

    ];
    const [activeTab, setActiveTab] = useState<number | false>(getActiveTab(tabs));
    return (
        <Box className="scene-container">
            <Box sx={{display: 'flex', flexDirection: 'row', gap: '2em', alignItems: 'center', justifyContent: 'space-between'}}>
                <Title title="STOCKS" padding={2} fontWeight="bold"/>
                <FileUploadButton></FileUploadButton>
            </Box>
            <Box className="overview--tab-container">
                <TabsMenu tabsArray={tabs} activeTab={activeTab} setActiveTab={setActiveTab}></TabsMenu>
            </Box>
            <hr/>
            <Box>
                <Suspense>
                    <Outlet/>
                </Suspense>
            </Box>
        </Box>
    );
}