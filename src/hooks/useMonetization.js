import { useEffect, useState, useCallback } from 'react';
import {
  handleMonetizedAction as handleAdAction,
  startCtaUnlockTimer,
  wasCtaUnlocked
} from '../ads/adsManager';

export const useMonetization = () => {
  const [ctaReady, setCtaReady] = useState(wasCtaUnlocked());

  useEffect(() => {
    if (ctaReady) return;
    return startCtaUnlockTimer(setCtaReady);
  }, [ctaReady]);

  const handleMonetizedAction = useCallback((userAction, options = {}) => {
    // One ad action per user action: smartlink optional, popunder allowed by default, then primary UX.
    const merged = { allowSmartlink: false, allowPopunder: true, ...options };
    handleAdAction(userAction, merged);
  }, []);

  return { ctaReady, handleMonetizedAction };
};
