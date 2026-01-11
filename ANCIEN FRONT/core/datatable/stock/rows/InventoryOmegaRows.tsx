import {RowProps} from "../../DataTableRow.tsx";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import InventoryOmegaModel from "../../../domain/stock/InventoryOmegaModel.ts";
import DeleteOption from "../../../options/DeleteOption.tsx";
import AddAdditionalCommentOption from "../../../options/AddAdditionalCommentOption.tsx";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function InventoryOmegaRows({object, onClick}: RowProps<InventoryOmegaModel>) {

    return <TableRow hover
                     className="pointer"
    >
        <TableCell className="first-cell">
            {object.drmnCampaignNumber}
        </TableCell>
        <TableCell>
            {object.iec}
        </TableCell>
        <TableCell>
            {object.elementsOrTargetDescription}
        </TableCell>
        <TableCell>
            {object.digitsIfUntaggedElement}
        </TableCell>
        <TableCell>
            {object.targetsOrElementNumber}
        </TableCell>
        <TableCell>
            {object.boxNumberOrBoxDescription}
        </TableCell>
        <TableCell>
            {object.localisation}
        </TableCell>
        <TableCell>
            {object.deliveryDate}
        </TableCell>
        <TableCell>
            {object.exitDate}
        </TableCell>
        <TableCell>
            {object.fsec}
        </TableCell>
        {object.additionalComment ?
            <TableCell sx={{paddingLeft: '43px', width: '100px'}} title={object.additionalComment}>
                <InfoOutlinedIcon/>
            </TableCell>
            :
            <TableCell>
                Pas de commentaire
            </TableCell>
        }
        <TableCell>
            <AddAdditionalCommentOption key='AddComment' uuid={object.uuid} type='omega' comment={object.additionalComment}/>
        </TableCell>
        <TableCell className="last-cell">
            <DeleteOption key='DeleteOption' message="Etes-vous sur de vouloir supprimer cette ligne ?"
                          deleteMethod={() => onClick(object, object.uuid)}
            />
        </TableCell>
    </TableRow>
}