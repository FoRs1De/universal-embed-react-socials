import { resolveEmbedMaxWidth } from '../../utils/style';
import { DEFAULT_XYMATIC_PLAYER_SCRIPT } from '../../utils/xymatic';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { xymaticEmbedHtml } from './embedHtml';
import { NativeEmbedView } from './NativeEmbedView';
import type { XymaticEmbedProps } from './XymaticEmbed.types';

export type { XymaticEmbedProps } from './XymaticEmbed.types';

const defaultPlaceholderHeight = 360;

export const XymaticEmbed = ({
  embedId,
  licenseKey,
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
  scriptSrc = DEFAULT_XYMATIC_PLAYER_SCRIPT,
  url,
  maxWidth,
  width,
  height,
  linkText = 'Watch video',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  embedPlaceholder,
  placeholderDisabled = false,
  pageTitle,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: XymaticEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url,
    linkText,
    placeholder,
    embedPlaceholder,
    placeholderDisabled,
    placeholderImageUrl,
    placeholderSpinner,
    placeholderSpinnerDisabled,
    placeholderProps,
    placeholderWidth,
    placeholderHeight,
    placeholderStyle,
    extraStyle: { width: resolvedMaxWidth ?? '100%' },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: resolvedMaxWidth ?? '100%',
    providerHeight: height ?? defaultPlaceholderHeight,
    allowJavaScriptUrls: false,
  });

  return (
    <NativeEmbedView
      html={xymaticEmbedHtml({
        embedId,
        licenseKey,
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
        scriptSrc,
        pageTitle,
      })}
      baseUrl="https://cdn.greenvideo.io"
      width={resolvedMaxWidth}
      height={height}
      aspectRatio={16 / 9}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      allowsFullscreenVideo
      openLinksInBrowser={openLinksInBrowser}
      webViewProps={webViewProps}
    />
  );
};
