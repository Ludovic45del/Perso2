import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FormModal from './FormModal';
import { theme } from '../../data/Theme';
import { ThemeProvider } from '@mui/material';
import '@testing-library/jest-dom';

describe('FormModal', () => {
    beforeEach(() => {

        vi.mock('react-router-dom', async (importOriginal) => {
            const mod = await importOriginal();
            return {
                ok: true,
                ...mod,
                useParams: () => ({}),
                useNavigate: () => ({})
            };
        });
    });
    it('renders without crashing', () => {
        const mockCloseFormModal = vi.fn();
        const mockHandleUpdate = vi.fn();
        const mockSaveMethod = () => {
            return Promise.resolve({});
        };

        const {getByTestId} = render(
            <ThemeProvider theme={theme}>
                <FormModal
                    title="Test Modal"
                    content={[]}
                    isFormModalOpen={true}
                    closeFormModal={mockCloseFormModal}
                    handleUpdate={mockHandleUpdate}
                    saveMethod={mockSaveMethod}
                    defaultValueForm={{}}
                    titleWarningModal="Warning"
                    messageWarningModal="Warning message"
                    buttonLabelWarningModal="OK"
                />
            </ThemeProvider>
        );

        expect(getByTestId('close-icon-formmodal-testid')).toBeInTheDocument();
    });

    it('calls closeFormModal when the modal is closed', () => {
        const mockCloseFormModal = vi.fn();
        const mockHandleUpdate = vi.fn();
        const mockSaveMethod = () => {
            return Promise.resolve({});
        };
        const {getByTestId} = render(
            <ThemeProvider theme={theme}>

                <FormModal
                    title="Test Modal"
                    content={[]}
                    isFormModalOpen={true}
                    closeFormModal={mockCloseFormModal}
                    handleUpdate={mockHandleUpdate}
                    saveMethod={mockSaveMethod}
                    defaultValueForm={{}}
                    titleWarningModal="Warning"
                    messageWarningModal="Warning message"
                    buttonLabelWarningModal="OK"
                />
            </ThemeProvider>
        );

        fireEvent.click(getByTestId('close-icon-formmodal-testid'));
        expect(mockCloseFormModal).toHaveBeenCalled();
    });

    it('calls handleUpdate when the update button is clicked', async () => {
        const mockCloseFormModal = vi.fn();
        const mockHandleUpdate = vi.fn();
        const mockSaveMethod = vi.fn().mockImplementation(() => {
            return Promise.resolve({});
        });

        vi.mock('../../scenes/home/Home.scene', () => ({
            defaults: vi.fn(),
            useSnackBarContext: () => ({openSnackbar: vi.fn()}),
        }));

        const {getByText} = render(
            <ThemeProvider theme={theme}>
                <FormModal
                    title="Test Modal"
                    content={[]}
                    isFormModalOpen={true}
                    closeFormModal={mockCloseFormModal}
                    handleUpdate={mockHandleUpdate}
                    saveMethod={mockSaveMethod}
                    defaultValueForm={{}}
                    titleWarningModal="Warning"
                    messageWarningModal="Warning message"
                    buttonLabelWarningModal="OK"
                />
            </ThemeProvider>
        );
        await act(async () => {
            fireEvent.click(getByText('Sauvegarder et quitter'));
        });
        expect(mockCloseFormModal).toHaveBeenCalled();
        expect(mockHandleUpdate).toHaveBeenCalled();
        expect(mockSaveMethod).toHaveBeenCalled();

    });
});