import { useEffect, useId, useState } from 'react';
import { Box } from '../../host';
import { useAutoEmbedHeight, useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { useFrame } from '../../hooks/useFrame';
import { embedScaleStyle, isPercentage, placeholderOverlayStyle, resolveEmbedFrame, resolveEmbedMaxWidth } from '../../utils/style';
import { Subs } from '../../utils/subs';
import { getXPostId } from '../../utils/urls';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { EmbedShell } from './EmbedShell';
import type { XEmbedProps } from './XEmbed.types';

export type { TwitterTweetEmbedProps, XEmbedProps } from './XEmbed.types';

const defaultPlaceholderHeight = 560;
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
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  embedPlaceholder,
  placeholderDisabled,
  embedDisabled = false,
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
    enabled: !embedDisabled && height == null && !percentageHeight,
  });

  useEffect(() => {
    if (embedDisabled) {
      setReady(false);
      return;
    }
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
    const cleanup = subs.createCleanup();
    subs.setInterval(() => {
      if (!processed && win.twttr?.widgets?.load) {
        win.twttr.widgets.load(doc.getElementById(embedId) ?? undefined);
        processed = true;
      }
      const root = doc.getElementById(embedId);
      if (root?.querySelector('iframe')) {
        setReady(true);
        twitterTweetEmbedProps?.onLoad?.();
        cleanup();
      }
    }, 50);
    return cleanup;
  }, [embedId, frm.document, frm.window, postId, embedDisabled, twitterTweetEmbedProps?.onLoad]);

  const resolvedPlaceholder = resolveEmbedPlaceholder({
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
    extraStyle: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#c9d4d9',
      borderRadius,
    },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: officialEmbedWidth,
    providerHeight: defaultPlaceholderHeight,
  });
  const { frameHeight, showPlaceholder } = resolveEmbedFrame({
    ready: !embedDisabled && ready,
    measuredHeight: observedHeight,
    fallbackHeight: defaultPlaceholderHeight,
    scale,
    height,
  });

  return (
    <div ref={boxRef} style={boxStyle}>
    <EmbedShell className={className} extraClassName="rsme-twitter-embed" width="100%" height={frameHeight} borderRadius={borderRadius} style={{ position: 'relative', ...style }}>
      <div ref={containerRef} style={embedScaleStyle(scale, officialEmbedWidth)}>
      {embedDisabled ? null : (
      <Box id={embedId}>
        <blockquote className="twitter-tweet">
          <a href={`https://twitter.com/i/status/${postId}`}>{linkText}</a>
        </blockquote>
      </Box>
      )}
      </div>
      {showPlaceholder && !placeholderDisabled && resolvedPlaceholder != null ? (
        <Box style={placeholderOverlayStyle}>
          {resolvedPlaceholder}
        </Box>
      ) : null}
    </EmbedShell>
    </div>
  );
};
