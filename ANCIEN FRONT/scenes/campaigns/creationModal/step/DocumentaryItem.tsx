import {Fragment} from "react";
import {Grid} from "@mui/material";
import ControlledTextField from "../../../../core/formComponents/ControlledTextField.tsx";
import ControlledAutocomplete from "../../../../core/formComponents/ControlledAutocomplete.tsx";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import CampaignDocumentTypeModel from "../../../../core/domain/campaign/referential/CampaignDocumentTypes.model.ts";
import {useFormContext, useWatch} from "react-hook-form";
import CampaignDocumentSubtypeModel
    from "../../../../core/domain/campaign/referential/CampaignDocumentSubtype.model.ts";
import CampaignModel from "../../../../core/domain/campaign/Campaign.model.ts";


interface DocumentaryItemProps {
    documentsType: CampaignDocumentTypeModel[],
    index: number
    remove: (index?: number | number[]) => void
}


export default function DocumentaryItem({index, remove, documentsType}: DocumentaryItemProps) {

    const {setValue} = useFormContext<CampaignModel>();
    const selectedType: CampaignDocumentTypeModel = useWatch({name: `campaignDocuments.${index}.type`});
    const subtypes: CampaignDocumentSubtypeModel[] = documentsType.find(type => type.id === selectedType?.id)?.subtype

    return <Fragment>
        <Grid item xs={2}>
            <ControlledTextField label='Nom'
                                 keyName={`campaignDocuments.${index}.name`}
            />
        </Grid>
        <Grid item xs={4}>
            <ControlledTextField label='Path'
                                 keyName={`campaignDocuments.${index}.path`}
            />
        </Grid>
        <Grid item xs={2.5}>
            <ControlledAutocomplete label="Type de documents"
                                    keyName={`campaignDocuments.${index}.type`}
                                    options={documentsType}
                                    isOptionEqualToValue={(option, value) => option.number === value.number}
                                    getOptionLabel={option => option.label}
                                    onChange={(optionSelected, setType) =>  {
                                        setType(optionSelected);
                                        setValue(`campaignDocuments.${index}.subtype`, null)
                                    }}
            />
        </Grid>
        <Grid item xs={2.5}>
            <ControlledAutocomplete label="Sous-type de documents"
                                    keyName={`campaignDocuments.${index}.subtype`}
                                    options={subtypes || []}
                                    isOptionEqualToValue={(option, value) => option.number === value.number}
                                    getOptionLabel={option => option.label}
            />
        </Grid>
        <Grid item xs={1}>
            <Button onClick={() => remove(index)}>
                <DeleteIcon/>
            </Button>
        </Grid>
    </Fragment>

}