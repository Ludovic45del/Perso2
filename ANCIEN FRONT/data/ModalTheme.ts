import {createTheme, Theme} from '@mui/material';
import {WHITE} from './Color';

export function getModalTheme() {
    return (theme: Theme) =>
        createTheme({
            ...theme,
            components: {
                ...theme.components,
                MuiAutocomplete: {
                    defaultProps: {
                        fullWidth: true,
                    },
                    styleOverrides:{
                        ...theme.components?.MuiAutocomplete?.styleOverrides,
                        root: {
                            height: '40px'
                        }
                    }
                },
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            margin: 'auto',
                            width: '95%',
                            height: '40px'
                        }
                    }
                },
                MuiTypography: {
                    defaultProps: {
                        marginBottom: '0.5rem'
                    }
                },
            },
        });
}

export const styleModalBox = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85vw',
    background: WHITE,
    padding:4,
    borderRadius: 4,
    zIndex: 1000
};
