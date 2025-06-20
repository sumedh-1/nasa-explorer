import React from 'react';
import { FaGithub, FaEnvelope, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import content from '../../content/content.json';
import './Footer.css';

const iconMap = {
  email: {
    icon: <FaEnvelope />, href: (val) => `mailto:${val}`
  },
  github: {
    icon: <FaGithub />, href: (val) => val
  },
  linkedin: {
    icon: <FaLinkedin />, href: (val) => val
  },
  instagram: {
    icon: <FaInstagram />, href: (val) => val
  },
  facebook: {
    icon: <FaFacebook />, href: (val) => val
  }
};

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>{content.about.title}</h4>
        <p>{content.about.text}</p>
      </div>
      <div className="footer-separator" />
      <div className="footer-section">
        <h4>{content.contact.title}</h4>
        <div dangerouslySetInnerHTML={{ __html: content.contact.text }} />
        <div className="footer-contact-icons" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginTop: '0.7rem' }}>
          {Object.entries(iconMap).map(([key, { icon, href }]) =>
            content.contact[key] ? (
              <a
                key={key}
                href={href(content.contact[key])}
                target="_blank"
                rel="noopener noreferrer"
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                className="footer-icon-link"
                style={{ fontSize: '1.5em', color: 'var(--color-link-hover)' }}
              >
                {icon}
              </a>
            ) : null
          )}
        </div>
      </div>
      <div className="footer-separator" />
      <div className="footer-section">
        <h4>{content.disclaimer.title}</h4>
        <p>{content.disclaimer.text}</p>
      </div>
      <div className="footer-bottom" dangerouslySetInnerHTML={{ __html: content.copyright.replace('{year}', year) }} />
    </footer>
  );
};

export default Footer;
