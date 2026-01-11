import {Box} from "@mui/material";

import {useEffect, useState} from "react";
import {deleteConsumablesGlues, getAllConsumablesGlues} from "../../../../../services/stock/consumables.service.ts";
import ConsumablesGluesModel from "../../../../../core/domain/stock/ConsumablesGluesModel.ts";
import DataTableRow from "../../../../../core/datatable/DataTableRow.tsx";
import {CONSUMABLES_GLUES_COLUMNS} from "../../../../../core/datatable/stock/StocksDetailedColumns.ts";
import ConsumablesGluesRows from "../../../../../core/datatable/stock/rows/ConsumablesGluesRows.tsx";
import {useSnackBarContext} from "../../../../home/Home.scene.tsx";
import Button from "@mui/material/Button";
import ConsumablesGluesCreationModal from "../../../../../core/modal/stocks/ConsumablesGluesCreationModal.tsx";
import AddIcon from "@mui/icons-material/Add";

export default function ConsumablesGluesTabScene() {
    const [consumables, setConsumables] = useState<ConsumablesGluesModel[]>([])
    const snackBar = useSnackBarContext()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    const recieveUpdatedList = (list: ConsumablesGluesModel[]) => setConsumables(list)

    useEffect(() => {
        getAllConsumablesGlues().then((response: ConsumablesGluesModel[]) => {
            setConsumables(response);
        })
    }, []);


    const deleteLineOnClick = (row: any, index: string | number) => {
        const uuid = index.toString()
        deleteConsumablesGlues(uuid).then((resp: ConsumablesGluesModel[]) => {
            snackBar.openSnackbar('La ligne a bien été supprimée', 'success');
            setConsumables(resp)
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
                {isModalOpen && <ConsumablesGluesCreationModal isOpen={isModalOpen} handleClose={handleClose}
                                                               updateList={recieveUpdatedList}/>}
            </Box>
            < DataTableRow RowComponent={ConsumablesGluesRows}
                           rowsData={consumables}
                           setRows={setConsumables}
                           columns={CONSUMABLES_GLUES_COLUMNS}
                           onClick={deleteLineOnClick}

            />
        </Box>
    );
}