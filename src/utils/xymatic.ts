export const DEFAULT_XYMATIC_PLAYER_SCRIPT = 'https://cdn.greenvideo.io/players/gv.js';

export type XymaticEnvironment = 'prod' | 'staging' | 'stage';

export interface XymaticTemplateData {
  enableAdSupport?: boolean;
  disableFollowUp?: boolean;
  [key: string]: unknown;
}

export interface XymaticPlayerConfig {
  templateData?: XymaticTemplateData;
  [key: string]: unknown;
}

export interface XymaticProps {
  contentId?: string;
  mixId?: string;
  adTagUrl?: string;
  adsDisallowed?: boolean;
  consentString?: string;
  environment?: XymaticEnvironment;
  templateData?: XymaticTemplateData;
  playerConfig?: XymaticPlayerConfig;
  [key: string]: unknown;
}

export const getXymaticPlayerConfig = (
  options: boolean | {
    hasNoAds?: boolean;
    templateData?: XymaticTemplateData;
    playerConfig?: XymaticPlayerConfig;
  } = false,
): string => {
  const resolved = typeof options === 'boolean' ? { hasNoAds: options } : options;
  const hasNoAds = resolved.hasNoAds ?? false;
  return JSON.stringify({
    ...resolved.playerConfig,
    templateData: {
      enableAdSupport: !hasNoAds,
      disableFollowUp: hasNoAds,
      ...resolved.playerConfig?.templateData,
      ...resolved.templateData,
    },
  }).replace(/</g, '\\u003c');
};

export const getXymaticVideoAttributes = ({
  embedId,
  contentId,
  mixId,
  adTagUrl,
  adsDisallowed,
  consentString,
  environment,
}: {
  embedId: string;
  contentId?: string;
  mixId?: string;
  adTagUrl?: string;
  adsDisallowed?: boolean;
  consentString?: string;
  environment?: XymaticEnvironment;
}): Record<string, string> => {
  const attrs: Record<string, string> = { 'embed-id': embedId };
  if (contentId) {
    attrs['content-id'] = contentId;
  }
  if (mixId) {
    attrs['mix-id'] = mixId;
  }
  if (adTagUrl) {
    attrs['ad-tag-url'] = adTagUrl;
  }
  if (consentString) {
    attrs['consent-string'] = consentString;
  }
  if (environment) {
    attrs.environment = environment;
  }
  if (adsDisallowed) {
    attrs['ads-disallowed'] = 'true';
  }
  return attrs;
};

export const resolveXymaticControls = ({
  embedId,
  contentId,
  mixId,
  hasNoAds,
  adTagUrl,
  adsDisallowed,
  consentString,
  environment,
  templateData,
  playerConfig,
  xymaticProps,
}: {
  embedId: string;
  contentId?: string;
  mixId?: string;
  hasNoAds?: boolean;
  adTagUrl?: string;
  adsDisallowed?: boolean;
  consentString?: string;
  environment?: XymaticEnvironment;
  templateData?: XymaticTemplateData;
  playerConfig?: XymaticPlayerConfig;
  xymaticProps?: XymaticProps;
}) => {
  const noAds = hasNoAds ?? xymaticProps?.adsDisallowed ?? adsDisallowed ?? false;
  return {
    attributes: getXymaticVideoAttributes({
      embedId,
      contentId: contentId ?? xymaticProps?.contentId,
      mixId: mixId ?? xymaticProps?.mixId,
      adTagUrl: adTagUrl ?? xymaticProps?.adTagUrl,
      adsDisallowed: noAds,
      consentString: consentString ?? xymaticProps?.consentString,
      environment: environment ?? xymaticProps?.environment,
    }),
    configJson: getXymaticPlayerConfig({
      hasNoAds: noAds,
      templateData: templateData ?? xymaticProps?.templateData,
      playerConfig: playerConfig ?? xymaticProps?.playerConfig,
    }),
  };
};
