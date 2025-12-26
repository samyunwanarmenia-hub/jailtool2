// Adsterra monetization configuration
// Aggressive profile, desktop-first (75% desktop) — delays are still human-like.

export const ADS = {
  smartlinkUrl: 'https://autographmarquisbuffet.com/s0fvvseqxz?key=f8cfb4ac1088ba6feaf947d7a9a29976',
  banner: {
    key: '9d529b1d3801b0dc7a28884475a05200',
    scriptUrl: 'https://autographmarquisbuffet.com/9d529b1d3801b0dc7a28884475a05200/invoke.js',
    height: 90,
    width: 728
  },
  webPush: {
    scriptUrl: 'https://js.wpadmngr.com/static/adManager.js',
    admpid: '406397'
  }
};

export const DELAYS = {
  // Smartlink button unlock after 7–10s to avoid instant fire.
  smartlinkMinMs: 7000,
  smartlinkMaxMs: 10000,
  // Popunder allowed after 10–15s on page.
  popunderMinMs: 10000,
  popunderMaxMs: 15000,
  // Banner load window.
  bannerMinMs: 4000,
  bannerMaxMs: 4000,
  // Frequency cap enforced separately.
};

export const FREQUENCY = {
  smartlinkMs: 24 * 60 * 60 * 1000, // once per day
  popunderMs: 24 * 60 * 60 * 1000,  // frequency cap on
  webPushMs: 24 * 60 * 60 * 1000,   // once per day
  ctaUnlockMs: 24 * 60 * 60 * 1000  // keep CTA unlocked during the day
};
