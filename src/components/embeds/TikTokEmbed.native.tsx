import { Linking } from 'react-native';
import { resolveEmbedMaxWidth } from '../../utils/style';
import { getTikTokVideoId } from '../../utils/urls';
import { resolveTikTokBrowserUrl } from '../../utils/tiktokUrls';
import { withTikTokProfileLinks } from '../../utils/tiktokProfileLinks';
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
  embedDisabled = false,
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

  return (
    <NativeEmbedView
      {...(usePlayer
        ? {
            html: buildTikTokPlayerHtml(buildTikTokPlayerSrc(videoId, tikTokProps)),
            baseUrl: 'https://www.tiktok.com',
            aspectRatio: height == null ? TIKTOK_PLAYER_ASPECT_RATIO : undefined,
            allowsFullscreenVideo: allowsFullscreenVideo !== false,
          }
        : { uri: `https://www.tiktok.com/embed/v2/${videoId}` })}
      width={resolvedMaxWidth}
      height={height}
      style={style}
      fallbackHeight={fallbackHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      embedDisabled={embedDisabled}
      allowsInlineMediaPlayback
      openLinksInBrowser={openLinksInBrowser}
      resolveExternalUrl={(targetUrl: string) => resolveTikTokBrowserUrl(targetUrl, url)}
      webViewProps={openLinksInBrowser
        ? withTikTokProfileLinks(webViewProps, (profileUrl) => {
            Linking.openURL(profileUrl).catch(() => undefined);
          })
        : webViewProps}
    />
  );
};
