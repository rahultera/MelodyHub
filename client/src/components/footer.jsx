import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <p>&copy; 2025 EventHub. All rights reserved.</p>
      <p>Contact us: support@eventhub.com</p>
      <p>
        Follow us:
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a> | 
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a> | 
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>
      </p>
    </div>
  );
};

export default Footer;
