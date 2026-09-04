import { useEffect, useId, useState, type CSSProperties } from 'react';
import { Box } from '../../host';
import { useAutoEmbedHeight, useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { useFrame } from '../../hooks/useFrame';
import { embedScaleStyle, isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { Subs } from '../../utils/subs';
import { getXPostId } from '../../utils/urls';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import type { XEmbedProps } from './XEmbed.types';

export type { TwitterTweetEmbedProps, XEmbedProps } from './XEmbed.types';

const minPlaceholderWidth = 250;
const maxPlaceholderWidth = 550;
const defaultPlaceholderHeight = 350;
const officialEmbedWidth = 550;
const borderRadius = 12;

export const XEmbed = ({
  url,
  maxWidth,
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
  const embedId = useId();
  const frm = useFrame();
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const percentageHeight = isPercentage(height);
  const { boxRef, scale, boxStyle } = useResponsiveEmbedBox(officialEmbedWidth, resolvedMaxWidth);
  const { height: observedHeight, containerRef } = useAutoEmbedHeight({
    enabled: height == null && !percentageHeight,
  });

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
        win.twttr.widgets.load(doc.getElementById(embedId) ?? undefined);
        processed = true;
      }
      const root = doc.getElementById(embedId);
      if (root?.querySelector('iframe')) {
        setReady(true);
        twitterTweetEmbedProps?.onLoad?.();
      }
    }, 50);
    return subs.createCleanup();
  }, [embedId, frm.document, frm.window, postId, twitterTweetEmbedProps]);

  const placeholderStyle: CSSProperties = {
    minWidth: minPlaceholderWidth,
    maxWidth: maxPlaceholderWidth,
    width: '100%',
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
    <div ref={boxRef} style={boxStyle}>
    <EmbedShell className={className} extraClassName="rsme-twitter-embed" width="100%" height={height ?? Math.round((observedHeight ?? defaultPlaceholderHeight) * scale)} borderRadius={borderRadius} style={style}>
      <div ref={containerRef} style={embedScaleStyle(scale, officialEmbedWidth)}>
      <Box id={embedId}>
        <blockquote className="twitter-tweet">
          <a href={`https://twitter.com/i/status/${postId}`}>{linkText}</a>
        </blockquote>
      </Box>
      {!ready && !placeholderDisabled && placeholder}
      </div>
    </EmbedShell>
    </div>
  );
};
