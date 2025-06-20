import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import content from '../../content/content.json';

describe('Footer', () => {
  it('renders all main sections', () => {
    render(<Footer />);
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Me/i)).toBeInTheDocument();
    expect(screen.getByText(/Disclaimer/i)).toBeInTheDocument();
  });

  it('renders email and github icons if present', () => {
    render(<Footer />);
    expect(screen.getByTitle(/Email/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Github/i)).toBeInTheDocument();
  });

  it('renders linkedin icon if present', () => {
    if (!content.contact.linkedin) {
      // If linkedin is not present in content.json, skip this test
      return;
    }
    render(<Footer />);
    expect(screen.getByTitle(/Linkedin/i)).toBeInTheDocument();
  });

  it('does not render icons for missing contact fields', () => {
    // Clone content and remove linkedin field
    const contentNoLinkedin = JSON.parse(JSON.stringify(content));
    delete contentNoLinkedin.contact.linkedin;
    // Temporarily mock Footer to use this modified content
    jest.resetModules();
    jest.doMock('../../content/content.json', () => contentNoLinkedin, { virtual: true });
    const FooterNoLinkedin = require('./Footer').default;
    render(<FooterNoLinkedin />);
    expect(screen.queryByTitle(/Linkedin/i)).not.toBeInTheDocument();
    jest.unmock('../../content/content.json'); // cleanup
  });

  afterEach(() => {
    jest.unmock('../../content/content.json');
  });
});
