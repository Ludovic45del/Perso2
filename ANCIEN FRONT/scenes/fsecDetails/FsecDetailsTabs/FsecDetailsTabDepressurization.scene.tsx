import {useFsecContext} from "../../../hooks/contexts/Fsec.context.tsx";
import {Box} from "@mui/material";
import {StyledPaper} from "../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../core/Title/Title.tsx";
import dayjs from "dayjs";
import './StepsFields.scss'

export default function FsecDetailsTabDepressurizationScene() {
    const {fsec: {depressurizationStep}} = useFsecContext();

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '2em'}}>
            <StyledPaper>
                <Title title="Opérateur" variant="h6"/>
                <h4>{depressurizationStep?.operator}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Réalisé le" variant="h6"/>
                <h4>{depressurizationStep?.dateOfFulfilment && dayjs(depressurizationStep?.dateOfFulfilment).format('DD-MM-YYYY').toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression manomètre" variant="h6"/>
                <h4>{depressurizationStep?.pressureGauge.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression enceinte mesurée" variant="h6"/>
                <h4>{depressurizationStep?.enclosurePressureMeasured.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Heure de début" variant="h6"/>
                <h4>{dayjs(depressurizationStep?.startTime).format('HH:mm').toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Heure de fin" variant="h6"/>
                <h4>{dayjs(depressurizationStep?.endTime).format('HH:mm').toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Durée de dépressurisation avant tir" variant="h6"/>
                <h4>{depressurizationStep?.computedPressureBeforeFiring.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Observations" variant="h6"/>
                <h4>{depressurizationStep?.observations}</h4>
            </StyledPaper>
        </Box>
    )
}