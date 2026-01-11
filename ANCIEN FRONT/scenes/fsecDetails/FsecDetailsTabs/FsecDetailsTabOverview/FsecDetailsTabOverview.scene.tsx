import {Box} from "@mui/material";
import {StyledPaper} from "../../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../../core/Title/Title.tsx";
import './FsecDetailsTabOverview.scene.scss'
import {useFsecContext} from "../../../../hooks/contexts/Fsec.context.tsx";
import ReadOnlyField from "../../../../core/readyOnlyField/readOnlyField.tsx";

export default function FsecDetailsTabOverview() {
    const {fsec: {designStep, installedStep}} = useFsecContext();

    return (
        <Box className="overiew--content-container">
            <Box className="content--data-container">
                <Box className="data--first-item">
                    <StyledPaper>
                        <Title title="Date du tir" variant="h6"/>
                        <Box sx={{textAlign: "center"}}>
                            <h4>{installedStep?.shootingDate?.toString()}</h4>
                        </Box>
                    </StyledPaper>
                    <StyledPaper>
                        <Title title="Identifiant Embase" variant="h6"/>
                    </StyledPaper>
                </Box>
                <Box  className="data--last-item">
                    <StyledPaper>
                        <Title title="Planning" variant="h6"/>
                    </StyledPaper>
                    <StyledPaper>
                        <Title title="FA" variant="h6"/>
                    </StyledPaper>
                </Box>
            </Box>
            <Box className="content--data-container">
                <StyledPaper>
                    <Title title="Pièces Jointes" variant="h6"/>
                        {designStep?.fsecDocuments.map (
                            (document, index) =>
                                <ReadOnlyField title={document.subtype.label} value={document.path} key={index}></ReadOnlyField>
                        )}
                </StyledPaper>
                <StyledPaper>
                    <Title title="Equipe projet" variant="h6"/>
                    {designStep?.fsecTeam.map (
                        (team, index) =>
                            <ReadOnlyField title={team.role.label} value={team.name} key={index}></ReadOnlyField>
                    )}
                </StyledPaper>
            </Box>
            <Box className="content--data-container">
                <StyledPaper>
                    <Title title="Photo" variant="h6"/>
                </StyledPaper>
            </Box>
        </Box>
    );
}
