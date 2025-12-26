import React, { useState, useEffect } from 'react';
import { initWebPush, initAutoPopunder } from '../ads/adsManager';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    initWebPush();
    initAutoPopunder();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = () => {
    const header = document.querySelector('.header');
    if (header) {
      if (window.pageYOffset > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 255, 192, 0.2)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 255, 192, 0.1)';
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="header" id="header">
      <nav className="nav container">
        <a href="#home" className="logo">ios 18</a>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#features" onClick={() => setIsMenuOpen(false)}>Capabilities</a>
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it Works</a>
          <a href="#install" onClick={() => setIsMenuOpen(false)}>Install</a>
          <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
          <a href="#advanced" onClick={() => setIsMenuOpen(false)}>Advanced Users</a>
        </div>
        <button 
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
};

export default Header;