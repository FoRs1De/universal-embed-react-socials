export const DEFAULT_XYMATIC_PLAYER_SCRIPT = 'https://cdn.greenvideo.io/players/gv.js';

export const getXymaticPlayerConfig = (hasNoAds = false): string =>
  JSON.stringify({
    templateData: {
      enableAdSupport: !hasNoAds,
      disableFollowUp: hasNoAds,
    },
  }).replace(/</g, '\\u003c');
