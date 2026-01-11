import CampaignStatusModel from "../../../../core/domain/campaign/referential/CampaignStatus.model.ts";
import {Controller, useFormContext} from "react-hook-form";
import Box from "@mui/material/Box";
import {Paper} from "@mui/material";
import {WHITE} from "../../../../data/Color.ts";
import {useEffect, useState} from "react";
import {getAllCampaignStatus} from "../../../../services/campaign/campaignStatus.service.ts";


export default function WorkflowStep() {

    const [campaignStatuses, setCampaignStatuses] = useState<CampaignStatusModel[]>([])

    useEffect(() => {
        getAllCampaignStatus().then((status: CampaignStatusModel[]) => setCampaignStatuses(status))
    }, []);

    const {control, setValue, watch} = useFormContext()

    return <Box width='100%'>
        <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' height='60%'>
            {campaignStatuses.map(campaignStatus =>
                <Controller
                    key={campaignStatus.id}
                    name={'status'}
                    control={control}
                    render={({field: {ref, ...rest}}) => (
                        <Paper sx={{background: campaignStatus.id === watch('status').id ? campaignStatus.color : WHITE}}
                               className='status-paper'
                               onClick={() => setValue('status', campaignStatus, {shouldDirty: true})} {...rest}>
                            {campaignStatus.label}
                        </Paper>
                    )}/>
            )}
        </Box>

    </Box>
}