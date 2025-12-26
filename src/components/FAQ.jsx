import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'What exactly does ios 18 Jailbreak Tool do?',
      answer: 'It provides advanced diagnostics and unlocks restricted system features for full device control on iOS 18.1+.'
    },
    {
      question: 'Is this a jailbreak alternative?',
      answer: "It's more powerful — full system modification without the old limitations."
    },
    {
      question: 'Safe? Risks?',
      answer: 'All local, no data sent. Standard void warranty stuff — you know the drill.'
    },
    {
      question: 'Which devices are supported?',
      answer: 'A12 and newer chipsets (iPhone XS onwards) running iOS 18.1+.'
    },
    {
      question: 'Do I need to respring after install?',
      answer: 'Yes, respring is required for full tweak injection and advanced features activation.'
    },
    {
      question: 'Will this work after iOS updates?',
      answer: 'Compatibility depends on iOS version. Check release notes for supported versions. Updates may break functionality.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="container">
        <h2 className="section-title">FAQ</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;