import {RowProps} from "../../DataTableRow.tsx";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import '../../DataTable.css'
import TransfersModel from "../../../domain/stock/TransfersModel.ts";


export default function TranfersRows({object}: RowProps<TransfersModel>) {
    return <TableRow hover
                     className="pointer"
    >
        <TableCell className="first-cell">
            {object.date}
        </TableCell>
        <TableCell>
            {object.equipmentType}
        </TableCell>
        <TableCell>
            {object.equipment}
        </TableCell>
        <TableCell>
            {object.initialStock}
        </TableCell>
        <TableCell>
            {object.units}
        </TableCell>
        <TableCell>
            {object.entryDate}
        </TableCell>
        <TableCell>
            {object.exitDate}
        </TableCell>
        <TableCell className="last-cell">
            {object.currentStock}
        </TableCell>
    </TableRow>
}