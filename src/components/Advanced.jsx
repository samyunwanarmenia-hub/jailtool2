import React, { useEffect, useRef } from 'react';

const Advanced = () => {
  const observerRef = useRef(null);

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

    const items = document.querySelectorAll('.advanced-item');
    items.forEach(item => observerRef.current.observe(item));

    return () => {
      if (observerRef.current) {
        items.forEach(item => observerRef.current.unobserve(item));
      }
    };
  }, []);

  const advancedItems = [
    'Root filesystem access',
    'Tweak injection without reboot loop',
    'Custom bootstrap for Sileo',
    'Exploit based on latest KFD/MDC'
  ];

  return (
    <section className="advanced" id="advanced">
      <div className="container">
        <h2 className="section-title">For Experienced Users</h2>
        <div className="advanced-content">
          <p className="advanced-intro">
            ios 18 Jailbreak Tool unlocks kernel-level exploits for iOS 18.1, enabling semi-untethered access. Compatible with A12+ devices. Post-install: respring for full tweak injection. Community repos coming soon.
          </p>
          <div className="advanced-list">
            {advancedItems.map((item, index) => (
              <div key={index} className="advanced-item">
                <span className="advanced-icon">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advanced;