import {Box} from "@mui/material";
import {getActiveTab, TabData} from "../../../../services/utils/TabsUtils.service.ts";
import TabsMenu from "../../../../core/TabMenu/TabsMenu.tsx";
import {Suspense, useState} from "react";
import {Outlet} from "react-router-dom";

export default function ConsumablesTabMenuScene() {
    const tabs: TabData[] = [
        {label: "Colles", path: "glues"},
        {label: "Autres consommables", path: "other"},

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