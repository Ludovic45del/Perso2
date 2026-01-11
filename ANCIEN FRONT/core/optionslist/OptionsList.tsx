import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Collapse} from '@mui/material';
import React, {useState} from 'react';
import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';
import { useNavigateCtrl } from '../../hooks/useNavigateCtrl.ts';

interface OptionsListProps {
    data: IOptionList[];
}

export interface IOptionList {
    id: number,
    isFolder: boolean,
    name: string,
    depth: number,
    children?: IOptionList[] | undefined,
    onClick?: (updateChildrenCallback: (children: IOptionList[]) => void) => void
    urlToNav?: string
}

interface NestedState {
    [key: number]: boolean;
}


export default function OptionsList(props: OptionsListProps) {
    const theme = useTheme();
    const nav = useNavigateCtrl();
    const [showNested, setShowNested] = useState<NestedState>({});
    const openNested = (option: IOptionList) => {
        option.onClick && option.onClick((children: IOptionList[]) => {
            option.children = children;
            setShowNested({...showNested, [option.id]: true});
        });
    };

    const closeNested = (option: IOptionList) => {
        setShowNested({...showNested, [option.id]: false});
    };

    const label = (option: IOptionList) => (
        <ListItemText sx={{
            pl: theme.spacing(2 * option.depth),
            paddingY: theme.spacing(1.5),
            m: 0,
            '&:hover': {background: 'rgba(255,255,255,0.3)'},
        }} primary={option.name}/>
    );
    const dropdown = (option: IOptionList, nav: (path: string, event: React.MouseEvent<any>) => void) => (
        <ListItemButton sx={{
            pl: theme.spacing(2 * option.depth),
            paddingY: theme.spacing(1),
            '&:hover': {background: 'rgba(255,255,255,0.3)'},
        }}
                        onDoubleClick={(event) => {
                            event.stopPropagation();
                            option.urlToNav && nav(option.urlToNav, event);
                        }}
        >
            <ListItemText primary={option.name}
                          sx={{
                              maxWidth: `${183 - option.depth * 16}px`,
                              '& > span': {overflow: 'hidden', textOverflow: 'ellipsis'}
                          }}/>
            {showNested[option.id] ? <ExpandLess onClick={() => closeNested(option)}/> :
                <ExpandMore onClick={() => openNested(option)}/>}
        </ListItemButton>
    );
    return (
        <>{
            props.data.map((option: IOptionList) => (
                    <Box key={option.id}>
                        {option.isFolder ? dropdown(option, nav) : label(option)}
                        {option.children
                            && <Collapse in={showNested[option.id]} timeout="auto" unmountOnExit>
                                <OptionsList data={option.children}/>
                            </Collapse>}
                    </Box>
                )
            )
        }</>
    );
}
