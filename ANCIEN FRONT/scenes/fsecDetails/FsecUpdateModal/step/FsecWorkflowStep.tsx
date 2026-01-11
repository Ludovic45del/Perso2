import FsecStatusModel from "../../../../core/domain/fsec/referentials/FsecStatus.model.ts";
import {getAllFsecStatusByCategory} from "../../../../services/fsec/fsecStatus.service.ts";
import {Controller, useFormContext} from "react-hook-form";
import Box from "@mui/material/Box";
import {Paper} from "@mui/material";
import {WHITE} from "../../../../data/Color.ts";
import {useEffect, useState} from "react";
import '../../../campaignDetails/CampaignDetails.scene.scss'
import FsecActiveModel from "../../../../core/domain/fsec/FsecActive.model.ts";

export default function  FsecWorkflowStep() {
    const [fsecStatuses, setFsecStatuses] = useState<FsecStatusModel[]>([])
    const {formState: {defaultValues}} = useFormContext<FsecActiveModel>()


    useEffect(() => {
        getAllFsecStatusByCategory(defaultValues?.category?.label).then((status: FsecStatusModel[]) => setFsecStatuses(status))
    }, []);

    const {control, setValue, watch} = useFormContext()


    return<Box width='100%'>
        <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' height='60%'>
            {fsecStatuses.map(fsecStatus =>
                <Controller
                    key={fsecStatus.id}
                    name={'status'}
                    control={control}
                    render={({field: {ref, ...rest}}) => (
                        <Paper sx={{background: fsecStatus.id === watch('status').id ? fsecStatus.color : WHITE}}
                               className='status-paper'
                               onClick={() => setValue('status', fsecStatus, {shouldDirty: true})} {...rest}>
                            {fsecStatus.label}
                        </Paper>
                    )}/>
            )}
        </Box>

    </Box>

}