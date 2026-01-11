import {useFsecContext} from "../../../hooks/contexts/Fsec.context.tsx";
import {Box} from "@mui/material";
import {StyledPaper} from "../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../core/Title/Title.tsx";
import dayjs from "dayjs";
import './StepsFields.scss'

export default function FsecDetailsTabAirtightnessScene() {
    const {fsec: {airthightnessTestLowPressureStep}} = useFsecContext();

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '2em'}}>
                <StyledPaper>
                    <Title title="Taux de fuite DTRI" variant="h6"/>
                    <h4>{airthightnessTestLowPressureStep?.leakRateDtri}</h4>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Type Gaz" variant="h6"/>
                    <h4>{airthightnessTestLowPressureStep?.gasType}</h4>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Pression pour l'expérience" variant="h6"/>
                    <h4>{airthightnessTestLowPressureStep?.experimentPressure.toString()}</h4>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Durée test d'étanchéité" variant="h6"/>
                    <h4>{airthightnessTestLowPressureStep?.airtightnessTestDuration.toString()}</h4>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Opérateur" variant="h6"/>
                    <h4>{airthightnessTestLowPressureStep?.operator}</h4>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Réalisé le" variant="h6"/>
                    <h4>{airthightnessTestLowPressureStep?.dateOfFulfilment && dayjs(airthightnessTestLowPressureStep?.dateOfFulfilment).format('DD-MM-YYYY').toString()}</h4>
                </StyledPaper>
        </Box>
    )
}