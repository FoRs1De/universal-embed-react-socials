import { useEffect, useRef, useState } from 'react';
import { IFrame } from '../../host';
import { useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { resolveEmbedFrame, resolveEmbedMaxWidth } from '../../utils/style';
import { getPinterestPinId } from '../../utils/urls';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { EmbedShell } from './EmbedShell';
import { MediaFrame } from './MediaFrame';
import type { PinterestEmbedProps } from './PinterestEmbed.types';

export type { PinterestEmbedProps } from './PinterestEmbed.types';

const minPlaceholderWidth = 250;
const maxPlaceholderWidth = 550;
const defaultPlaceholderHeight = 550;
const officialEmbedWidth = 450;
const officialEmbedHeight = 699;
const borderRadius = 8;

export const PinterestEmbed = ({
  url,
  postUrl,
  maxWidth,
  width,
  height,
  linkText = 'View post on Pinterest',
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
  className,
  style,
}: PinterestEmbedProps) => {
  const [ready, setReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const postId = getPinterestPinId(url);
  const embedSrc = `https://assets.pinterest.com/ext/embed.html?id=${postId}&src=oembed`;
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const { boxRef, scale, boxStyle } = useResponsiveEmbedBox(officialEmbedWidth, resolvedMaxWidth);
  const { frameHeight, showPlaceholder } = resolveEmbedFrame({
    ready,
    fallbackHeight: officialEmbedHeight,
    scale,
    height,
    waitForMeasure: false,
  });

  useEffect(() => {
    const iframe = iframeRef.current;
    const markReady = () => setReady(true);
    iframe?.addEventListener('load', markReady);
    const timer = window.setTimeout(markReady, 800);
    return () => {
      iframe?.removeEventListener('load', markReady);
      window.clearTimeout(timer);
    };
  }, [embedSrc]);

  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url: postUrl ?? url,
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
      borderColor: 'rgba(0, 0, 0, 0.15)',
      borderRadius,
    },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: officialEmbedWidth,
    providerHeight: officialEmbedHeight,
  });

  return (
    <div ref={boxRef} style={boxStyle}>
      <EmbedShell
        className={className}
        extraClassName="rsme-pinterest-embed"
        width="100%"
        height={frameHeight}
        borderRadius={borderRadius}
        style={style}
      >
        <MediaFrame showPlaceholder={showPlaceholder && !placeholderDisabled} placeholder={resolvedPlaceholder}>
          <IFrame
            iframeRef={iframeRef}
            className="pinterest-post"
            src={embedSrc}
            width={officialEmbedWidth}
            height={officialEmbedHeight}
            frameBorder={0}
            scrolling="no"
            onLoad={() => setReady(true)}
            title="Pinterest embed"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </MediaFrame>
      </EmbedShell>
    </div>
  );
};
