import { ADS, DELAYS, FREQUENCY } from './config';
import { wasFiredWithin, markFiredNow } from '../logic/session';
import { randomInRange } from '../logic/timers';

const STORAGE_KEY = 'ads_smartlink_fired_at';
const CTA_UNLOCK_KEY = 'ads_smartlink_unlocked';

export const hasFiredSmartlinkRecently = () =>
  wasFiredWithin(STORAGE_KEY, FREQUENCY.smartlinkMs);

export const markSmartlinkFired = () => markFiredNow(STORAGE_KEY);

export const markCtaUnlocked = () => markFiredNow(CTA_UNLOCK_KEY);

export const wasCtaUnlocked = () =>
  wasFiredWithin(CTA_UNLOCK_KEY, FREQUENCY.ctaUnlockMs);

export const openSmartlink = () => {
  if (!ADS.smartlinkUrl) return false;
  if (hasFiredSmartlinkRecently()) return false;
  const win = window.open(ADS.smartlinkUrl, '_blank', 'noopener,noreferrer');
  markSmartlinkFired();
  return Boolean(win);
};

export const computeCtaDelay = () =>
  randomInRange(DELAYS.smartlinkMinMs, DELAYS.smartlinkMaxMs);
