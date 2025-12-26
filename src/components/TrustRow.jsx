import React from 'react';

const TrustRow = () => {
  const trustItems = [
    { icon: '📦', text: '12 MB Package' },
    { icon: '🔒', text: 'No Account Required' },
    { icon: '🛡️', text: 'Local Processing Only' },
    { icon: '📱', text: 'iOS 18.1+ Optimized' },
    { icon: '⚡', text: 'One-Click Advanced Mode' }
  ];

  return (
    <section className="trust-row">
      <div className="container">
        <div className="trust-items">
          {trustItems.map((item, index) => (
            <div key={index} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <span className="trust-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustRow;