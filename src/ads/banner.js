import { ADS, DELAYS } from './config';
import { injectScriptOnce } from '../utils/dom';
import { randomInRange } from '../logic/timers';

const BANNER_SCRIPT_ID = 'adsterra-banner-script';
const BANNER_INIT_FLAG = 'adsterraBannerInitialized'; // dataset uses camelCase

const loadBanner = (container) => {
  if (!container) return;

  // Write Adsterra snippet in-place so the iframe appears inside this slot.
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
    id: BANNER_SCRIPT_ID,
    src: ADS.banner.scriptUrl,
    parent: container
  });
};

export const scheduleBanner = (container) => {
  if (!container || container.dataset[BANNER_INIT_FLAG]) return;
  container.dataset[BANNER_INIT_FLAG] = '1';

  let bannerLoaded = false;
  const scrollOptions = { passive: true };

  const loadOnce = () => {
    if (bannerLoaded) return;
    bannerLoaded = true;
    loadBanner(container);
    window.removeEventListener('scroll', onScroll, scrollOptions);
    if (timer) window.clearTimeout(timer);
  };

  const delay = randomInRange(DELAYS.bannerMinMs, DELAYS.bannerMaxMs);
  const timer = window.setTimeout(loadOnce, delay);

  const onScroll = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const percent = docHeight > 0 ? scrolled / docHeight : 0;
    if (percent >= 0.5) {
      loadOnce();
    }
  };

  window.addEventListener('scroll', onScroll, scrollOptions);

  return () => {
    window.removeEventListener('scroll', onScroll, scrollOptions);
    if (timer) window.clearTimeout(timer);
  };
};
