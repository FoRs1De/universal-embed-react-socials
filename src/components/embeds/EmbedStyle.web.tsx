import type { CSSProperties } from 'react';
import { StyleTag } from '../../host';
import { classNames } from '../../utils/classNames';

export interface EmbedStyleProps {
  className?: string;
  style?: CSSProperties;
}

export const EmbedStyle = ({ className, style }: EmbedStyleProps) => (
  <StyleTag className={classNames(className)} style={style}>
    {`
        .rsme-embed .rsme-d-none {
          display: none;
        }

        .rsme-embed .twitter-tweet {
          margin: 0 !important;
        }

        .rsme-embed blockquote {
          margin: 0 !important;
          padding: 0 !important;
        }

        .rsme-embed.rsme-facebook-embed iframe.fb-post,
        .rsme-embed.rsme-facebook-embed .fb-post iframe {
          width: 100% !important;
          max-height: none !important;
        }

        .rsme-embed.rsme-facebook-embed .fb-post span {
          width: 100% !important;
        }

        .rsme-embed.rsme-youtube-embed iframe {
          width: 100% !important;
          height: 100% !important;
        }

        .rsme-embed.rsme-instagram-embed iframe,
        .rsme-embed.rsme-instagram-embed .instagram-media,
        .rsme-embed.rsme-tiktok-embed iframe,
        .rsme-embed.rsme-tiktok-embed .tiktok-embed,
        .rsme-embed.rsme-twitter-embed iframe,
        .rsme-embed.rsme-twitter-embed .twitter-tweet,
        .rsme-embed.rsme-pinterest-embed iframe {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
        }

        .rsme-embed.rsme-pinterest-embed iframe {
          overflow: hidden !important;
          border: 0 !important;
        }
      `}
  </StyleTag>
);
