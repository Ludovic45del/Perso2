import {fireEvent, render, screen} from '@testing-library/react';
import TabsMenu from './TabsMenu';
import {TabData} from '../../services/utils/TabsUtils.service';
import {MemoryRouter} from 'react-router-dom';
import {describe, expect, it, vi} from 'vitest';
import '@testing-library/jest-dom';

const tabsArray: TabData[] = [
    {label: 'Overview', path: 'overview'},
    {label: 'Cibles', path: 'cible'},
    {label: 'Formes temporelles', path: 'ft'},
];

function setActiveTab(tab: number) {

}

const renderWithRouter = (tabsArray: TabData[], activeTab: number, setActiveTab: (tab:number) => void) => {
    return render(<MemoryRouter>
        <TabsMenu tabsArray={tabsArray} setActiveTab={setActiveTab} activeTab={activeTab}/>
    </MemoryRouter>);
};

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        useNavigate: () => mockedNavigate,
    };
});
describe('<TabsMenu/>', () => {

    it('should render TabsMenu with no tabs', () => {
        // Arrange
        // Act
        const {container} = renderWithRouter([], null, null);

        // Assert
        expect(container).toBeTruthy();
    });

    it('should render TabsMenu with one tab', () => {
        // Arrange
        // Act
        const {container} = renderWithRouter([{label: 'Overview', path: 'overview'}], 0, null);

        // Assert
        expect(container).toBeTruthy();
        expect(screen.getByText('Overview')).toBeInTheDocument();

    });

    it('should render TabsMenu with multiple tabs and selected tab', () => {
        // Arrange
        Object.defineProperty(window, 'location', {
            get() {
                return {pathname: '/overview'};
            },
        });
        // Act
        const {container} = renderWithRouter(tabsArray, 0, null);

        // Assert
        const overviewTab = screen.getByText('Overview');

        expect(container).toBeTruthy();
        expect(overviewTab).toBeInTheDocument();
        expect(overviewTab).toHaveClass('Mui-selected');
        expect(screen.getByText('Cibles')).toBeInTheDocument();
        expect(screen.getByText('Formes temporelles')).toBeInTheDocument();
    });

    it('should change active tab on click and nav on new location', () => {
        // Arrange
        Object.defineProperty(window, 'location', {
            get() {
                return {pathname: '/overview'};
            },
        });
        // Act
        const {container} = renderWithRouter(tabsArray,1, setActiveTab);

        // Assert
        const overviewTab = screen.getByText('Overview');
        const targetsTab = screen.getByText('Cibles');

        expect(container).toBeTruthy();
        expect(overviewTab).toBeInTheDocument();
        // expect(overviewTab).toHaveClass('Mui-selected'); #TODO A revoir
        expect(targetsTab).toBeInTheDocument();
        expect(screen.getByText('Formes temporelles')).toBeInTheDocument();

        fireEvent.click(targetsTab);
        expect(targetsTab).toHaveClass('Mui-selected');
        expect(mockedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedNavigate).toHaveBeenCalledWith('cible');
    });
});