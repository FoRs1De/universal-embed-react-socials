import type { CommonEmbedProps } from '../../types';
import type { Frame } from '../../hooks/useFrame';
import { escapeHtmlAttribute } from '../../utils/urls';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';

/** Official Embed Player query flags. https://developers.tiktok.com/doc/embed-player */
export type TikTokPlayerFlag = 0 | 1;

export interface TikTokPlayerVars {
  controls?: TikTokPlayerFlag;
  progress_bar?: TikTokPlayerFlag;
  play_button?: TikTokPlayerFlag;
  volume_control?: TikTokPlayerFlag;
  fullscreen_button?: TikTokPlayerFlag;
  timestamp?: TikTokPlayerFlag;
  loop?: TikTokPlayerFlag;
  autoplay?: TikTokPlayerFlag;
  music_info?: TikTokPlayerFlag;
  description?: TikTokPlayerFlag;
  rel?: TikTokPlayerFlag;
  native_context_menu?: TikTokPlayerFlag;
  closed_caption?: TikTokPlayerFlag;
  muted?: TikTokPlayerFlag;
}

export interface TikTokEmbedProps extends CommonEmbedProps {
  placeholderProps?: PlaceholderEmbedProps;
  scriptLoadDisabled?: boolean;
  retryDelay?: number;
  retryDisabled?: boolean;
  frame?: Frame;
  debug?: boolean;
  /**
   * Use TikTok's Embed Player (`/player/v1`) so fullscreen stays in-app
   * instead of opening TikTok. Defaults to `false` (oEmbed card).
   */
  allowsFullscreenVideo?: boolean;
  /** Official Embed Player query parameters. Implies the Embed Player. */
  tikTokProps?: TikTokPlayerVars;
}

export const TIKTOK_PLAYER_HOST = 'https://www.tiktok.com';
export const TIKTOK_PLAYER_ASPECT_RATIO = 9 / 16;
export const TIKTOK_PLAYER_FALLBACK_HEIGHT = 580;

export const usesTikTokPlayer = (
  allowsFullscreenVideo?: boolean,
  tikTokProps?: TikTokPlayerVars,
): boolean => allowsFullscreenVideo === true || tikTokProps != null;

export const buildTikTokPlayerSrc = (
  videoId: string,
  playerVars: TikTokPlayerVars = {},
): string => {
  const params = new URLSearchParams();
  Object.entries(playerVars).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return `${TIKTOK_PLAYER_HOST}/player/v1/${videoId}${query ? `?${query}` : ''}`;
};

export const buildTikTokPlayerHtml = (src: string): string => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
      iframe { margin: 0; padding: 0; width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <iframe
      src="${escapeHtmlAttribute(src)}"
      allow="fullscreen; autoplay; encrypted-media"
      allowfullscreen
      title="TikTok embed"
    ></iframe>
  </body>
</html>`;
