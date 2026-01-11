import OptionsMoreIcon from './OptionsMoreIcon';
import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Box from "@mui/material/Box";
import '@testing-library/jest-dom';


describe('<OptionsMoreIcon/>', () => {

    it( ("Should render OptionsMoreIcon with no options"),  () => {
        // Arrange
        // Act
        const {container} = render(<OptionsMoreIcon options={[]}/>);

        // Assert
        expect(container).toBeTruthy();
        expect(screen.getByTitle('Options')).toBeInTheDocument();
    })

    it( ("Should render OptionsMoreIcon with options"),  () => {
        // Arrange
        // Act
        const {container} = render(<OptionsMoreIcon options={[
            <Box>Supprimer</Box>,
            <Box>Dupliquer partiellement</Box>
        ]}/>);

        // Assert
        expect(container).toBeTruthy();
        const moreOptionsIcon = screen.getByTitle('Options')
        expect(moreOptionsIcon).toBeInTheDocument();
        fireEvent.click(moreOptionsIcon);
        expect(screen.getByText('Supprimer')).toBeInTheDocument()
        expect(screen.getByText('Dupliquer partiellement')).toBeInTheDocument()

    })
})