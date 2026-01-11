import {useFsecContext} from "../../../hooks/contexts/Fsec.context.tsx";
import {Box} from "@mui/material";
import {StyledPaper} from "../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../core/Title/Title.tsx";
import dayjs from "dayjs";
import './StepsFields.scss'

export default function FsecDetailsTabPermeationScene() {
    const {fsec: {permeationStep}} = useFsecContext();

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '2em'}}>
            <StyledPaper>
                <Title title="Type Gaz" variant="h6"/>
                <h4>{permeationStep?.gasType}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression pour l'expérience" variant="h6"/>
                <h4>{permeationStep?.targetPressure.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Opérateur" variant="h6"/>
                <h4>{permeationStep?.operator}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression pour l'expérience" variant="h6"/>
                <h4>{permeationStep?.startDate && dayjs(permeationStep?.startDate).format('DD-MM-YYYY').toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression pour l'expérience" variant="h6"/>
                <h4>{permeationStep?.sensorPressure.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression pour l'expérience" variant="h6"/>
                <h4>{permeationStep?.estimatedEndDate.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression pour l'expérience" variant="h6"/>
                <h4>{permeationStep?.computedShotPressure.toString()}</h4>
            </StyledPaper>
        </Box>
    )
}