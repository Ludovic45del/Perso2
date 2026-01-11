import {RowProps} from "../../DataTableRow.tsx";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import '../../DataTable.css'
import DataChip from "../../../chip/DataChip.tsx";
import FsecModel from "../../../domain/fsec/Fsec.model.ts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {useNavigateCtrl} from "../../../../hooks/useNavigateCtrl.ts";


export default function FsecRows({object}: RowProps<FsecModel>) {
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
            {object.campaign ? `${object.campaign.year}−${object.campaign.installation.label}_${object.campaign.name.toUpperCase()}` : "Pas de campagne associée"}
        </TableCell>
        <TableCell>
            {object.campaign?.year}
        </TableCell>
        <TableCell>
            <DataChip label={object.status.label} color={object.status.color}/>
        </TableCell>
        <TableCell>
            {object.category.label}
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