import {RowProps} from "../../DataTableRow.tsx";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import SpecialStructuringModel from "../../../domain/stock/SpecialStructuringModel.ts";
import DeleteOption from "../../../options/DeleteOption.tsx";
import AddAdditionalCommentOption from "../../../options/AddAdditionalCommentOption.tsx";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function SpecialStructuringRows({object, onClick}: RowProps<SpecialStructuringModel>) {


    return <TableRow hover
                     className="pointer"
    >
        <TableCell className="first-cell">
            {object.who}
        </TableCell>
        <TableCell>
            {object.fulfillmentDate}
        </TableCell>
        <TableCell>
            {object.structuringNumber}
        </TableCell>
        <TableCell>
            {object.pamsNumber}
        </TableCell>
        <TableCell>
            {object.localisation}
        </TableCell>
        <TableCell>
            {object.fsec}
        </TableCell>
        <TableCell>
            {object.usageDate}
        </TableCell>
        <TableCell>
            {object.materialsMat}
        </TableCell>
        <TableCell>
            {object.comments}
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
            <AddAdditionalCommentOption key='AddComment' uuid={object.uuid} type='special-structuring' comment={object.additionalComment}/>
        </TableCell>
        <TableCell className="last-cell">
            <DeleteOption key='DeleteOption' message="Etes-vous sur de vouloir supprimer cette ligne ?"
                          deleteMethod={() => onClick(object, object.uuid)}
            />
        </TableCell>
    </TableRow>
}