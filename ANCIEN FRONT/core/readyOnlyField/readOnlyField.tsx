import Box from "@mui/material/Box";
import './readOnlyField.scss';

interface ReadOnlyFieldProps {
    title: string;
    value?: string;
}

export default function ReadOnlyField(props: ReadOnlyFieldProps) {

    return <Box className="readonly--field-container">
        <h4>{props.title} :</h4>
        <p>{props.value}</p>
    </Box>

}