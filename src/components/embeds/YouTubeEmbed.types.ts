import type { CommonEmbedProps } from '../../types';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';

export interface YouTubePlayerVars {
  start?: number;
  autoplay?: number;
  controls?: number;
  loop?: number;
  mute?: number;
  rel?: number;
  [key: string]: string | number | undefined;
}

export interface YouTubeProps {
  videoId?: string;
  className?: string;
  opts?: {
    width?: string | number;
    height?: string | number;
    playerVars?: YouTubePlayerVars;
    [key: string]: unknown;
  };
  onReady?: (event: { target: unknown }) => void;
  [key: string]: unknown;
}

export interface YouTubeEmbedProps extends CommonEmbedProps {
  placeholderProps?: PlaceholderEmbedProps;
  youTubeProps?: YouTubeProps;
}

export const YOUTUBE_EMBED_HOST = 'https://www.youtube.com';
/** Third-party origin for native WebViews. Using youtube.com as the page origin triggers Error 152-4. */
export const YOUTUBE_NATIVE_ORIGIN = 'https://www.youtube-nocookie.com';

export const buildYouTubeSrc = (
  videoId: string,
  playerVars: YouTubePlayerVars = {},
  host: string = YOUTUBE_EMBED_HOST,
): string => {
  const params = new URLSearchParams();
  Object.entries(playerVars).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return `${host}/embed/${videoId}${query ? `?${query}` : ''}`;
};

/** WKWebView strips Referer on a bare embed URL, which YouTube rejects as Error 153. */
export const buildYouTubeEmbedHtml = (src: string): string => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <style>
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
      iframe { margin: 0; padding: 0; width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <iframe
      src="${src}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </body>
</html>`;
