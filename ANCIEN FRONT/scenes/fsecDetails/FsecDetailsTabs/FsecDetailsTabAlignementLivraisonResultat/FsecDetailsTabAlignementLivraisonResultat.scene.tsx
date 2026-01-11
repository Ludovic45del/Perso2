import {Box} from "@mui/material";
import {StyledPaper} from "../../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../../core/Title/Title.tsx";
import './FsecDetailsTabAlignementLivraisonResultat.scene.scss'
import {useFsecContext} from "../../../../hooks/contexts/Fsec.context.tsx";
import ReadOnlyField from "../../../../core/readyOnlyField/readOnlyField.tsx";

export default function FsecDetailsTabAlignementLivraisonResultat() {
    const {fsec: {installedStep}} = useFsecContext();

    return (
        <Box className="alignement--content-container">
            <Box className="content--data-container">
                <StyledPaper>
                    <Title title="Alignement" variant="h6"/>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Tir" variant="h6"/>
                    <ReadOnlyField title="Date de tir" value={installedStep?.shootingDate?.toString()}></ReadOnlyField>
                    <ReadOnlyField title="ExperienceSRxx" value={installedStep?.experienceSRxx}></ReadOnlyField>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Livraison" variant="h6"/>
                </StyledPaper>
            </Box>
        </Box>
    );
}
