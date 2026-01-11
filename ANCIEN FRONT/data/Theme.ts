import {createTheme, lighten} from '@mui/material';
import {
    ACTIVE_STEP,
    ACTIVE_TAB_UNDERLINE_COLOR,
    BLACK,
    BLUE,
    BUTTON_ICON_BG,
    GREY,
    LIGHT_BLUE,
    LIGHT_GREY,
    RED,
    WHITE
} from './Color';

export let theme = createTheme();

theme = createTheme(theme, {
    typography: {
        fontSize: 12,
    },
    palette: {
        primary: {
            main: WHITE,
            contrastText: BLACK,
            dark: LIGHT_GREY
        },
        secondary: {
            main: BLUE,
            light: GREY,
        },
    },
    shape: {
        borderRadius: 3
    },
    components: {
        MuiAutocomplete: {
            styleOverrides: {
                listbox: {
                    maxHeight: '20vh',
                },
                root: {
                    minWidth: '100px',
                    display: 'inline-flex',
                    width: '10vw',
                    borderRadius: '8px',
                    '& .MuiTextField-root': {
                        width: '100%'
                    },
                    '&-popper': {
                        transform: (0),
                    }
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                color: 'secondary'
            },
            styleOverrides: {
                root: {
                    width: '10vw',
                    margin: 'auto',
                    minWidth: '100px'
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {},
                }
            }
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    width: 'auto',
                    margin: '2em'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    whiteSpace: 'nowrap',
                    padding: 8,
                    height: 24,
                    borderBottom: 'none',
                }
            }
        },
        MuiTableRow: {
            styleOverrides: {
                head: {
                    padding: 8,
                    '&:first-of-type .MuiTableCell-head': {
                        borderRadius: 0,
                    }
                },
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: GREY
                    },
                },

            }
        },
        MuiTableSortLabel: {
            styleOverrides: {
                root: {
                    '& .MuiTableSortLabel-icon': {
                        opacity: 0.3,
                    },
                    '&.Mui-active .MuiTableSortLabel-icon': {
                        color: BLACK
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                asterisk: {
                    color: RED,
                    '&$error': {
                        color: RED,
                    },
                },
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    color: 'rgba(0,0,0,0.6)',
                    '&.Mui-selected': {
                        color: BLACK,
                    },
                    '&.Mui-selected:after': {
                        display: 'block',
                        content: '""',
                        width: '70%',
                        height: '2px',
                        background: ACTIVE_TAB_UNDERLINE_COLOR,
                        position: 'absolute',
                        bottom: 0,
                        zIndex: 2,
                    },
                },
            }
        },
        MuiStepIcon: {
            styleOverrides: {
                root: {
                    width: '1.5em',
                    height: '1.5em',
                    color: WHITE,
                    borderRadius: '50%',
                    '&.Mui-active': {
                        color: `${ACTIVE_STEP} !important`,
                        text: {
                            fill: WHITE
                        },
                    },
                    '&.Mui-completed': {
                        color: BLUE
                    },
                    '& circle': {
                        stroke: BLUE,
                        strokeWidth: '4px'
                    },
                    text: {
                        fill: BLUE
                    }
                }
            }
        },
        MuiStepConnector: {
            styleOverrides: {
                root: {
                    top: '15px',
                    left: 'calc(-50% + 16px)',
                    right: 'calc(50% + 16px)'
                },
                line: {
                    borderColor: BLUE,
                    borderTopStyle: 'solid',
                    borderTopWidth: '0.4em'
                }

            }
        },
        MuiStepLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        cursor: 'pointer'
                    }
                },
                label: {
                    '&.Mui-completed': {
                        color: BLUE
                    },
                    '&.Mui-active': {
                        color: `${ACTIVE_STEP} !important`
                    },
                },
                labelContainer: {
                    justifyContent: 'center',
                    [theme.breakpoints.down('lg')]: {
                        display: 'none',
                    },
                    [theme.breakpoints.up('lg')]: {
                        display: 'inherit',
                    },
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '& > span:nth-of-type(2)': {
                        [theme.breakpoints.down('lg')]: {
                            display: 'none',
                        },
                        [theme.breakpoints.up('lg')]: {
                            display: 'inherit',
                        },
                    },
                    background: BLUE,
                    borderRadius: '8px',
                    color: WHITE,
                    '&:hover': {
                        backgroundColor: lighten(BLUE, 0.3),
                        color: WHITE,
                    },
                    '&.Mui-disabled': {
                        color: WHITE,
                        background: LIGHT_BLUE,
                    },
                    '& > span > svg': {
                        background: BUTTON_ICON_BG,
                        borderRadius: '6px'
                    },
                    '& > *:first-of-type': {
                        [theme.breakpoints.down('lg')]: {
                            margin: 0,
                        },
                    },
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                label: {
                    display: 'block',
                    alignItems: 'center',
                    lineHeight: '2.3em'
                },
                root: {
                    maxWidth: '110px'
                }
            }
        },
        MuiPaper: {
            defaultProps: {
                elevation: 3,
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: BLUE
                }
            }
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: BLUE
                }
            }
        }
    }

});