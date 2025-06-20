import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('renders welcome title and NASA logo', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to NASA Explorer/i)).toBeInTheDocument();
    expect(screen.getByAltText(/NASA Logo/i)).toBeInTheDocument();
  });
});
