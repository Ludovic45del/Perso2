import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Popover, Stack} from '@mui/material';
import React, {Fragment, ReactNode} from 'react';

interface ActionsMoreIconProps {
    options: ReactNode[]
}


export default function OptionsMoreIcon({options}: ActionsMoreIconProps) {
    const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);


    const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return <>
        <MoreVertIcon style={{fontSize: '1.5em', cursor: 'pointer'}} titleAccess={'Options'} onClick={handleClick}/>
        <Popover open={open}
                 anchorEl={anchorEl}
                 onClose={handleClose}
                 anchorOrigin={{
                     vertical: 'top',
                     horizontal: 'right',
                 }}
                 sx={{'& .MuiPopover-paper': {borderRadius: '8px'}}}>
            <Stack>
                {options.map((option, index: number) => <Fragment key={index}>{option}</Fragment>)}
            </Stack>
        </Popover>
    </>;
}