import {Box} from "@mui/material";
import {StyledPaper} from "../../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../../core/Title/Title.tsx";
import './FsecDetailsTabVuePhoto.scene.scss'
import {useFsecContext} from "../../../../hooks/contexts/Fsec.context.tsx";
import ReadOnlyField from "../../../../core/readyOnlyField/readOnlyField.tsx";

export default function FsecDetailsTabVuePhoto() {
    const {fsec: {versionUuid, picturesStep}} = useFsecContext();


    const stepVersion = picturesStep?.find((step) => step.versionUuid === versionUuid)
    return (
        <Box className="photos--content-container">
            <Box className="content--data-container">
                <StyledPaper>
                    <Title title="Operateur" variant="h6"/>
                    <ReadOnlyField title="Opérateur Photos" value={stepVersion?.fsecTeam?.[0]?.name}></ReadOnlyField>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Réalisé le" variant="h6"/>
                </StyledPaper>
                <StyledPaper className="data--last-item">
                    <Title title="Observation" variant="h6"/>
                </StyledPaper>
            </Box>
            <Box className="content--data-container">
                <StyledPaper>
                    <Title title="Photos pour le MOE" variant="h6"/>
                    {stepVersion?.fsecDocuments.map (
                        (document, index) =>
                            <ReadOnlyField title={document.subtype.label} value={document.path} key={index}></ReadOnlyField>
                    )}
                </StyledPaper>
            </Box>
        </Box>
    );
}
