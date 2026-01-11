import {expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ErrorScene} from './Error.scene';
import '@testing-library/jest-dom';

it('renders learn error', () => {
    render(<ErrorScene/>);
    const linkElement = screen.getByText(/Une erreur est survenue.../i);
    expect(linkElement).toBeInTheDocument();
});

