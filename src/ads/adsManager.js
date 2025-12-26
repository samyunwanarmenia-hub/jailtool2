import { ADS, DELAYS, FREQUENCY } from './config';
import { injectScriptOnce } from '../utils/dom';
import { randomInRange, timeOnPageMs } from '../logic/timers';
import { wasFiredWithin, markFiredNow } from '../logic/session';

const KEYS = {
  smartlink: 'ads_smartlink_fired_at',
  popunder: 'ads_popunder_fired_at',
  ctaUnlock: 'ads_cta_unlocked'
};

const state = {
  popunderTimer: null
};

const hasRecentSmartlink = () =>
  wasFiredWithin(KEYS.smartlink, FREQUENCY.smartlinkMs);

const hasRecentPopunder = () =>
  wasFiredWithin(KEYS.popunder, FREQUENCY.popunderMs);

const markSmartlink = () => markFiredNow(KEYS.smartlink);
const markPopunder = () => markFiredNow(KEYS.popunder);
const markCtaUnlocked = () => markFiredNow(KEYS.ctaUnlock);

export const wasCtaUnlocked = () =>
  wasFiredWithin(KEYS.ctaUnlock, FREQUENCY.ctaUnlockMs);

export const computeCtaDelay = () =>
  randomInRange(DELAYS.smartlinkMinMs, DELAYS.smartlinkMaxMs);

export const startCtaUnlockTimer = (onReady) => {
  if (wasCtaUnlocked()) {
    onReady(true);
    return () => {};
  }

  const delay = computeCtaDelay();
  const timer = window.setTimeout(() => {
    markCtaUnlocked();
    onReady(true);
  }, delay);

  return () => window.clearTimeout(timer);
};

const openSmartlink = () => {
  if (!ADS.smartlinkUrl) return;
  if (hasRecentSmartlink()) return;
  window.open(ADS.smartlinkUrl, '_blank', 'noopener,noreferrer');
  markSmartlink();
};

const firePopunder = () => {
  state.popunderTimer = null;
  if (!ADS.popunderScript) return;
  if (hasRecentPopunder()) return;

  const meetsTimeGate = timeOnPageMs() >= DELAYS.popunderMinMs;
  if (!meetsTimeGate) {
    // Re-check once at the minimum boundary to avoid too-early firing.
    const waitMs = DELAYS.popunderMinMs - timeOnPageMs();
    state.popunderTimer = window.setTimeout(firePopunder, waitMs);
    return;
  }

  // Inject ClickAdila popunder script
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = ADS.popunderScript;
  const scriptEl = tempDiv.querySelector('script');
  if (scriptEl) {
    document.head.appendChild(scriptEl);
  }
  markPopunder();
};

const schedulePopunderAfterAction = () => {
  if (state.popunderTimer) return;
  if (hasRecentPopunder()) return;
  const delay = randomInRange(DELAYS.popunderMinMs, DELAYS.popunderMaxMs);
  state.popunderTimer = window.setTimeout(() => {
    firePopunder();
  }, delay);
};

export const handleMonetizedAction = (
  userAction,
  { allowSmartlink = false, allowPopunder = true } = {}
) => {
  const unlocked = wasCtaUnlocked();
  if (!unlocked) {
    if (typeof userAction === 'function') {
      userAction();
    }
    return;
  }

  if (allowSmartlink) {
    openSmartlink();
  }
  if (allowPopunder) {
    schedulePopunderAfterAction();
  }
  if (typeof userAction === 'function') {
    userAction();
  }
};

const shouldShowBanner = (container) => {
  if (!container) return false;
  const width = container.getBoundingClientRect().width || 0;
  const viewportWidth = window.innerWidth || 0;
  const effectiveWidth = Math.max(width, viewportWidth);
  return effectiveWidth >= ADS.banner.width;
};

export const initWebPush = () => {
  if (!ADS.webPush || !ADS.webPush.scriptUrl) return () => {};

  const webPushKey = 'ads_webpush_fired_at';

  const hasRecentWebPush = () =>
    wasFiredWithin(webPushKey, FREQUENCY.webPushMs);

  const markWebPush = () => markFiredNow(webPushKey);

  if (hasRecentWebPush()) {
    return () => {};
  }

  injectScriptOnce({
    id: 'wpadmngr-webpush-script',
    src: ADS.webPush.scriptUrl,
    parent: document.head,
    async: true,
    attrs: {
      'data-admpid': ADS.webPush.admpid
    }
  });

  markWebPush();
  return () => {};
};

export const initAutoPopunder = () => {
  if (!ADS.popunderScript) return () => {};

  const popunderKey = 'ads_popunder_fired_at';

  const hasRecentPopunder = () =>
    wasFiredWithin(popunderKey, FREQUENCY.popunderMs);

  const markPopunder = () => markFiredNow(popunderKey);

  const firePopunderScript = () => {
    // Inject ClickAdila popunder script
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = ADS.popunderScript;
    const scriptEl = tempDiv.querySelector('script');
    if (scriptEl) {
      document.head.appendChild(scriptEl);
    }
    markPopunder();
  };

  if (!hasRecentPopunder()) {
    // Fire immediately on page load
    firePopunderScript();
  }

  // Also fire on any user click
  const handleClick = () => {
    if (!hasRecentPopunder()) {
      firePopunderScript();
    }
  };

  document.addEventListener('click', handleClick, { once: true });

  return () => {
    document.removeEventListener('click', handleClick);
  };
};

const loadBannerInto = (container) => {
  if (!container) return;
  container.innerHTML = '';

  const optsScript = document.createElement('script');
  optsScript.type = 'text/javascript';
  optsScript.innerHTML = `
    atOptions = {
      key: '${ADS.banner.key}',
      format: 'iframe',
      height: ${ADS.banner.height},
      width: ${ADS.banner.width},
      params: {}
    };
  `;
  container.appendChild(optsScript);

  injectScriptOnce({
    id: 'adsterra-banner-script',
    src: ADS.banner.scriptUrl,
    parent: container
  });
};

export const mountBanner = (container) => {
  if (!container) return () => {};
  container.id = `container-${ADS.banner.key}`;
  container.dataset.bannerReady = '1';
  container.style.outline = '1px dashed rgba(255, 107, 0, 0.8)'; // debug aid

  if (!shouldShowBanner(container)) {
    container.style.display = 'none';
    return () => {};
  }

  container.style.display = 'flex';

  let bannerLoaded = false;
  const loadOnce = () => {
    if (bannerLoaded) return;
    bannerLoaded = true;
    loadBannerInto(container);
    window.removeEventListener('scroll', onScroll, scrollOptions);
    if (timer) window.clearTimeout(timer);
  };

  const scrollOptions = { passive: true };
  const onScroll = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const percent = docHeight > 0 ? scrolled / docHeight : 0;
    if (percent >= 0.3) {
      loadOnce();
    }
  };

  const delay = randomInRange(DELAYS.bannerMinMs, DELAYS.bannerMaxMs);
  const timer = window.setTimeout(loadOnce, delay);
  window.addEventListener('scroll', onScroll, scrollOptions);

  return () => {
    window.removeEventListener('scroll', onScroll, scrollOptions);
    if (timer) window.clearTimeout(timer);
  };
};
