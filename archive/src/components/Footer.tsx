import React from 'react';
import './Footer.css'; // Assuming you have some basic styling

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>Contact Information:</p>
                <ul>
                    <li>Email: contact@example.com</li>
                    <li>Phone: (123) 456-7890</li>
                    <li>Address: 123 Main St, Anytown, USA</li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;