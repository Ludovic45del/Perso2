import {useFsecContext} from "../../../hooks/contexts/Fsec.context.tsx";
import {Box} from "@mui/material";
import {StyledPaper} from "../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../core/Title/Title.tsx";
import dayjs from "dayjs";
import './StepsFields.scss'

export default function FsecDetailsTabGasFillingHighPressureScene() {
    const {fsec: {gasFillingHighPressureStep}} = useFsecContext();

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '2em'}}>
            <StyledPaper>
                <Title title="Taux de fuite DTRI" variant="h6"/>
                <h4>{gasFillingHighPressureStep?.leakRateDtri}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Type Gaz" variant="h6"/>
                <h4>{gasFillingHighPressureStep?.gasType}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression pour l'expérience" variant="h6"/>
                <h4>{gasFillingHighPressureStep?.experimentPressure.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Opérateur" variant="h6"/>
                <h4>{gasFillingHighPressureStep?.operator}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Réalisé le" variant="h6"/>
                <h4>{gasFillingHighPressureStep?.dateOfFulfilment && dayjs(gasFillingHighPressureStep?.dateOfFulfilment).format('DD-MM-YYYY').toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Embase gaz" variant="h6"/>
                <h4>{gasFillingHighPressureStep?.gasBase}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Conteneur gaz" variant="h6"/>
                <h4>{gasFillingHighPressureStep?.gasContainer}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Observations" variant="h6"/>
                <h4>{gasFillingHighPressureStep?.observations}</h4>
            </StyledPaper>
        </Box>
    )
}