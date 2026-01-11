import {RowProps} from "../../DataTableRow.tsx";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import '../../DataTable.css'
import FsecModel from "../../../domain/fsec/Fsec.model.ts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {useNavigateCtrl} from "../../../../hooks/useNavigateCtrl.ts";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DuplicateFsecModal from "../../../modal/stepper/DuplicateFsecModal.tsx";
import {useState} from "react";
import FsecDetailedModel from "../../../domain/fsec/FsecDetailed.model.ts";
import {getFsecByUuid} from "../../../../services/fsec/fsec.service.ts";
import DataChip from "../../../chip/DataChip.tsx";

export default function FsecCampaignRows({object}: RowProps<FsecModel>) {
    const nav = useNavigateCtrl();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const handleClose = () => setIsModalOpen(false)
    const [fsec, setFsec] = useState<FsecDetailedModel>(null)

    const getFsecAndOpenModal = () =>{
        getFsecByUuid(object.versionUuid).then((response: FsecDetailedModel)=>{
            setFsec(response)
        })

        setIsModalOpen(isOpen => !isOpen )
    }
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
            <DataChip label={object.status.label} color={object.status.color}/>
        </TableCell>
        <TableCell>
            <DataChip label={object.category.label} color={object.category.color}/>
        </TableCell>
        <TableCell>
            {object.embase}
        </TableCell>
        <TableCell>
            {object.deliveryDate}
        </TableCell>
        <TableCell>
            {object.shootingDate}
        </TableCell>
        <TableCell className="last-cell">
            <Box display="flex" justifyContent="flex-end">
                <ContentCopyOutlinedIcon onClick={() => getFsecAndOpenModal()} titleAccess="Duplique la fsec"/>
                {(isModalOpen && fsec) && <DuplicateFsecModal fsec={fsec} isOpen={isModalOpen} handleClose={handleClose} message={"Voulez-vous vraiment dupliquer cette FSEC?"}/>}
                <ArrowForwardIcon
                    onClick={(event) => {
                        nav(`/fsec-details/${object.versionUuid}/overview`, event)
                    }}
                />
            </Box>
        </TableCell>
    </TableRow>
}