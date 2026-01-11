import {RowProps} from "../../DataTableRow.tsx";
import CampaignModel from "../../../domain/campaign/Campaign.model.ts";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../../DataTable.css'
import DataChip from "../../../chip/DataChip.tsx";
import { useNavigateCtrl } from "../../../../hooks/useNavigateCtrl.ts";


export default function CampaignsRows({object}: RowProps<CampaignModel>) {
    const nav = useNavigateCtrl();

    return <TableRow hover
        className="pointer"
        onDoubleClick={(event) =>
            nav('/campagne-details/' + `${object.year}-${object.installation.label}_${object.name.toUpperCase()}` +'/overview', event)
        }
    >

        <TableCell className="first-cell">
            {object.semester}
        </TableCell>

        <TableCell>
            {`${object.year}-${object.installation.label}_${object.name.toUpperCase()}`}
        </TableCell>
        <TableCell>
            <DataChip label={object.type.label} color={object.type.color}/>
        </TableCell>
        <TableCell>
            {object.status.label}
        </TableCell>
        <TableCell className="last-cell">
            <Box display="flex" justifyContent="flex-end">
                <ArrowForwardIcon
                    onClick={(event) => {
                        nav('/campagne-details/' + `${object.year}-${object.installation.label}_${object.name.toUpperCase()}` +'/overview', event)
                    }}
                />
            </Box>
        </TableCell>
    </TableRow>
}