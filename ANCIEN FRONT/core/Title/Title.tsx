import Typography from '@mui/material/Typography';
import {Variant} from '@mui/material/styles/createTypography';
import {Stack, Tooltip} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface TitleProps {
    title: string;
    variant?: Variant;
    padding?: number | string;
    fontWeight?: string;
    marginRight?: string;
    marginLeft?: string;
    margin?: string;
    maxWidth?: string;
    tooltipLabel?: string;
}

export default function Title(props: TitleProps) {

    return <Stack direction="row" spacing={2} marginBottom={0} alignItems="center" margin={props.margin}
                  marginLeft={props.marginLeft}>
        <Typography sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }} padding={props?.padding} variant={props?.variant ?? 'h3'} component="h2"
                    marginRight={props.marginRight}
                    fontWeight={props.fontWeight} textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap"
                    maxWidth={props.maxWidth}>
            {props.title}
        </Typography>
        {props.tooltipLabel && <Tooltip title={props.tooltipLabel}>
            <InfoOutlinedIcon />
        </Tooltip>}
    </Stack>;
}