import {Box} from "@mui/material";
import {StyledPaper} from "../../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../../core/Title/Title.tsx";
import './FsecDetailsTabAssemblage.scene.scss'
import {useFsecContext} from "../../../../hooks/contexts/Fsec.context.tsx";
import ReadOnlyField from "../../../../core/readyOnlyField/readOnlyField.tsx";

export default function FsecDetailsTabAssemblage() {
    const {fsec: {versionUuid, assemblyStep}} = useFsecContext();

    const stepVersion = assemblyStep?.find((step) => step.versionUuid === versionUuid)

    return <Box className="assemblage--content-container">
        <Box className="content--data-container">
            <StyledPaper>
                <Title title="Banc utilisé" variant="h6"/>
                {stepVersion?.assemblyBench?.map (
                    (bench, index) =>
                        <ReadOnlyField title={'Banc Numéro '+(index+1)} value={bench.label} key={index}></ReadOnlyField>
                )}
            </StyledPaper>
            <StyledPaper>
                <Title title="Assembleur" variant="h6"/>
                <ReadOnlyField title="Assembleur" value={stepVersion?.fsecTeam?.[0]?.name}></ReadOnlyField>
            </StyledPaper>
            <StyledPaper>
                <Title title="Observations" variant="h6"/>
                <p>{stepVersion?.comments}</p>
            </StyledPaper>
            <StyledPaper className="data--last-item">
                <Title title="Listing éléments" variant="h6"/>
            </StyledPaper>
        </Box>
    </Box>;
}
