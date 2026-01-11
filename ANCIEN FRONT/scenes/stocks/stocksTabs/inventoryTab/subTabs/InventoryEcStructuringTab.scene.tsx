import {Box} from "@mui/material";

import {useEffect, useState} from "react";
import DataTableRow from "../../../../../core/datatable/DataTableRow.tsx";
import {INVENTORY_EC_STRUCTURING_COLUMNS} from "../../../../../core/datatable/stock/StocksDetailedColumns.ts";
import {
    deleteInventoryEcStructuring,
    getAllInventoryEcStructuring
} from "../../../../../services/stock/inventory.service.ts";
import InventoryEcStructuringModel from "../../../../../core/domain/stock/InventoryEcStructuringModel.ts";
import InventoryEcStructuringRows from "../../../../../core/datatable/stock/rows/InventoryEcStructuringRows.tsx";
import {useSnackBarContext} from "../../../../home/Home.scene.tsx";
import Button from "@mui/material/Button";
import InventoryEcStructuringCreationModal
    from "../../../../../core/modal/stocks/InventoryEcStructuringCreationModal.tsx";
import AddIcon from "@mui/icons-material/Add";

export default function InventoryEcStructuringTabScene() {
    const [ecStructuring, setEcStructuring] = useState<InventoryEcStructuringModel[]>([])
    const snackBar = useSnackBarContext()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    const recieveUpdatedList = (list: InventoryEcStructuringModel[]) => setEcStructuring(list)

    useEffect(() => {
        getAllInventoryEcStructuring().then((response: InventoryEcStructuringModel[]) => {
            setEcStructuring(response);
        })
    }, []);

    const deleteLineOnClick = (row: any, index: string | number) => {
        const uuid = index.toString()
        deleteInventoryEcStructuring(uuid).then((resp: InventoryEcStructuringModel[]) => {
            snackBar.openSnackbar('La ligne a bien été supprimée', 'success');
            setEcStructuring(resp)
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
                {isModalOpen && <InventoryEcStructuringCreationModal isOpen={isModalOpen} handleClose={handleClose}
                                                                     updateList={recieveUpdatedList}/>}
            </Box>
            < DataTableRow RowComponent={InventoryEcStructuringRows}
                           rowsData={ecStructuring}
                           setRows={setEcStructuring}
                           columns={INVENTORY_EC_STRUCTURING_COLUMNS}
                           onClick={deleteLineOnClick}
            />
        </Box>
    );
}