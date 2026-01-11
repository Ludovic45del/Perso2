import {Box} from "@mui/material";

import {useEffect, useState} from "react";
import DataTableRow from "../../../../../core/datatable/DataTableRow.tsx";
import {STRUCTURING_COLUMNS} from "../../../../../core/datatable/stock/StocksDetailedColumns.ts";
import {deleteStructuring, getAllStructuring} from "../../../../../services/stock/structuring.service.ts";
import StructuringModel from "../../../../../core/domain/stock/StructuringModel.ts";
import StructuringRows from "../../../../../core/datatable/stock/rows/StructuringRows.tsx";
import {useSnackBarContext} from "../../../../home/Home.scene.tsx";
import Button from "@mui/material/Button";
import StructuringCreationModal from "../../../../../core/modal/stocks/StructuringCreationModal.tsx";
import AddIcon from "@mui/icons-material/Add";

export default function StructuringTabScene() {
    const [structuring, setStructuring] = useState<StructuringModel[]>([])
    const snackBar = useSnackBarContext()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    const recieveUpdatedList = (list: StructuringModel[]) => setStructuring(list)

    useEffect(() => {
        getAllStructuring().then((response: StructuringModel[]) => {
            setStructuring(response);
        })
    }, []);


    const deleteLineOnClick = (row: any, index: string | number) => {
        const uuid = index.toString()
        deleteStructuring(uuid).then((resp: StructuringModel[]) => {
            snackBar.openSnackbar('La ligne a bien été supprimée', 'success');
            setStructuring(resp)
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
                {isModalOpen && <StructuringCreationModal isOpen={isModalOpen} handleClose={handleClose}
                                                          updateList={recieveUpdatedList}/>}
            </Box>
            < DataTableRow RowComponent={StructuringRows}
                           rowsData={structuring}
                           setRows={setStructuring}
                           columns={STRUCTURING_COLUMNS}
                           onClick={deleteLineOnClick}

            />
        </Box>
    );
}