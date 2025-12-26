import React, { useState } from 'react';
import { useMonetization } from '../hooks/useMonetization';

const Install = () => {
  const [activeTab, setActiveTab] = useState('altstore');
  const { handleMonetizedAction } = useMonetization();

  const tabs = [
    { id: 'altstore', label: 'AltStore', content: {
      title: 'Using AltStore',
      steps: [
        'Install AltStore on your device',
        'Download the .IPA file',
        'Open AltStore and tap the "+" button',
        'Select the downloaded .IPA file',
        'Wait for installation to complete'
      ]
    }},
    { id: 'scarlet', label: 'Scarlet', content: {
      title: 'Using Scarlet',
      steps: [
        'Open Scarlet on your device',
        'Download the .IPA file',
        'Import the file into Scarlet',
        'Follow the on-screen instructions',
        'Launch the app when ready'
      ]
    }},
    { id: 'trollstore', label: 'TrollStore', content: {
      title: 'Using TrollStore',
      steps: [
        'Ensure TrollStore is installed on your device',
        'Download the .IPA file',
        'Open TrollStore and select "Install IPA"',
        'Choose the downloaded file',
        'Wait for installation and respring if needed'
      ]
    }},
    { id: 'other', label: 'Other Signer', content: {
      title: 'Using Other Signers',
      steps: [
        'Download the .IPA file',
        'Open your preferred signing tool',
        'Import the .IPA file',
        'Sign and install the application',
        'Trust the developer certificate if prompted'
      ]
    }}
  ];

  return (
    <section className="install" id="install">
      <div className="container">
        <h2 className="section-title">Installation Methods</h2>
        <div className="install-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleMonetizedAction(
                () => setActiveTab(tab.id),
                { allowSmartlink: false, allowPopunder: true }
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab-content ${activeTab === tab.id ? 'active' : ''}`}
            id={tab.id}
          >
            <div className="install-content">
              <h3>{tab.content.title}</h3>
              <ol>
                {tab.content.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Install;
