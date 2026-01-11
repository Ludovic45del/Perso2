import {Box} from "@mui/material";

import {useEffect, useState} from "react";
import {deleteOtherConsumables, getAllOtherConsumables} from "../../../../../services/stock/consumables.service.ts";
import DataTableRow from "../../../../../core/datatable/DataTableRow.tsx";
import {OTHER_CONSUMABLES_COLUMNS} from "../../../../../core/datatable/stock/StocksDetailedColumns.ts";
import OtherConsumablesModel from "../../../../../core/domain/stock/OtherConsumablesModel.ts";
import OtherConsumablesRows from "../../../../../core/datatable/stock/rows/OtherConsumablesRows.tsx";
import {useSnackBarContext} from "../../../../home/Home.scene.tsx";
import Button from "@mui/material/Button";
import OtherConsumablesCreationModal from "../../../../../core/modal/stocks/OtherConsumablesCreationModal.tsx";
import AddIcon from "@mui/icons-material/Add";

export default function OtherConsumablesTabScene() {
    const [otherConsumables, setOtherConsumables] = useState<OtherConsumablesModel[]>([])
    const snackBar = useSnackBarContext()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    const recieveUpdatedList = (list: OtherConsumablesModel[]) => setOtherConsumables(list)

    useEffect(() => {
        getAllOtherConsumables().then((response: OtherConsumablesModel[]) => {
            setOtherConsumables(response);
        })
    }, []);


    const deleteLineOnClick = (row: any, index: string | number) => {
        const uuid = index.toString()
        deleteOtherConsumables(uuid).then((resp: OtherConsumablesModel[]) => {
            snackBar.openSnackbar('La ligne a bien été supprimée', 'success');
            setOtherConsumables(resp)
        }).catch(responseError => {
            responseError.json().then((json: any) => {
                snackBar.openSnackbar(json.message, 'error');
            });
        });
    }

    return (

        <Box>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button onClick={() => setIsModalOpen(isOpen => !isOpen)}><AddIcon></AddIcon> Créer</Button>
                {isModalOpen && <OtherConsumablesCreationModal isOpen={isModalOpen} handleClose={handleClose}
                                                               updateList={recieveUpdatedList}/>}
            </Box>
            < DataTableRow RowComponent={OtherConsumablesRows}
                           rowsData={otherConsumables}
                           setRows={setOtherConsumables}
                           columns={OTHER_CONSUMABLES_COLUMNS}
                           onClick={deleteLineOnClick}

            />
        </Box>
    );
}