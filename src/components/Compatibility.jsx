import React from 'react';

const Compatibility = () => {
  const compatItems = [
    { label: 'iOS Version:', value: '18.1 and later' },
    { label: 'Devices:', value: 'iPhone XS (A12) and newer' },
    { label: 'Storage:', value: '12 MB minimum' },
    { label: 'Architecture:', value: 'ARM64' }
  ];

  return (
    <section className="compatibility">
      <div className="container">
        <h2 className="section-title">Compatibility</h2>
        <div className="compat-list">
          {compatItems.map((item, index) => (
            <div key={index} className="compat-item">
              <span className="compat-label">{item.label}</span>
              <span className="compat-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Compatibility;