import {Box} from "@mui/material";
import {StyledPaper} from "../../../../core/StyledPaper/StyledPaper.tsx";
import Title from "../../../../core/Title/Title.tsx";
import './FsecDetailsTabControleMetrologique.scene.scss'
import {useFsecContext} from "../../../../hooks/contexts/Fsec.context.tsx";
import ReadOnlyField from "../../../../core/readyOnlyField/readOnlyField.tsx";

export default function FsecDetailsTabControleMetrologique() {
    const {fsec: {versionUuid, metrologyStep, sealingStep, rack}} = useFsecContext();

    const stepVersion = metrologyStep?.find((step) => step.versionUuid === versionUuid)

    return (
        <Box className="metrologie--content-container">
            <Box className="content--data-container">
                <StyledPaper>
                    <Title title="Nom Métrologue" variant="h6"/>
                    <ReadOnlyField title="Métrologue" value={stepVersion?.fsecTeam?.[0]?.name}></ReadOnlyField>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Livrables" variant="h6"/>
                    {stepVersion?.fsecDocuments.map (
                        (document, index) =>
                            <ReadOnlyField title={document.subtype.label} value={document.path} key={index}></ReadOnlyField>
                    )}
                </StyledPaper>
            </Box>
            <Box className="content--data-container">
                <StyledPaper>
                    <Title title="Nom de la machine" variant="h6"/>
                    <ReadOnlyField title="Machine" value={stepVersion?.machine?.label}></ReadOnlyField>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Conteneur ou rack" variant="h6"/>
                    <ReadOnlyField title="Rack" value={rack?.label}></ReadOnlyField>
                </StyledPaper>
                <StyledPaper>
                    <ReadOnlyField title="Réalisé le" value={stepVersion?.date?.toString()}></ReadOnlyField>
                </StyledPaper>
            </Box>
            <Box className="content--data-container">
                <StyledPaper className="data--full-item">
                    <Title title="Interface IO" variant="h6"/>
                    <p>{sealingStep?.interfaceIO}</p>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Observation" variant="h6"/>
                    <p>{stepVersion?.comments}</p>
                </StyledPaper>
                <StyledPaper>
                    <Title title="Responsable" variant="h6"/>
                </StyledPaper>
            </Box>
        </Box>
    );
}
