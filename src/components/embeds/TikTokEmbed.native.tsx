import { resolveEmbedMaxWidth } from '../../utils/style';
import { getTikTokVideoId } from '../../utils/urls';
import { resolveNativeEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { NativeEmbedView } from './NativeEmbedView';
import {
  TIKTOK_PLAYER_ASPECT_RATIO,
  TIKTOK_PLAYER_FALLBACK_HEIGHT,
  buildTikTokPlayerHtml,
  buildTikTokPlayerSrc,
  usesTikTokPlayer,
  type TikTokEmbedProps,
} from './TikTokEmbed.types';

export type {
  TikTokEmbedProps,
  TikTokPlayerFlag,
  TikTokPlayerVars,
} from './TikTokEmbed.types';

const defaultPlaceholderHeight = 739;

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
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  embedPlaceholder,
  placeholderDisabled = false,
  style,
  webViewProps,
  openLinksInBrowser = true,
  allowsFullscreenVideo,
  tikTokProps,
}: TikTokEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const videoId = getTikTokVideoId(url);
  const usePlayer = usesTikTokPlayer(allowsFullscreenVideo, tikTokProps);
  const fallbackHeight = usePlayer ? TIKTOK_PLAYER_FALLBACK_HEIGHT : defaultPlaceholderHeight;
  const resolvedPlaceholder = resolveNativeEmbedPlaceholder({
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
    resolvedMaxWidth,
    height,
    fallbackHeight,
  });

  if (usePlayer) {
    return (
      <NativeEmbedView
        html={buildTikTokPlayerHtml(buildTikTokPlayerSrc(videoId, tikTokProps))}
        baseUrl="https://www.tiktok.com"
        width={resolvedMaxWidth}
        height={height}
        aspectRatio={height == null ? TIKTOK_PLAYER_ASPECT_RATIO : undefined}
        style={style}
        fallbackHeight={fallbackHeight}
        placeholder={resolvedPlaceholder}
        placeholderDisabled={placeholderDisabled}
        allowsInlineMediaPlayback
        allowsFullscreenVideo={allowsFullscreenVideo !== false}
        openLinksInBrowser={openLinksInBrowser}
        webViewProps={webViewProps}
      />
    );
  }

  return (
    <NativeEmbedView
      uri={`https://www.tiktok.com/embed/v2/${videoId}`}
      width={resolvedMaxWidth}
      height={height}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      allowsInlineMediaPlayback
      openLinksInBrowser={openLinksInBrowser}
      webViewProps={webViewProps}
    />
  );
};
