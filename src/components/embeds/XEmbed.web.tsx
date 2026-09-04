import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Box } from '../../host';
import { useFrame } from '../../hooks/useFrame';
import { isPercentage } from '../../utils/style';
import { Subs } from '../../utils/subs';
import { getXPostId } from '../../utils/urls';
import { generateUUID } from '../../uuid';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import type { XEmbedProps } from './XEmbed.types';

export type { TwitterTweetEmbedProps, XEmbedProps } from './XEmbed.types';

const minPlaceholderWidth = 250;
const maxPlaceholderWidth = 550;
const defaultPlaceholderHeight = 350;
const borderRadius = 12;

export const XEmbed = ({
  url,
  width,
  height,
  linkText = 'View post on X',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled,
  twitterTweetEmbedProps,
  className,
  style,
}: XEmbedProps) => {
  const postId = twitterTweetEmbedProps?.tweetId ?? getXPostId(url);
  const [ready, setReady] = useState(false);
  const uuidRef = useRef(generateUUID());
  const frm = useFrame();
  const percentageWidth = isPercentage(width);
  const percentageHeight = isPercentage(height);

  useEffect(() => {
    const win = frm.window as Window & { twttr?: { widgets?: { load?: (el?: Element) => void } } };
    const doc = frm.document;
    if (!doc) {
      return;
    }

    if (!win.twttr?.widgets?.load && !doc.getElementById('twitter-widgets-script')) {
      const script = doc.createElement('script');
      script.id = 'twitter-widgets-script';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      doc.head.appendChild(script);
    }

    let processed = false;
    const subs = new Subs();
    subs.setInterval(() => {
      if (!processed && win.twttr?.widgets?.load) {
        win.twttr.widgets.load(doc.getElementById(uuidRef.current) ?? undefined);
        processed = true;
      }
      const root = doc.getElementById(uuidRef.current);
      if (root?.querySelector('iframe')) {
        setReady(true);
        twitterTweetEmbedProps?.onLoad?.();
      }
    }, 50);
    return subs.createCleanup();
  }, [frm.document, frm.window, postId, twitterTweetEmbedProps]);

  const placeholderStyle: CSSProperties = {
    minWidth: minPlaceholderWidth,
    maxWidth: maxPlaceholderWidth,
    width: typeof width !== 'undefined' ? (percentageWidth ? '100%' : width) : '100%',
    height: percentageHeight
      ? '100%'
      : typeof height !== 'undefined'
        ? height
        : typeof style?.height !== 'undefined' || typeof style?.maxHeight !== 'undefined'
          ? '100%'
          : defaultPlaceholderHeight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#c9d4d9',
    borderRadius,
  };
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={url}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      {...placeholderProps}
      style={{ ...placeholderStyle, ...placeholderProps?.style }}
    />
  );

  return (
    <EmbedShell className={className} extraClassName="rsme-twitter-embed" width={width} height={height} borderRadius={borderRadius} style={style}>
      <Box id={uuidRef.current}>
        <blockquote className="twitter-tweet">
          <a href={`https://twitter.com/i/status/${postId}`}>{linkText}</a>
        </blockquote>
      </Box>
      {!ready && !placeholderDisabled && placeholder}
    </EmbedShell>
  );
};
