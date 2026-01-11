import { act, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { frFR, LocalizationProvider } from '@mui/x-date-pickers';
import { theme } from './data/Theme';
import { ThemeProvider } from '@mui/material';
import { Router as RemixRouter } from '@remix-run/router/dist/router';
import { describe, expect, it, vi } from 'vitest';
import { YearSemesterModel } from './scenes/home/components/model/Menu.model';
import {routerConfig} from "./router";
import '@testing-library/jest-dom';

const getRouterMock = (initialEntries: string) => {
    return createMemoryRouter(routerConfig, {
        initialEntries: [initialEntries],
    });
};

const renderApp = async (routerMock: RemixRouter) => {
    // await act(async () => {
    await render(
        <LocalizationProvider dateAdapter={AdapterDayjs}
                              adapterLocale="fr"
                              localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={routerMock}/>
            </ThemeProvider>
        </LocalizationProvider>
    );
    // });
};

describe('render <App/> with the appropriate UI', () => {
    beforeEach(() => {

        vi.mock('./services/account/user.services', () => ({
            defaults: vi.fn(),
            getUsername: vi.fn(() => Promise.resolve({
                username: 'username',
                groups: ['groupname']
            })),
        }));

        vi.mock('./services/menu/menu.service', () => ({
            defaults: vi.fn(),
            getYearSemester: () => {
                return Promise.resolve([{
                    semester: 'S2',
                    year: '2024',
                }] as YearSemesterModel[]);
            },
        }));
    });

    it('should render home page scene', async () => {
        // Arrange

        // Act
        await act(async () => {
            const router = getRouterMock('/');
            renderApp(router);
        });

        // Assert
        expect(await screen.findByText('Campagnes')).toBeInTheDocument();
        expect(await screen.findByText('Edifices Cibles')).toBeInTheDocument();
        expect(await screen.findByText('Indicateurs')).toBeInTheDocument();
        expect(await screen.findByText('FA')).toBeInTheDocument();
        expect(await screen.findByText('Planning')).toBeInTheDocument();
        expect(await screen.findByText('Stocks')).toBeInTheDocument();
    });

});
