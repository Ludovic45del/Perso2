import React from 'react';
import './App.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { frFR, LocalizationProvider } from '@mui/x-date-pickers';
import 'dayjs/locale/fr';
import { ThemeProvider } from '@mui/material';
import { theme } from './data/Theme';
import {routerConfig} from "./router.tsx";
import './data/variable.scss'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"


dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Europe/Paris');


export default function  App() {
    const router = createBrowserRouter(routerConfig);

    return (
        <React.StrictMode>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr"
                                  localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}>
                <ThemeProvider theme={theme}>
                    <RouterProvider router={router}/>
                </ThemeProvider>
            </LocalizationProvider>
        </React.StrictMode>
    );
}



