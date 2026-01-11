import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { RowProps } from "../../../core/datatable/DataTableRow.tsx";
import dayjs from "dayjs";
import '../../../core/datatable/DataTable.css'
import {CampaignDocumentsModel} from "../../../core/domain/campaign/CampaignDocuments.model.ts";
import {useSnackBarContext} from "../../home/Home.scene.tsx";

export default function DocumentsRow({object}: RowProps<CampaignDocumentsModel>) {
    const snackbar = useSnackBarContext()

    return <TableRow hover
        className="pointer"
        onClick={(event) =>
            navigator.clipboard.writeText(object.path).then(() =>{
                snackbar.openSnackbar("Le lien a bien été copié", 'success')
            })
        }
    >
        <TableCell className="first-cell">
            {object.name}
        </TableCell>
        <TableCell>
            {object.type.label}
        </TableCell>
        <TableCell>
            {object.subtype.label}
        </TableCell>
        <TableCell>
            {object.path}
        </TableCell>
        <TableCell className="last-cell">
            {dayjs(object.date).format('DD/MM/YYYY HH:mm')}
        </TableCell>
    </TableRow>
}