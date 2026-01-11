import {styled} from '@mui/material/styles';
import {Paper} from '@mui/material';

export const StyledPaper = styled(Paper, {
    name: 'StyledPaper',
    slot: 'Wrapper',
})((props: {width?: string, display?:string}) => ({
    width: props.width,
    display:props.display,
    padding: '1em',
    borderRadius: 16,
}))