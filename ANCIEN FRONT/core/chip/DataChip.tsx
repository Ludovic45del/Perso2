import {Chip} from "@mui/material";


interface ChipDataProps {
    label: string,
    color: string
}


export default function DataChip({label, color}: ChipDataProps) {

    return <Chip sx={{backgroundColor: color || '#848282', maxWidth: '100%'}}
                 size="small"
                 title={label || 'inconnu'}
                 label={label || 'inconnu'}/>;
}