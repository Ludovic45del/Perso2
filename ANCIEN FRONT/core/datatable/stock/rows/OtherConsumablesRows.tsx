import {RowProps} from "../../DataTableRow.tsx";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import '../../DataTable.css'
import OtherConsumablesModel from "../../../domain/stock/OtherConsumablesModel.ts";
import DeleteOption from "../../../options/DeleteOption.tsx";
import AddAdditionalCommentOption from "../../../options/AddAdditionalCommentOption.tsx";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";


export default function OtherConsumablesRows({object, onClick}: RowProps<OtherConsumablesModel>) {

    return <TableRow hover
                     className="pointer"
    >
        <TableCell className="first-cell">
            {object.item}
        </TableCell>
        <TableCell>
            {object.stocks}
        </TableCell>
        <TableCell>
            {object.unit}
        </TableCell>
        <TableCell>
            {object.reference}
        </TableCell>
        <TableCell>
            {object.buyingType}
        </TableCell>
        <TableCell>
            {object.supplier}
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
            <AddAdditionalCommentOption key='AddComment' uuid={object.uuid} type='other-consumables' comment={object.additionalComment}/>
        </TableCell>
        <TableCell className="last-cell">
            <DeleteOption key='DeleteOption' message="Etes-vous sur de vouloir supprimer cette ligne ?"
                          deleteMethod={() => onClick(object, object.uuid)}
            />
        </TableCell>
    </TableRow>
}