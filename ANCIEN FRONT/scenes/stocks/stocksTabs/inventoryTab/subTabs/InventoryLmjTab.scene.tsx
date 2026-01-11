import {Box} from "@mui/material";

import {useEffect, useState} from "react";
import DataTableRow from "../../../../../core/datatable/DataTableRow.tsx";
import {INVENTORY_LMJ_COLUMNS} from "../../../../../core/datatable/stock/StocksDetailedColumns.ts";
import {deleteInventoryLmj, getAllInventoryLmj} from "../../../../../services/stock/inventory.service.ts";
import InventoryLmjModel from "../../../../../core/domain/stock/InventoryLmjModel.ts";
import InventoryLmjRows from "../../../../../core/datatable/stock/rows/InventoryLmjRows.tsx";
import {useSnackBarContext} from "../../../../home/Home.scene.tsx";
import InventoryLmjCreationModal from "../../../../../core/modal/stocks/InventoryLmjCreationModal.tsx";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export default function InventoryLmjTabScene() {
    const [inventoryLmj, setInventoryLmj] = useState<InventoryLmjModel[]>([])
    const snackBar = useSnackBarContext()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    const recieveUpdatedList = (list: InventoryLmjModel[]) => setInventoryLmj(list)


    useEffect(() => {
        getAllInventoryLmj().then((response: InventoryLmjModel[]) => {
            setInventoryLmj(response);
        })
    }, []);

    const deleteLineOnClick = (row: any, index: string | number) => {
        const uuid = index.toString()
        deleteInventoryLmj(uuid).then((resp: InventoryLmjModel[]) => {
            snackBar.openSnackbar('La ligne a bien été supprimée', 'success');
            setInventoryLmj(resp)
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
                {isModalOpen && <InventoryLmjCreationModal isOpen={isModalOpen} handleClose={handleClose}
                                                           updateList={recieveUpdatedList}/>}
            </Box>
            < DataTableRow RowComponent={InventoryLmjRows}
                           rowsData={inventoryLmj}
                           setRows={setInventoryLmj}
                           columns={INVENTORY_LMJ_COLUMNS}
                           onClick={deleteLineOnClick}
            />
        </Box>
    );
}