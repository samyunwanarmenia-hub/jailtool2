import React, { useEffect, useRef } from 'react';
import { mountBanner } from '../ads/adsManager';
import { ADS } from '../ads/config';

const AdBanner = () => {
  const slotRef = useRef(null);

  useEffect(() => {
    return mountBanner(slotRef.current);
  }, []);

  return (
    <section className="ad-banner">
      <div className="container">
        <div
          className="ad-slot"
          id={`container-${ADS.banner.key}`}
          ref={slotRef}
          aria-label="Sponsored banner"
        />
      </div>
    </section>
  );
};

export default AdBanner;
