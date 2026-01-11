import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import {useEffect, useState} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import {ChevronLeft} from '@mui/icons-material';
import OptionsList, {IOptionList} from "../../../core/optionslist/OptionsList.tsx";

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

interface SideMenuProps {
    drawerWidth: string,
    isOpen: boolean,
    changeStateIsOpen: () => void
}


export default function SideMenu(props: SideMenuProps) {
    const theme = useTheme();
    const [menuData] = useState<IOptionList[]>([]);

    function updateData() {
        // getYearSemester().then((yearsSemesters: YearSemesterModel[]) => {
        //     setMenuData(generateYearSemesterOption(yearsSemesters));
        // });
    }

    useEffect(() => {
        window.addEventListener('UpdateSideMenu', () => {
            updateData()
        })
        updateData()
    }, []);

    return <Drawer
        sx={{
            width: props.drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                background: theme.palette.secondary.main,
                color: theme.palette.primary.main,
                width: props.drawerWidth,
                boxSizing: 'border-box',
                '& .MuiButtonBase-root': {
                    color: theme.palette.primary.main
                }
            },
        }}
        variant="persistent"
        anchor="left"
        open={props.isOpen}
    >
        <DrawerHeader>
            <IconButton onClick={props.changeStateIsOpen}>
                {<ChevronLeft/>}
            </IconButton>
        </DrawerHeader>
        <Divider/>
        <OptionsList data={menuData}/>
    </Drawer>;
}


