import React, { useState } from 'react';
import './Accordion.css';

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion ${open ? 'open' : ''}`}>
      <button className="accordion-header" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span className="accordion-icon">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;
