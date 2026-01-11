import {Box} from "@mui/material";

import {useEffect, useState} from "react";
import DataTableRow from "../../../../../core/datatable/DataTableRow.tsx";
import {INVENTORY_BASIC_PARTS_CATALOG_COLUMNS} from "../../../../../core/datatable/stock/StocksDetailedColumns.ts";
import InventoryBasicPartsCatalogModel from "../../../../../core/domain/stock/InventoryBasicPartsCatalog.ts";
import {
    deleteInventoryBasicPartsCatalog,
    getAllInventoryBasicPartsCatalog
} from "../../../../../services/stock/inventory.service.ts";
import InventoryBasicPartsCatalogRows
    from "../../../../../core/datatable/stock/rows/InventoryBasicPartsCatalogRows.tsx";
import {useSnackBarContext} from "../../../../home/Home.scene.tsx";
import Button from "@mui/material/Button";
import InventoryBasicPartsCatalogCreationModal
    from "../../../../../core/modal/stocks/InventoryBasicPartsCatalogCreationModal.tsx";
import AddIcon from "@mui/icons-material/Add";

export default function InventoryBasicPartsCatalogTabScene() {
    const [basicParts, setBasicParts] = useState<InventoryBasicPartsCatalogModel[]>([])
    const snackBar = useSnackBarContext()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    const recieveUpdatedList = (list: InventoryBasicPartsCatalogModel[]) => setBasicParts(list)

    useEffect(() => {
        getAllInventoryBasicPartsCatalog().then((response: InventoryBasicPartsCatalogModel[]) => {
            setBasicParts(response);
        })
    }, []);

    const deleteLineOnClick = (row: any, index: string | number) => {
        const uuid = index.toString()
        deleteInventoryBasicPartsCatalog(uuid).then((resp: InventoryBasicPartsCatalogModel[]) => {
            snackBar.openSnackbar('La ligne a bien été supprimée', 'success');
            setBasicParts(resp)
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
                {isModalOpen && <InventoryBasicPartsCatalogCreationModal isOpen={isModalOpen} handleClose={handleClose}
                                                                         updateList={recieveUpdatedList}/>}
            </Box>
            < DataTableRow RowComponent={InventoryBasicPartsCatalogRows}
                           rowsData={basicParts}
                           setRows={setBasicParts}
                           columns={INVENTORY_BASIC_PARTS_CATALOG_COLUMNS}
                           onClick={deleteLineOnClick}
            />
        </Box>
    );
}