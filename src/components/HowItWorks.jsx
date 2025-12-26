import React, { useEffect, useRef } from 'react';

const HowItWorks = () => {
  const observerRef = useRef(null);
  const mrecRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const steps = document.querySelectorAll('.step');
    steps.forEach(step => observerRef.current.observe(step));

    return () => {
      if (observerRef.current) {
        steps.forEach(step => observerRef.current.unobserve(step));
      }
    };
  }, []);

  useEffect(() => {
    const container = mrecRef.current;
    if (!container) return;

    container.innerHTML = '';
    container.id = 'adsterra-mrec-300';
    container.style.outline = '1px dashed rgba(255, 107, 0, 0.8)'; // debug aid

    const optsScript = document.createElement('script');
    optsScript.type = 'text/javascript';
    optsScript.innerHTML = `
      atOptions = {
        'key' : '4670b2760ad6a3ba732d7a046b8a00a0',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const loaderScript = document.createElement('script');
    loaderScript.type = 'text/javascript';
    loaderScript.src = 'https://autographmarquisbuffet.com/4670b2760ad6a3ba732d7a046b8a00a0/invoke.js';
    loaderScript.async = false; // must execute after atOptions

    container.appendChild(optsScript);
    container.appendChild(loaderScript);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  const steps = [
    { number: '1', title: 'Download', description: 'Grab the .IPA securely' },
    { number: '2', title: 'Install via Signer', description: 'Use AltStore, Scarlet, or TrollStore' },
    { number: '3', title: 'Activate Advanced Mode', description: 'One tap for full capabilities' }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="ad-mrec" ref={mrecRef} aria-label="Sponsored MREC" />
        <h2 className="section-title">Simple Process</h2>
        <div className="steps">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="step">
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="step-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
