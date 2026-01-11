import {Box} from "@mui/material";

import {useEffect, useState} from "react";
import DataTableRow from "../../../../../core/datatable/DataTableRow.tsx";
import {SPECIAL_STRUCTURING_COLUMNS} from "../../../../../core/datatable/stock/StocksDetailedColumns.ts";
import {deleteSpecialStructuring, getAllSpecialStructuring} from "../../../../../services/stock/structuring.service.ts";
import SpecialStructuringModel from "../../../../../core/domain/stock/SpecialStructuringModel.ts";
import SpecialStructuringRows from "../../../../../core/datatable/stock/rows/SpecialStructuringRows.tsx";
import {useSnackBarContext} from "../../../../home/Home.scene.tsx";
import Button from "@mui/material/Button";
import SpecialStructuringCreationModal from "../../../../../core/modal/stocks/SpecialStructuringCreationModal.tsx";
import AddIcon from "@mui/icons-material/Add";

export default function SpecialStructuringTabScene() {
    const [specialStructuring, setSpecialStructuring] = useState<SpecialStructuringModel[]>([])
    const snackBar = useSnackBarContext()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleClose = () => setIsModalOpen(false)

    const recieveUpdatedList = (list: SpecialStructuringModel[]) => setSpecialStructuring(list)

    useEffect(() => {
        getAllSpecialStructuring().then((response: SpecialStructuringModel[]) => {
            setSpecialStructuring(response);
        })
    }, []);


    const deleteLineOnClick = (row: any, index: string | number) => {
        const uuid = index.toString()
        deleteSpecialStructuring(uuid).then((resp: SpecialStructuringModel[]) => {
            snackBar.openSnackbar('La ligne a bien été supprimée', 'success');
            setSpecialStructuring(resp)
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
                {isModalOpen && <SpecialStructuringCreationModal isOpen={isModalOpen} handleClose={handleClose}
                                                                 updateList={recieveUpdatedList}/>}
            </Box>
            < DataTableRow RowComponent={SpecialStructuringRows}
                           rowsData={specialStructuring}
                           setRows={setSpecialStructuring}
                           columns={SPECIAL_STRUCTURING_COLUMNS}
                           onClick={deleteLineOnClick}

            />
        </Box>
    );
}