import React, { useState } from 'react';

const HashSection = () => {
  const [hash] = useState('SHA-256 hash will appear here after IPA generation');

  const copyHash = () => {
    if (hash && hash !== 'SHA-256 hash will appear here after IPA generation') {
      navigator.clipboard.writeText(hash).then(() => {
        if (window.showToast) {
          window.showToast('Hash copied to clipboard!');
        }
      }).catch(() => {
        if (window.showToast) {
          window.showToast('Failed to copy hash');
        }
      });
    } else {
      if (window.showToast) {
        window.showToast('Hash not available yet');
      }
    }
  };

  return (
    <section className="hash-section" id="hash-section">
      <div className="container">
        <div className="hash-box">
          <h3>Verify Integrity (SHA-256)</h3>
          <div className="hash-content">
            <code className="hash-value" id="hash-value">{hash}</code>
            <button className="btn btn-small" id="copy-hash-btn" onClick={copyHash}>
              Copy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HashSection;