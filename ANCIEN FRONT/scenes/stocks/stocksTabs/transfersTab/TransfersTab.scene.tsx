import {Box} from "@mui/material";
import DataTableRow from "../../../../core/datatable/DataTableRow.tsx";
import {TRANSFERS_COLUMNS} from "../../../../core/datatable/stock/StocksDetailedColumns.ts";
import TranfersRows from "../../../../core/datatable/stock/rows/TransfersRows.tsx";
import {useEffect, useState} from "react";
import TransfersModel from "../../../../core/domain/stock/TransfersModel.ts";
import {getAllTransfers} from "../../../../services/stock/transfers.service.ts";

export default function TransfersTabScene() {
    const [transfers, setTransfers] = useState<TransfersModel[]>([])


    useEffect(() => {
        getAllTransfers().then((response: TransfersModel[]) => {
            setTransfers(response);
        })
    }, []);

    return (

        <Box className='fsecs-table-container'>

            < DataTableRow RowComponent={TranfersRows}
                           rowsData={transfers}
                           setRows={setTransfers}
                           columns={TRANSFERS_COLUMNS}
            />

        </Box>
    );
}