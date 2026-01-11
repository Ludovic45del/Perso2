import {useEffect, useState} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {getUsername} from '../../../services/account/user.services';
import UserModel from '../../../core/domain/User.model';
import {Stack, Tab, Tabs} from '@mui/material';
import {getActiveTab, TabData} from '../../../services/utils/TabsUtils.service';

import './Appbar.css';
import { useNavigateCtrl } from '../../../hooks/useNavigateCtrl.ts';
import {useLocation} from "react-router-dom";


const tabsArray: TabData[] = [
    {label: 'Campagnes', path: '/campagnes', subpath:'campagne'},
    {label: 'Edifices Cibles', path: '/fsecs', subpath:'fsec'},
    {label: 'FA', path: '/fa'},
    {label: 'Indicateurs', path: '/indicateurs'},
    {label: 'Planning', path: '/planning'},
    {label: 'Stocks', path: '/stocks'}];

interface AppBarSceneProps extends MuiAppBarProps {
    isOpen: boolean;
    changeStateIsOpen?: () => void;
}

const Appbar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'isOpen',
})<AppBarSceneProps>(({theme, isOpen}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(isOpen && {
        width: `calc(100% - 240px})`,
        marginLeft: `240px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function AppBar(props: AppBarSceneProps) {
    const theme = useTheme();
    const nav = useNavigateCtrl();
    const [username, setUsername] = useState('');
    const [activeTab, setActiveTab] = useState<number | false>(getActiveTab(tabsArray));
    const location = useLocation();


    useEffect(() => {
        const indexTab = tabsArray.findIndex(tab => location.pathname.includes(tab.subpath));
        if (indexTab > -1) {
            setActiveTab(indexTab)
        }
    }, [location]);

    useEffect(() => {
        getUsername().then((data: UserModel) => {
            if (data.groups && data.groups[0]) {
                setUsername(`${data.username} - ${data.groups[0]}`);
            } else {
                setUsername(`${data.username}`);
            }
        });
    }, []);

    return (
        <Appbar position="fixed" isOpen={props.isOpen}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={props.changeStateIsOpen}
                    edge="start"
                    sx={{zIndex: theme.zIndex.drawer + 1, mr: 6, ...(props.isOpen && {display: 'none'})}}
                >
                    <MenuIcon/>
                </IconButton>
                <img
                    className="app-bar-logo"
                    onClick={(e) => {
                        setActiveTab(false);
                        nav('/dashboard',e);
                    }}
                    height={50} width={50}
                    src={'/CEALogo.png'}
                    alt="CEA Logo"
                />
                <Stack width="100%" flexWrap="nowrap" direction="row" spacing={{xs: 1, sm: 2, md: 4}}
                       sx={{marginLeft: 6}}>
                    <Tabs value={activeTab} onChange={(_, nextTab) => setActiveTab(nextTab)}>
                        {tabsArray.map((tab: TabData, index) =>
                            <Tab key={tab.label}
                                 onClick={(e) => {
                                     const currentPath = window.location.pathname
                                     if (!currentPath.includes(tab.path)){
                                         nav(tab.path, e)
                                     }
                                 }}
                                 label={tab.label}
                                 value={index}
                            />)}
                    </Tabs>
                    <Box flexGrow={1} justifyContent="center" display="flex">
                    </Box>
                    <Box display="flex">
                        <Typography margin="auto">
                            {username}
                        </Typography>
                    </Box>
                </Stack>
            </Toolbar>
        </Appbar>
    );
}