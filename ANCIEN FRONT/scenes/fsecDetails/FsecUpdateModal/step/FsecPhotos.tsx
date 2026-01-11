import Box from "@mui/material/Box";
import ControlledDatePicker from "../../../../core/formComponents/ControlledDatePicker.tsx";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import './FsecPhotos.scss'
import {useFormContext} from "react-hook-form";
import {
    fsecDescriptionValidation,
} from "../../../fsecs/creationModal/FsecSchema.tsx";
import FsecActiveModel from "../../../../core/domain/fsec/FsecActive.model.ts";

export default function FsecPhotos() {
    const {formState: {defaultValues}} = useFormContext<FsecActiveModel>()

    return <Box className="parent">
        <Box className="fsec--photos-container">
            <Box>
                <ControlledTextField
                    keyName='picturesStep.fsecTeam.0.name'
                    label='Equipe'
                    title='Equipe'
                />
                <ControlledDatePicker
                    keyName='picturesStep.lastUpdated'
                    label='Réalisé le'
                    title="Réalisé le"
                />
            </Box>
            <Box>
                {defaultValues.picturesStep?.fsecDocuments?.map((fsecDocument, index) => <ControlledTextField
                    keyName={`picturesStep.fsecDocuments.${index}.path`}
                    label='Path'
                    title={fsecDocument.subtype.label}
                    key={index}
                />)}
            </Box>

            <Box>
                <ControlledTextField
                    keyName='picturesStep.comments'
                    label='Remarques'
                    title='Remarques'
                    multiline
                    validationSchema={fsecDescriptionValidation}
                />
            </Box>
        </Box>
    </Box>
}
