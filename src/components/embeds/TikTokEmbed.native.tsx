import { resolveEmbedMaxWidth } from '../../utils/style';
import { getTikTokVideoId } from '../../utils/urls';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { tiktokEmbedHtml } from './embedHtml';
import { NativeEmbedView } from './NativeEmbedView';
import type { TikTokEmbedProps } from './TikTokEmbed.types';

export type { TikTokEmbedProps } from './TikTokEmbed.types';

const defaultPlaceholderHeight = 550;

export const TikTokEmbed = ({
  url,
  maxWidth,
  width,
  height,
  linkText = 'View post on TikTok',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled = false,
  style,
  webViewProps,
}: TikTokEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={url}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
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
      html={tiktokEmbedHtml({ url, videoId: getTikTokVideoId(url) })}
      baseUrl="https://www.tiktok.com"
      width={resolvedMaxWidth}
      height={height}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={placeholder}
      placeholderDisabled={placeholderDisabled}
      webViewProps={webViewProps}
    />
  );
};
