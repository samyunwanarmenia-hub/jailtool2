import React, { useEffect, useRef } from 'react';

const Features = () => {
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

    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => observerRef.current.observe(card));

    return () => {
      if (observerRef.current) {
        cards.forEach(card => observerRef.current.unobserve(card));
      }
    };
  }, []);

  const features = [
    { icon: '🔓', title: 'Deep System Access', description: 'Bypass restrictions and explore full filesystem potential' },
    { icon: '🛠️', title: 'Custom Modifications', description: 'Install third-party extensions and tweaks locally' },
    { icon: '🚀', title: 'Performance Boost', description: 'Remove bloat and optimize for maximum speed' },
    { icon: '📊', title: 'Advanced Diagnostics', description: 'Full root-level system info and monitoring' },
    { icon: '🎨', title: 'UI Customization', description: 'Unlock hidden themes and interface mods' },
    { icon: '🔄', title: 'Package Management', description: 'Support for Sileo/Zebra repositories' }
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <h2 className="section-title">Key Capabilities</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;