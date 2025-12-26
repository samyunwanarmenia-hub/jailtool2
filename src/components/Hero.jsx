import React, { useEffect } from 'react';
import { useZipDownload } from '../hooks/useZipDownload';
import { useMonetization } from '../hooks/useMonetization';

const Hero = () => {
  const { handleDownload, isGenerating } = useZipDownload();
  const { ctaReady, handleMonetizedAction } = useMonetization();

  useEffect(() => {
    // Smooth scroll для anchor links
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  const onDownloadClick = (e) => {
    e.preventDefault();
    if (!ctaReady) {
      if (window.showToast) {
        window.showToast('Подготавливаем загрузку...');
      }
      return;
    }
    handleMonetizedAction(() => handleDownload(e), { allowSmartlink: true, allowPopunder: true });
  };

  const onInstallGuideClick = () => {
    handleMonetizedAction(undefined, { allowSmartlink: false, allowPopunder: true });
  };

  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">ios 18 Jailbreak Tool</h1>
          <p className="hero-subtitle">
            The ultimate tool for deep iOS diagnostics, optimization and accessing advanced system features on iOS 18.1+
          </p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary" 
              id="download-zip"
              onClick={onDownloadClick}
              disabled={isGenerating || !ctaReady}
            >
              {isGenerating ? 'Generating...' : (ctaReady ? 'Download .IPA (12 MB)' : 'Preparing download...')}
            </button>
            <a href="#install" className="btn btn-secondary" onClick={onInstallGuideClick}>Installation Guide</a>
          </div>
          <p style={{ marginTop: '25px', fontSize: '1em', color: 'var(--color-text-muted)' }}>
            For advanced users seeking full control over their device.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
