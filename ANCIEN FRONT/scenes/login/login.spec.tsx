import { act, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import LoginPage from './login';
import '@testing-library/jest-dom';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        useNavigate: () => navigateMock,
    };
});

describe('LoginPage', () => {
    beforeEach(() => {

        vi.mock('../../services/account/login.services', () => ({
            defaults: vi.fn(),
            loginServices: vi.fn().mockResolvedValue({
                json: () => Promise.resolve({token: 'test-token'})
            }),
        }));
    });

    it('renders without crashing', () => {
        render(<LoginPage/>);
    });

    it('updates username and password on input change', async () => {
        const {getByLabelText} = render(<LoginPage/>);
        const usernameInput: HTMLElement = getByLabelText('Username');
        const passwordInput: HTMLElement = getByLabelText('Password');

        await act(async () => {
            fireEvent.change(usernameInput, {target: {value: 'test-username'}});
            fireEvent.change(passwordInput, {target: {value: 'test-password'}});
        });

        expect(usernameInput.value).toBe('test-username');
        expect(passwordInput.value).toBe('test-password');
    });

    it('submits the form and navigates to dashboard', async () => {
        const {getByLabelText, getByText} = render(<LoginPage/>);
        const usernameInput = getByLabelText('Username');
        const passwordInput = getByLabelText('Password');
        const submitButton = getByText('Connexion');

        await act(async () => {
            fireEvent.change(usernameInput, {target: {value: 'test-username'}});
            fireEvent.change(passwordInput, {target: {value: 'test-password'}});
            fireEvent.click(submitButton);
        });

        expect(localStorage.getItem('token')).toBe(JSON.stringify({token: 'test-token'}));
        expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });
});
