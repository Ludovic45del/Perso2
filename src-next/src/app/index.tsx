/**
 * App Entry Point
 * @module app
 */

import { RouterProvider } from 'react-router-dom';
import { Providers } from './providers';
import { router } from './router';
import { NotificationSnackbar } from '@shared/ui';

export function App() {
    return (
        <Providers>
            <RouterProvider router={router} />
            <NotificationSnackbar />
        </Providers>
    );
}
