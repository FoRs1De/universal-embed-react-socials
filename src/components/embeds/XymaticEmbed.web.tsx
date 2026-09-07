import { useEffect, useState } from 'react';
import { useFrame } from '../../hooks/useFrame';
import { aspectRatioHeight, collapsedEmbedStyle, embedMaxWidthStyle, isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { DEFAULT_XYMATIC_PLAYER_SCRIPT, resolveXymaticControls } from '../../utils/xymatic';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
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
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
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
  const aspectFallback = aspectRatioHeight(resolvedMaxWidth, 16 / 9, defaultPlaceholderHeight);
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
    extraStyle: { borderRadius },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: resolvedMaxWidth,
    providerHeight: typeof height === 'number' ? height : aspectFallback,
    allowJavaScriptUrls: false,
  });
  const hasPlaceholder = resolvedPlaceholder != null;
  const reserveFrame = ready || hasPlaceholder;

  return (
    <div style={{ ...embedMaxWidthStyle(resolvedMaxWidth), ...collapsedEmbedStyle(!reserveFrame) }}>
    <EmbedShell
      className={className}
      extraClassName="rsme-xymatic-embed"
      width="100%"
      height={!reserveFrame ? 0 : autoHeight ? undefined : height}
      borderRadius={borderRadius}
      style={{
        ...(autoHeight && reserveFrame ? { aspectRatio: '16 / 9' } : {}),
        ...collapsedEmbedStyle(!reserveFrame),
        ...style,
      }}
    >
      <MediaFrame showPlaceholder={!ready && hasPlaceholder} placeholder={resolvedPlaceholder}>
        <div id="xymatic-embed-wrapper" style={{ width: '100%', height: '100%' }}>
          <green-video {...attributes}>
            <script type="application/json">{configJson}</script>
          </green-video>
        </div>
      </MediaFrame>
    </EmbedShell>
    </div>
  );
};
