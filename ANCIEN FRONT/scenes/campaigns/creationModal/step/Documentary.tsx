import {useFieldArray, useFormContext} from "react-hook-form";
import CampaignModel from "../../../../core/domain/campaign/Campaign.model.ts";
import {Grid} from "@mui/material";
import {useEffect, useState} from "react";
import {getCampaignDocumentType} from "../../../../services/campaign/campaignDocuments.service.ts";
import DocumentaryItem from "./DocumentaryItem.tsx";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import '../CreationModal.scss'
import CampaignDocumentTypeModel from "../../../../core/domain/campaign/referential/CampaignDocumentTypes.model.ts";


export default function Documentary() {
    const [documentTypes, setDocumentTypes] = useState<CampaignDocumentTypeModel[]>([])

    useEffect(() => {
        getCampaignDocumentType().then(documentTypes => setDocumentTypes(documentTypes))
    }, []);

    const {control} = useFormContext<CampaignModel>();
    const {fields, append, remove} = useFieldArray({
        control: control,
        name: 'campaignDocuments',
    });

    return <Grid container className='documentary-grid'>
        <Grid item xs={2} className='grid-header'>
            <p>Nom</p>
        </Grid>
        <Grid item xs={4} className='grid-header'>
            <p>Lien</p>
        </Grid>
        <Grid item xs={2.5} className='grid-header'>
            <p>Type</p>
        </Grid>
        <Grid item xs={2.5} className='grid-header'>
            <p>Sous-type</p>
        </Grid>
        <Grid item xs={1} className='grid-header'>
            <Button onClick={() => append({name: '', path: '', type: null, subtype: null})}>
                <AddIcon/>
            </Button>
        </Grid>
        {fields.map((document, index) =>
            <DocumentaryItem
                key={document.id}
                index={index}
                documentsType={documentTypes}
                remove={remove}
            />
        )}
    </Grid>
}