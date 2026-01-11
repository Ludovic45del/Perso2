import {useCallback, useEffect, useState} from "react";
import CampaignModel from "../../core/domain/campaign/Campaign.model.ts";
import {getAllCampaigns} from "../../services/campaign/campaign.service.ts";
import Box from "@mui/material/Box";
import Title from "../../core/Title/Title.tsx";
import '../scenes.scss'
import './Campaigns.scene.scss'
import DataTableRow from "../../core/datatable/DataTableRow.tsx";
import CampaignsRows from "../../core/datatable/campaign/rows/CampaignsRow.tsx";
import CampaignTypeModel from "../../core/domain/campaign/referential/CampaignType.model.ts";
import { CAMPAIGNS_COLUMNS } from "../../core/datatable/campaign/CampaignColumnsTable.const.ts";
import CampaignsToolBar from "./CampaignsToolBar.tsx";



export default function CampaignsScene() {
    const [campaigns, setCampaigns] = useState<CampaignModel[]>([])
    const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignModel[]>([])

    useEffect(() => {
        getAllCampaigns().then((campaigns: CampaignModel[]) => {
            setCampaigns(campaigns);
        })
    }, []);

    const filterCampaigns = useCallback((name: string, type: CampaignTypeModel, status: string, semester: string, year: number, installation: boolean) => {
        setFilteredCampaigns(
            campaigns.filter(campaign =>
                (campaign?.year +  "−" + campaign?.installation.label+  "_" + campaign?.name).toLowerCase().includes(name.toLowerCase())
                && (status === null || campaign.status.label === status)
                && (type === null || campaign.type.id === type.id)
                && (semester === null || campaign.semester === semester)
                && (year === null || campaign.year === year)
                && !!campaign.installation.id === installation
            ));
    }, [campaigns]);

    return <Box className='scene-container'>
        <Title title="Campagnes" padding={2} fontWeight="bold"/>
        <CampaignsToolBar campaigns={campaigns} filterCampaigns={filterCampaigns}/>
        <Box className='campaign-table-container'>
            <DataTableRow RowComponent={CampaignsRows}
                          rowsData={filteredCampaigns}
                          setRows={setFilteredCampaigns}
                          columns={CAMPAIGNS_COLUMNS}
            />
        </Box>
    </Box>;

}