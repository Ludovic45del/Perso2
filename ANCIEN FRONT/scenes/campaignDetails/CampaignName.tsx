import CopyrightIcon from "@mui/icons-material/Copyright";
import {LIGHT_BLUE} from "../../data/Color";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import Title from "../../core/Title/Title";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import OptionsMoreIcon from "../../core/icon/OptionsMoreIcon";
import DataChip from "../../core/chip/DataChip.tsx";
import {useCampaignContext} from "../../hooks/contexts/Campaign.context.tsx";
import {deleteCampaign} from "../../services/campaign/campaign.service.ts";
import DeleteOption from "../../core/options/DeleteOption.tsx";
import {useSnackBarContext} from "../home/Home.scene.tsx";
import {useNavigate} from "react-router-dom";
import './CampaignName.scss'
import DuplicateCampaignOption from "../../core/options/DuplicateCampaignOption.tsx";

export default function CampaignName() {
    const {campaign} = useCampaignContext();
    const nav = useNavigate();
    const snackBar = useSnackBarContext()
    return (
        <Box display="inline-flex" alignItems="flex-end">
            <CopyrightIcon style={{fill: LIGHT_BLUE, fontSize: "3.5em"}}/>
            <Stack alignItems="flex-start" marginLeft={2}>
                <Stack direction="row" spacing={2}>
                    <DataChip label={campaign.type?.label} color={campaign.type?.color}></DataChip>
                    <DataChip
                        label={campaign.installation?.label}
                        color={campaign.installation?.color}
                    ></DataChip>
                </Stack>
                <Box display="inline-flex" alignItems="center" marginTop={1}>
                    <Title
                        title={`${campaign.year}-${campaign.installation?.label}_${campaign.name}`}
                        variant="h4"
                        fontWeight="bold"
                    />
                    <OptionsMoreIcon
                        options={
                            [
                                <DeleteOption key='DeleteOption' message="Etes-vous sur de vouloir supprimer cette campagne ?" mode="full"
                                      deleteMethod={() => {
                                          deleteCampaign(campaign.uuid).then(() => {
                                              nav('/campagnes')
                                              snackBar.openSnackbar('La campagne a bien été supprimée', 'success');

                                          }).catch(responseError => {
                                              responseError.json().then((json: any) => {
                                                  snackBar.openSnackbar(json.message, 'error');
                                              });
                                          });
                                      }}
                                />,
                                <DuplicateCampaignOption campaign={campaign} message="Voulez-vous vraiment dupliquer cette campagne?"/>,
                            ]
                        }
                    />
                </Box>
                <Typography fontSize="0.7em">
                    Dernière modification effectuée le{" "}
                    <span style={{textDecoration: "underline"}}>
            {dayjs(campaign.lastUpdate).format("DD/MM/YYYY")}
          </span>
                </Typography>
            </Stack>
        </Box>
    );
}