import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accordion from './Accordion';

describe('Accordion', () => {
  it('renders the title and children', () => {
    render(<Accordion title="My Title">Content</Accordion>);
    expect(screen.getByText(/My Title/i)).toBeInTheDocument();
    // When closed, children are not rendered at all
    expect(screen.queryByText(/Content/)).toBeNull();
  });

  it('expands/collapses when clicked', () => {
    render(<Accordion title="Toggle">Details</Accordion>);
    const button = screen.getByRole('button', { name: /toggle/i });
    fireEvent.click(button);
    expect(screen.getByText(/Details/)).toBeVisible();
    fireEvent.click(button);
    expect(screen.queryByText(/Details/)).toBeNull();
  });
});
