import {RowProps} from "../../DataTableRow.tsx";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import InventoryBasicPartsCatalogModel from "../../../domain/stock/InventoryBasicPartsCatalog.ts";
import DeleteOption from "../../../options/DeleteOption.tsx";
import AddAdditionalCommentOption from "../../../options/AddAdditionalCommentOption.tsx";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function InventoryBasicPartsCatalogRows({object, onClick}: RowProps<InventoryBasicPartsCatalogModel>) {

    return <TableRow hover
                     className="pointer"
    >
        <TableCell className="first-cell">
            {object.elementName}
        </TableCell>
        <TableCell>
            {object.boxNumberOrBoxDescription}
        </TableCell>
        <TableCell>
            {object.availability}
        </TableCell>
        <TableCell>
            {object.deliveryDate}
        </TableCell>
        <TableCell>
            {object.exitDate}
        </TableCell>
        <TableCell>
            {object.usedCampaign}
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
            <AddAdditionalCommentOption key='AddComment' uuid={object.uuid} type='basic-parts' comment={object.additionalComment}/>
        </TableCell>
        <TableCell className="last-cell">
            <DeleteOption key='DeleteOption' message="Etes-vous sur de vouloir supprimer cette ligne ?"
                          deleteMethod={() => onClick(object, object.uuid)}
            />
        </TableCell>
    </TableRow>
}