import { useState } from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {uploadFile} from "../../services/stock/fileUpload.service.ts";
import Title from "../Title/Title.tsx";
import {useSnackBarContext} from "../../scenes/home/Home.scene.tsx";
import {Download, UploadFile} from "@mui/icons-material";


export default function FileUploadButton() {
    const [selectedFile, setSelectedFile] = useState(null);
    const {openSnackbar} = useSnackBarContext();

    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);

    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        uploadFile(formData)
            .then((response) => {
                openSnackbar('Toutes les lignes ont été importées avec succès', 'success');
                setTimeout(()=>{
                    window.location.reload()
                }, 2000)
            })
            .catch((error) => {
                error.json().then((json: any) => {
                    openSnackbar(json.message, 'error');
                });
            });
    };

    return (
        <Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: '2em', alignItems: 'center', marginBottom: '0.5em'}}>
                <input id='upload-input' type="file" onChange={handleFileChange} hidden/>
                <Button onClick={() => document.getElementById('upload-input').click()}><UploadFile></UploadFile> Sélectionner un fichier</Button>
                <Button disabled={!selectedFile} onClick={handleUpload}><Download></Download> Télécharger</Button>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                {selectedFile ? <Title title={selectedFile.name} variant={'subtitle2'}></Title> :
                    <Title title="Aucun fichier sélectionné" variant={'subtitle2'}></Title>}
            </Box>
        </Box>
    );
}
