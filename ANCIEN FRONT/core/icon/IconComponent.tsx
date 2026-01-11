import * as Icons from '@mui/icons-material';
import { SxProps } from '@mui/material';
import {MouseEvent} from "react";


export type IconNames = keyof typeof Icons

export type IconProps = {
    iconName: IconNames;
    titleAccess: string;
    clickHandler?: (event?: MouseEvent<SVGSVGElement>) => void;
    sx?: SxProps;
    id?: string;
}

export default function IconComponent(iconProps: IconProps) {
    const Icon = Icons[iconProps.iconName];
    return <Icon data-testid={iconProps.id ? iconProps.id : 'default-data-testid'} onClick={iconProps.clickHandler}
                 titleAccess={iconProps.titleAccess}
                 sx={iconProps.sx}
                 fontSize="small"/>;
}