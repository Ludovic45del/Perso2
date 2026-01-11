import {createContext, Suspense, useContext, useState} from 'react';
import Appbar from './components/Appbar';
import SideMenu from './components/Drawer';
import {Outlet} from 'react-router-dom';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {Alert, Snackbar} from '@mui/material';

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'isOpen'})<{
    isOpen?: boolean;
}>(({theme, isOpen}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-240px`,
    ...(isOpen && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface SnackbarData {
    openSnackbar: (message: string, severity: 'error' | 'warning' | 'info' | 'success') => void;
}

const SnackBarContext = createContext<SnackbarData>({} as SnackbarData);

export const useSnackBarContext = () => {
    const context = useContext(SnackBarContext);

    if (!context) {
        throw new Error('useSnackBarContext must be used in SnackBarContextProvider');
    }

    return context;
};


export function HomeScene() {
    const [isOpen, setIsOpen] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState<string>();
    const [severitySnackBar, setSeveritySnackBar] = useState<'error' | 'warning' | 'info' | 'success'>('info');


    const changeStateIsOpen = (): void => {
        setIsOpen(!isOpen);
    };


    return (
        <Box sx={{display: 'flex'}}>
            <Appbar changeStateIsOpen={changeStateIsOpen} isOpen={isOpen}/>
            <SideMenu isOpen={isOpen} changeStateIsOpen={changeStateIsOpen} drawerWidth='240px'/>
            <Main sx={{display: 'relative', height: 'calc(100% - 64px)', marginTop: '64px'}} isOpen={isOpen}>
                <Suspense>
                    <SnackBarContext.Provider value={{
                        openSnackbar: (message, severity) => {
                            setMessageSnackBar(message);
                            setSeveritySnackBar(severity);
                        }
                    }}>
                        <Outlet/>
                    </SnackBarContext.Provider>
                </Suspense>
                <Snackbar
                    open={messageSnackBar !== undefined}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    autoHideDuration={3000}
                    onClose={() => setMessageSnackBar(undefined)}
                >
                    <Alert severity={severitySnackBar}>
                        {messageSnackBar}
                    </Alert>
                </Snackbar>
            </Main>
        </Box>
    );
}

