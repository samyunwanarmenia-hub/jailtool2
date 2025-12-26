export const PAGE_LOAD_TS = Date.now();

export const randomInRange = (min, max) => {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

export const timeOnPageMs = () => Date.now() - PAGE_LOAD_TS;
