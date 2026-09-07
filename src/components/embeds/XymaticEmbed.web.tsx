import { useEffect, useState, type CSSProperties } from 'react';
import { useAutoEmbedHeight } from '../../hooks/useEmbedHeight';
import { useFrame } from '../../hooks/useFrame';
import { embedMaxWidthStyle, isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { DEFAULT_XYMATIC_PLAYER_SCRIPT, resolveXymaticControls } from '../../utils/xymatic';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import { MediaFrame } from './MediaFrame';
import type { XymaticEmbedProps } from './XymaticEmbed.types';

export type { XymaticEmbedProps } from './XymaticEmbed.types';

const defaultPlaceholderHeight = 360;
const borderRadius = 0;

export const XymaticEmbed = ({
  embedId,
  licenseKey,
  contentId,
  mixId,
  hasNoAds,
  adTagUrl,
  adsDisallowed,
  consentString,
  environment,
  templateData,
  playerConfig,
  xymaticProps,
  scriptSrc = DEFAULT_XYMATIC_PLAYER_SCRIPT,
  url,
  maxWidth,
  width,
  height,
  linkText = 'Watch video',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled = false,
  scriptLoadDisabled = false,
  frame,
  debug = false,
  className,
  style,
}: XymaticEmbedProps) => {
  const [ready, setReady] = useState(false);
  const frm = useFrame(frame);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const percentageHeight = isPercentage(height);
  const autoHeight = height == null && !percentageHeight;
  const { height: resolvedHeight, containerRef } = useAutoEmbedHeight({
    enabled: autoHeight,
    fallback: defaultPlaceholderHeight,
    aspectRatio: 16 / 9,
  });
  const { attributes, configJson } = resolveXymaticControls({
    embedId,
    contentId,
    mixId,
    hasNoAds,
    adTagUrl,
    adsDisallowed,
    consentString,
    environment,
    templateData,
    playerConfig,
    xymaticProps,
  });

  useEffect(() => {
    debug && console.log(`[${new Date().toISOString()}]: xymatic ${ready ? 'ready' : 'loading'}`);
  }, [debug, ready]);

  useEffect(() => {
    if (scriptLoadDisabled || !frm.document) {
      return;
    }

    const existing = frm.document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`);
    if (existing) {
      existing.setAttribute('data-license-key', licenseKey);
      setReady(true);
      return;
    }

    const script = frm.document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.setAttribute('data-license-key', licenseKey);
    script.onload = () => setReady(true);
    frm.document.body.appendChild(script);
  }, [frm.document, licenseKey, scriptLoadDisabled, scriptSrc]);

  const placeholderStyle: CSSProperties = {
    width: '100%',
    height: percentageHeight
      ? '100%'
      : typeof height !== 'undefined'
        ? height
        : typeof style?.height !== 'undefined' || typeof style?.maxHeight !== 'undefined'
          ? '100%'
          : defaultPlaceholderHeight,
    borderRadius,
  };
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={url ?? '#'}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      allowJavaScriptUrls={false}
      {...placeholderProps}
      style={{ ...placeholderStyle, ...placeholderProps?.style }}
    />
  );

  return (
    <div ref={containerRef} style={embedMaxWidthStyle(resolvedMaxWidth)}>
    <EmbedShell
      className={className}
      extraClassName="rsme-xymatic-embed"
      width="100%"
      height={height ?? resolvedHeight}
      borderRadius={borderRadius}
      style={style}
    >
      <MediaFrame showPlaceholder={!ready && !placeholderDisabled} placeholder={placeholder}>
        <div id="xymatic-embed-wrapper" style={{ width: '100%' }}>
          <green-video {...attributes}>
            <script type="application/json">{configJson}</script>
          </green-video>
        </div>
      </MediaFrame>
    </EmbedShell>
    </div>
  );
};
