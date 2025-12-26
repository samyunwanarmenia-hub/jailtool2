const safeStorage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      console.warn('[Monetization] localStorage get error', err);
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      console.warn('[Monetization] localStorage set error', err);
    }
  }
};

export const wasFiredWithin = (key, windowMs) => {
  const ts = safeStorage.get(key);
  if (!ts) return false;
  const delta = Date.now() - Number(ts);
  return delta < windowMs;
};

export const markFiredNow = (key) => {
  safeStorage.set(key, String(Date.now()));
};
