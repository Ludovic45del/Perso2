import {Box} from "@mui/material";
import Title from "../../core/Title/Title.tsx";
import DataTableRow from "../../core/datatable/DataTableRow.tsx";
import FsecRows from "../../core/datatable/fsec/rows/FsecRows.tsx";
import {useCallback, useEffect, useState} from "react";
import {FSECS_COLUMNS, FSECS_DETAILED_COLUMNS} from "../../core/datatable/fsec/FsecColumnsTable.const.ts";
import './Fsecs.scene.scss'
import '../scenes.scss'
import FsecsToolBar from "./FsecsToolBar.tsx";
import FsecDetailedRows from "../../core/datatable/fsec/rows/FsecDetailedRows.tsx";
import FsecsDetailedToolBar from "./FsecsDetailedToolBar.tsx";
import {getAllFsecs} from "../../services/fsec/fsec.service.ts";
import FsecModel from "../../core/domain/fsec/Fsec.model.ts";

export default function FsecsScene() {
    const [fsecs, setFsecs] = useState<FsecModel[]>([])
    const [filteredFsecs, setFilteredFsecs] = useState<FsecModel[]>([])
    const [filteredDetailedFsecs, setFilteredDetailedFsecs] = useState<FsecModel[]>([])
    const [isDetailed, setIsDetailed] = useState<boolean>(false)
    useEffect(() => {
        getAllFsecs().then((fsecs: FsecModel[]) => {
            setFsecs(fsecs);
        })
    }, []);

    const filterFsecs = useCallback((name: string, campaignName: string, status: string, category: string, year: number, installation: boolean) => {
        setFilteredFsecs(
            fsecs.filter(fsec =>
                fsec.name.toLowerCase().includes(name.toLowerCase())
                && (fsec.campaign === null || (fsec?.campaign.year +  "−" + fsec?.campaign.installation.label+  "_" + fsec?.campaign.name).toLowerCase().includes(campaignName.toLowerCase()))
                && (status === null || fsec.status.label === status)
                && (category === null || fsec.category.label === category)
                && (year === null || fsec.campaign.year === year)
                && !!fsec.campaign?.installation.id === installation
            ));
    }, [fsecs]);

    const filterDetailedFsecs = useCallback((name: string, embase: string, status: string, installation: boolean) => {
        setFilteredDetailedFsecs(
            fsecs.filter(fsec =>
                fsec.name.toLowerCase().includes(name.toLowerCase())
                && (embase === null || fsec.embase === embase)
                && (status === null || fsec.status.label === status)
                && !!fsec.campaign?.installation.id === installation
            ));
    }, [fsecs]);

    return <Box className='scene-container'>
        <Title title="FSEC" padding={2} fontWeight="bold"/>
        {!isDetailed ? <FsecsToolBar fsecs={fsecs} filterFsecs={filterFsecs} setIsDetailed={setIsDetailed} isDetailed={isDetailed}/> :
          <FsecsDetailedToolBar fsecs={fsecs} filterDetailedFsecs={filterDetailedFsecs} setIsDetailed={setIsDetailed} isDetailed={isDetailed}/>}

        <Box className='fsecs-table-container'>
            {!isDetailed ?
                < DataTableRow RowComponent={FsecRows}
                    rowsData={filteredFsecs}
                    setRows={setFilteredFsecs}
                    columns={FSECS_COLUMNS}
                />
            :
                < DataTableRow RowComponent={FsecDetailedRows}
                   rowsData={filteredDetailedFsecs}
                   setRows={setFilteredDetailedFsecs}
                   columns={FSECS_DETAILED_COLUMNS}
                />
            }
        </Box>
    </Box>;

}