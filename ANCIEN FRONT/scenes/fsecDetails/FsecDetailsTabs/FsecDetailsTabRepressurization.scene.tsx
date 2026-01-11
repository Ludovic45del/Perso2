import {useFsecContext} from "../../../hooks/contexts/Fsec.context.tsx";
import {Box} from "@mui/material";
import {StyledPaper} from "../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../core/Title/Title.tsx";
import dayjs from "dayjs";
import './StepsFields.scss'

export default function FsecDetailsTabRepressurizationScene() {
    const {fsec: {repressurizationStep}} = useFsecContext();

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '2em'}}>
            <StyledPaper>
                <Title title="Opérateur" variant="h6"/>
                <h4>{repressurizationStep?.operator}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Réalisé le" variant="h6"/>
                <h4>{repressurizationStep?.gasType}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Début" variant="h6"/>
                <h4>{repressurizationStep?.startDate && dayjs(repressurizationStep?.startDate).format('DD-MM-YYYY').toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression capteur" variant="h6"/>
                <h4>{repressurizationStep?.sensorPressure.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Fin estimée" variant="h6"/>
                <h4>{repressurizationStep?.estimatedEndDate && dayjs(repressurizationStep?.estimatedEndDate).format('DD-MM-YYYY').toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression calculée" variant="h6"/>
                <h4>{repressurizationStep?.computedPressure.toString()}</h4>
            </StyledPaper>
        </Box>
    )
}