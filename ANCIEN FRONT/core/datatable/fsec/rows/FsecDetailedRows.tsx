import {RowProps} from "../../DataTableRow.tsx";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import '../../DataTable.css'
import FsecModel from "../../../domain/fsec/Fsec.model.ts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {useNavigateCtrl} from "../../../../hooks/useNavigateCtrl.ts";


export default function FsecDetailedRows({object}: RowProps<FsecModel>) {
    const nav = useNavigateCtrl();

    return <TableRow hover
                     className="pointer"
                     onDoubleClick={(event) =>
                         nav(`/fsec-details/${object.versionUuid}/overview`, event)
                     }
    >
        <TableCell className="first-cell">
            {object.name}
        </TableCell>
        <TableCell>
            {object.embase}
        </TableCell>
        <TableCell>
            {object.status.label}
        </TableCell>
        <TableCell>
            {object.rack.label}
        </TableCell>
        <TableCell>
            {object.local}
        </TableCell>
        <TableCell>
            {object.iec}
        </TableCell>
        <TableCell>
            {object.tci}
        </TableCell>
        <TableCell>
            {object.deliveryDate}
        </TableCell>
        <TableCell>
            {object.restitution}
        </TableCell>
        <TableCell className="last-cell">
            <Box display="flex" justifyContent="flex-end">
                {/*<ContentCopyOutlinedIcon titleAccess="Duplique la fsec"/>*/}
                <ArrowForwardIcon
                    onClick={(event) => {
                        nav(`/fsec-details/${object.versionUuid}/overview`, event)
                    }}
                />
            </Box>
        </TableCell>
    </TableRow>
}