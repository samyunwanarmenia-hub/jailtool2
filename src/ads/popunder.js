import { ADS, DELAYS, FREQUENCY } from './config';
import { injectScriptOnce } from '../utils/dom';
import { wasFiredWithin, markFiredNow } from '../logic/session';
import { randomInRange } from '../logic/timers';

const STORAGE_KEY = 'ads_popunder_fired_at';

export const hasPopunderFiredRecently = () =>
  wasFiredWithin(STORAGE_KEY, FREQUENCY.popunderMs);

const meetsTimeGate = (timeOnPageMs) => {
  const min = randomInRange(DELAYS.popunderMinMs, DELAYS.popunderMaxMs);
  return timeOnPageMs >= min;
};

export const firePopunder = (timeOnPageMs) => {
  if (!ADS.popunderScriptUrl) return false;
  if (hasPopunderFiredRecently()) return false;
  if (!meetsTimeGate(timeOnPageMs)) return false;

  injectScriptOnce({
    id: 'adsterra-popunder-script',
    src: ADS.popunderScriptUrl
  });
  markFiredNow(STORAGE_KEY);
  return true;
};
