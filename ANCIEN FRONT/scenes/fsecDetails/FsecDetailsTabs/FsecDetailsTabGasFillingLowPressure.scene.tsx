import {useFsecContext} from "../../../hooks/contexts/Fsec.context.tsx";
import {Box} from "@mui/material";
import {StyledPaper} from "../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../core/Title/Title.tsx";
import dayjs from "dayjs";
import './StepsFields.scss'

export default function FsecDetailsTabGasFillingLowPressureScene() {
    const {fsec: {gasFillingLowPressureStep}} = useFsecContext();

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '2em'}}>
            <StyledPaper>
                <Title title="Taux de fuite DTRI" variant="h6"/>
                <h4>{gasFillingLowPressureStep?.leakRateDtri}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Type Gaz" variant="h6"/>
                <h4>{gasFillingLowPressureStep?.gasType}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Pression pour l'expérience" variant="h6"/>
                <h4>{gasFillingLowPressureStep?.experimentPressure?.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Durée test d'étanchéité" variant="h6"/>
                <h4>{gasFillingLowPressureStep?.leakTestDuration?.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Observations" variant="h6"/>
                <h4>{gasFillingLowPressureStep?.operator}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Réalisé le" variant="h6"/>
                <h4>{dayjs(gasFillingLowPressureStep?.dateOfFulfilment).format('DD-MM-YYYY')?.toString()}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Embase gaz" variant="h6"/>
                <h4>{gasFillingLowPressureStep?.gasBase}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Conteneur gaz" variant="h6"/>
                <h4>{gasFillingLowPressureStep?.gasContainer}</h4>
            </StyledPaper>
            <StyledPaper>
                <Title title="Observations" variant="h6"/>
                <h4>{gasFillingLowPressureStep?.observations}</h4>
            </StyledPaper>
        </Box>
    )
}