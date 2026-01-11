import CopyrightIcon from "@mui/icons-material/Copyright";
import {LIGHT_BLUE} from "../../data/Color";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import Title from "../../core/Title/Title";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import OptionsMoreIcon from "../../core/icon/OptionsMoreIcon";
import DataChip from "../../core/chip/DataChip.tsx";
import {SubdirectoryArrowRightRounded} from "@mui/icons-material";
import {useFsecContext} from "../../hooks/contexts/Fsec.context.tsx";
import {useNavigateCtrl} from "../../hooks/useNavigateCtrl.ts";
import DeleteOption from "../../core/options/DeleteOption.tsx";
import {useSnackBarContext} from "../home/Home.scene.tsx";
import {deleteFsec} from "../../services/fsec/fsec.service.ts";
import "./FsecName.scss"
import DuplicateFsecOption from "../../core/options/DuplicateFsecOption.tsx";

export default function FsecName() {
    const nav = useNavigateCtrl();
    const snackBar = useSnackBarContext()

    const {fsec}= useFsecContext();

    return (
        <Box display="inline-flex" alignItems="flex-end">
            <CopyrightIcon style={{fill: LIGHT_BLUE, fontSize: "3.5em"}}/>
            <Stack alignItems="flex-start" marginLeft={2}>
                <Stack direction="row" spacing={2}>
                    <DataChip label={fsec.designStep?.campaign?.type?.label}
                              color={fsec.designStep?.campaign?.type?.color}></DataChip>
                    <DataChip
                        label={fsec.category?.label}
                        color={fsec.category?.color}
                    ></DataChip>
                </Stack>
                <Box display="inline-flex" alignItems="center" marginTop={1}>
                    {fsec.designStep?.campaign ? <Title
                        title={`${fsec.designStep?.campaign?.year}−${fsec.designStep?.campaign?.installation?.label}_${fsec.designStep?.campaign?.name.toUpperCase()}-${fsec.designStep?.name}`}
                        variant="h4"
                        fontWeight="bold"
                    /> :
                        <Title
                            title={`${fsec.designStep?.name}`}
                            variant="h4"
                            fontWeight="bold"
                        />
                    }
                    <OptionsMoreIcon
                        options={
                            [
                                <DeleteOption key='DeleteOption'
                                              message="Etes-vous sur de vouloir supprimer cette FSEC ?"
                                              mode="full"
                                              deleteMethod={() => {
                                                  deleteFsec(fsec.versionUuid).then(() => {
                                                      nav('/fsecs')
                                                      snackBar.openSnackbar('La FSEC a bien été supprimée', 'success');

                                                  }).catch(responseError => {
                                                      responseError.json().then((json: any) => {
                                                          snackBar.openSnackbar(json.message, 'error');
                                                      });
                                                  });
                                              }}
                                />,
                                <DuplicateFsecOption fsec={fsec}
                                                     message="Voulez-vous vraiment dupliquer cette FSEC?"/>,

                            ]
                        }
                    />
                </Box>
                <Box display="inline-flex"
                     alignItems="center"
                     onDoubleClick={(e) => {
                         if (fsec.designStep?.campaign) {
                             nav(`/campagne-details/${fsec.designStep?.campaign?.uuid}/overview`, e)
                         }
                     }}
                     sx={{cursor: 'pointer'}}
                >
                    <SubdirectoryArrowRightRounded/>
                    <Title
                        title={fsec.designStep?.campaign ? `${fsec.designStep?.campaign.year}−${fsec.designStep?.campaign.installation.label}_${fsec.designStep?.campaign.name.toUpperCase()}` : "Pas de campagne associée"}
                        variant="h5"
                        fontWeight="bold"/>

                </Box>
                <Typography fontSize="0.7em">
                    Dernière modification effectuée le{" "}
                    <span style={{textDecoration: "underline"}}>
            {dayjs(fsec.lastUpdated).format("DD/MM/YYYY")}
          </span>
                </Typography>
            </Stack>
        </Box>
    );
}