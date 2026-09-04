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
  scriptSrc = DEFAULT_XYMATIC_PLAYER_SCRIPT,
  url,
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
        width: width ?? '100%',
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
        scriptSrc,
        pageTitle,
      })}
      baseUrl="https://cdn.greenvideo.io"
      width={width}
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
