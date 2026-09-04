import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { IFrame } from '../../host';
import { useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { getPinterestPinId } from '../../utils/urls';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
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
  const embedHeight =
    typeof height === 'number' && !isPercentage(height)
      ? height
      : Math.round(officialEmbedHeight * scale);

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

  const placeholderStyle: CSSProperties = {
    minWidth: minPlaceholderWidth,
    maxWidth: maxPlaceholderWidth,
    width: '100%',
    height:
      typeof height !== 'undefined'
        ? height
        : typeof style?.height !== 'undefined' || typeof style?.maxHeight !== 'undefined'
          ? '100%'
          : defaultPlaceholderHeight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius,
  };
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={postUrl ?? url}
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
      <EmbedShell
        className={className}
        extraClassName="rsme-pinterest-embed"
        width="100%"
        height={embedHeight}
        borderRadius={borderRadius}
        style={style}
      >
        <MediaFrame showPlaceholder={!ready && !placeholderDisabled} placeholder={placeholder}>
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
