import {Box} from "@mui/material";
import {getActiveTab, TabData} from "../../../../services/utils/TabsUtils.service.ts";
import TabsMenu from "../../../../core/TabMenu/TabsMenu.tsx";
import {Suspense, useState} from "react";
import {Outlet} from "react-router-dom";

export default function InventoryTabMenuScene() {
    const tabs: TabData[] = [
        {label: "Catalogue pièce élémentaire", path: "basic-parts-catalog"},
        {label: "Structuration EC", path: "ec-structuring"},
        {label: "Cibles/Elements OMEGA", path: "omega"},
        {label: "Cibles/Elements LMJ", path: "lmj"},

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