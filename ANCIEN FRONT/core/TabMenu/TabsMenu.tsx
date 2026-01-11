import {Tab, Tabs} from '@mui/material';

import {useEffect} from 'react';
import {TabData} from '../../services/utils/TabsUtils.service';
import {useNavigateCtrl} from '../../hooks/useNavigateCtrl.ts';
import './TabsMenu.scss'
import {useLocation} from "react-router-dom";

interface TabsMenuProps {
    tabsArray: TabData[],
    activeTab: number | false
    setActiveTab: (tab:number) => void;
    depressurizationFailed?: boolean
}

export default function TabsMenu({tabsArray,setActiveTab, activeTab, depressurizationFailed}: TabsMenuProps) {
    const nav = useNavigateCtrl();
    const location = useLocation();

    useEffect(() => {
        const indexTab = tabsArray.findIndex(tab => location.pathname.includes(tab.path));
        if (indexTab > -1) {
            setActiveTab(indexTab)
        }
    }, [location, setActiveTab, tabsArray]);


    return (
        <Tabs
            value={activeTab}
            onChange={(_, nextTab) => setActiveTab(nextTab)}
            sx={{
                marginY: 4,
                '& .MuiTabs-flexContainer': {
                    flexWrap: 'wrap',
                },
            }}
        >
            {tabsArray.map((tab: TabData) => (
                tab.label == 'Represurisation' && depressurizationFailed ?
                <Tab key={tab.label}
                     onClick={(e) => nav(tab.path,e)}
                     disabled={false}
                     label={tab.label}
                />
                    : <Tab key={tab.label}
                           onClick={(e) => nav(tab.path,e)}
                           disabled={tab.isDisabled}
                           label={tab.label}
                    />
            ))}
        </Tabs>
    );

}