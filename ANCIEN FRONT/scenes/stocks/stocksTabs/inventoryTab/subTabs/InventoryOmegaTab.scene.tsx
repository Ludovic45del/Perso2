import {Box} from "@mui/material";

import {useEffect, useState} from "react";
import DataTableRow from "../../../../../core/datatable/DataTableRow.tsx";
import {INVENTORY_OMEGA_COLUMNS} from "../../../../../core/datatable/stock/StocksDetailedColumns.ts";
import {deleteInventoryOmega, getAllInventoryOmega} from "../../../../../services/stock/inventory.service.ts";
import InventoryOmegaModel from "../../../../../core/domain/stock/InventoryOmegaModel.ts";
import InventoryOmegaRows from "../../../../../core/datatable/stock/rows/InventoryOmegaRows.tsx";
import {useSnackBarContext} from "../../../../home/Home.scene.tsx";
import Button from "@mui/material/Button";
import InventoryOmegaCreationModal from "../../../../../core/modal/stocks/InventoryOmegaCreationModal.tsx";
import AddIcon from "@mui/icons-material/Add";

export default function InventoryOmegaTabScene() {
    const [inventoryOmega, setInventoryOmega] = useState<InventoryOmegaModel[]>([])
    const snackBar = useSnackBarContext()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    const recieveUpdatedList = (list: InventoryOmegaModel[]) => setInventoryOmega(list)

    useEffect(() => {
        getAllInventoryOmega().then((response: InventoryOmegaModel[]) => {
            setInventoryOmega(response);
        })
    }, []);


    const deleteLineOnClick = (row: any, index: string | number) => {
        const uuid = index.toString()
        deleteInventoryOmega(uuid).then((resp: InventoryOmegaModel[]) => {
            snackBar.openSnackbar('La ligne a bien été supprimée', 'success');
            setInventoryOmega(resp)
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
                {isModalOpen && <InventoryOmegaCreationModal isOpen={isModalOpen} handleClose={handleClose}
                                                             updateList={recieveUpdatedList}/>}
            </Box>
            < DataTableRow RowComponent={InventoryOmegaRows}
                           rowsData={inventoryOmega}
                           setRows={setInventoryOmega}
                           columns={INVENTORY_OMEGA_COLUMNS}
                           onClick={deleteLineOnClick}
            />
        </Box>
    );
}