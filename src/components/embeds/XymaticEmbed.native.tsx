import { resolveEmbedMaxWidth } from '../../utils/style';
import { DEFAULT_XYMATIC_PLAYER_SCRIPT } from '../../utils/xymatic';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
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
  embedPlaceholder,
  placeholderDisabled = false,
  pageTitle,
  style,
  webViewProps,
}: XymaticEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={url ?? '#'}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      allowJavaScriptUrls={false}
      {...placeholderProps}
      style={{
        width: resolvedMaxWidth ?? '100%',
        height: height ?? defaultPlaceholderHeight,
        ...placeholderProps?.style,
      }}
    />
  );

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
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={placeholder}
      placeholderDisabled={placeholderDisabled}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      allowsFullscreenVideo
      webViewProps={webViewProps}
    />
  );
};
