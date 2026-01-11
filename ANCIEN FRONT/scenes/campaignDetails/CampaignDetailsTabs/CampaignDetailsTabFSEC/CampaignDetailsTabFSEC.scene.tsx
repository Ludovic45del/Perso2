import {Box} from "@mui/material";
import {CAMPAIGN_FSECS_COLUMNS} from "../../../../core/datatable/fsec/FsecColumnsTable.const.ts";
import DataTableRow from "../../../../core/datatable/DataTableRow.tsx";
import {useCallback, useEffect, useState} from "react";
import FsecModel from "../../../../core/domain/fsec/Fsec.model.ts";
import {getAllFsecsByCampaignUUID} from "../../../../services/fsec/fsec.service.ts";
import {useCampaignContext} from "../../../../hooks/contexts/Campaign.context.tsx";
import FsecCampaignRows from "../../../../core/datatable/fsec/rows/FsecCampaignRow.tsx";
import CampaignDetailsTabFSECToolbar from "./CampaignDetailsTabFSECToolbar.tsx";

export default function CampaignDetailsTabFSEC() {
    const [fsecs, setFsecs] = useState<FsecModel[]>([])
    const [filteredFsecs, setFilteredFsecs] = useState<FsecModel[]>([])
    const {campaign} = useCampaignContext();

    useEffect(() => {
        if(campaign.uuid && fsecs.length == 0){
            getAllFsecsByCampaignUUID(campaign.uuid).then((fsecs: FsecModel[]) => {
                setFsecs(fsecs);
            })
        }
    }, [campaign]);

    const filterFsecs = useCallback((status: string, category: string) => {
        setFilteredFsecs(
            fsecs.filter(fsec =>
                (status === null || fsec.status.label === status)
                && (category === null || fsec.category.label === category)
            ));
    }, [fsecs]);
  return (
    <Box>
        <CampaignDetailsTabFSECToolbar fsecs={fsecs} filterFsecs={filterFsecs} ></CampaignDetailsTabFSECToolbar>
        < DataTableRow RowComponent={FsecCampaignRows}
                       rowsData={filteredFsecs}
                       setRows={setFilteredFsecs}
                       columns={CAMPAIGN_FSECS_COLUMNS}
        />
    </Box>
  );
}
