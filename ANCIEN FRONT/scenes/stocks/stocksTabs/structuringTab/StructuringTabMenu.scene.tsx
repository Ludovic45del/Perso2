import {Box} from "@mui/material";
import TabsMenu from "../../../../core/TabMenu/TabsMenu.tsx";
import {Suspense, useState} from "react";
import {getActiveTab, TabData} from "../../../../services/utils/TabsUtils.service.ts";
import {Outlet} from "react-router-dom";


export default function StructuringTabMenuScene() {
    const tabs: TabData[] = [
        {label: "Structurations", path: "basic-structuring"},
        {label: "Structurations spéciales", path: "special-structuring"},
    ];
    const [activeTab, setActiveTab] = useState<number | false>(getActiveTab(tabs));
    return (
        <Box>
            <TabsMenu tabsArray={tabs} activeTab={activeTab} setActiveTab={setActiveTab}></TabsMenu>
            <Box>
                <Suspense>
                    <Outlet/>
                </Suspense>
            </Box>
        </Box>
    );
}