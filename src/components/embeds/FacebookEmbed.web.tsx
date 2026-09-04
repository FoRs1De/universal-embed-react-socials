import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { IFrame } from '../../host';
import { useAutoEmbedHeight, useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { DEFAULT_FACEBOOK_API_VERSION, DEFAULT_FACEBOOK_LOCALE } from '../../utils/apiVersion';
import { isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { facebookEmbedHtml } from './embedHtml';
import { EmbedShell } from './EmbedShell';
import { MediaFrame } from './MediaFrame';
import type { FacebookEmbedProps } from './FacebookEmbed.types';

export type { FacebookEmbedProps } from './FacebookEmbed.types';

const defaultEmbedWidth = 550;
const minPluginWidth = 350;
const maxPluginWidth = 750;
const maxPlaceholderWidth = defaultEmbedWidth;
const defaultPlaceholderHeight = 372;
const borderRadius = 3;
const FACEBOOK_CHROME = 180;
const SDK_FALLBACK_MS = 8000;

const clampFacebookWidth = (width: number) => Math.min(maxPluginWidth, Math.max(minPluginWidth, width));

const facebookPluginHeight = (width: number): number => Math.round(width + FACEBOOK_CHROME);

const buildFacebookPluginSrc = (url: string, width: number, height: number, locale: string) => {
  const params = new URLSearchParams({
    href: url,
    show_text: 'true',
    width: String(width),
    height: String(height),
    locale,
  });
  return `https://www.facebook.com/plugins/post.php?${params.toString()}`;
};

export const FacebookEmbed = ({
  url,
  maxWidth,
  width,
  height,
  linkText = 'View post on Facebook',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled = false,
  apiVersion = DEFAULT_FACEBOOK_API_VERSION,
  locale = DEFAULT_FACEBOOK_LOCALE,
  className,
  style,
}: FacebookEmbedProps) => {
  const [ready, setReady] = useState(false);
  const [usePluginFallback, setUsePluginFallback] = useState(false);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const percentageWidth = isPercentage(resolvedMaxWidth);
  const percentageHeight = isPercentage(height);
  const pluginWidth =
    percentageWidth || typeof resolvedMaxWidth !== 'number'
      ? defaultEmbedWidth
      : clampFacebookWidth(resolvedMaxWidth);
  const embedHtml = useMemo(
    () => facebookEmbedHtml({ url, width: pluginWidth, apiVersion, locale }),
    [apiVersion, locale, pluginWidth, url],
  );
  const [frameSrc, setFrameSrc] = useState<string | undefined>();
  const fallbackHeight = facebookPluginHeight(pluginWidth);
  const autoHeight = height == null && !percentageHeight;
  const { boxRef, scale, boxStyle } = useResponsiveEmbedBox(pluginWidth, resolvedMaxWidth);
  const { height: measuredHeight, iframeRef } = useAutoEmbedHeight({
    enabled: !usePluginFallback && !!frameSrc,
    measureSrcDoc: !usePluginFallback && !!frameSrc,
  });

  useEffect(() => {
    const blob = new Blob([embedHtml], { type: 'text/html' });
    const next = URL.createObjectURL(blob);
    setFrameSrc(next);
    return () => URL.revokeObjectURL(next);
  }, [embedHtml]);

  useEffect(() => {
    if (measuredHeight) {
      setReady(true);
    }
  }, [measuredHeight]);

  useEffect(() => {
    if (!autoHeight || ready || usePluginFallback) {
      return;
    }
    const timer = window.setTimeout(() => {
      setUsePluginFallback(true);
      setReady(true);
    }, SDK_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [autoHeight, ready, usePluginFallback]);

  const frameHeight = typeof height === 'number' ? height : (measuredHeight ?? fallbackHeight);
  const shellHeight = percentageHeight ? '100%' : Math.round(Number(frameHeight) * scale);

  const placeholderStyle: CSSProperties = {
    maxWidth: percentageWidth ? undefined : maxPlaceholderWidth,
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
    borderColor: '#dee2e6',
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
      <EmbedShell
        className={className}
        extraClassName="rsme-facebook-embed"
        width="100%"
        height={shellHeight}
        borderRadius={borderRadius}
        style={style}
      >
        <MediaFrame showPlaceholder={!ready && !placeholderDisabled} placeholder={placeholder}>
          {usePluginFallback ? (
            <IFrame
              src={buildFacebookPluginSrc(url, pluginWidth, fallbackHeight, locale)}
              width={pluginWidth}
              height={fallbackHeight}
              frameBorder={0}
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setReady(true)}
              title="Facebook embed"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />
          ) : frameSrc ? (
            <IFrame
              iframeRef={iframeRef}
              src={frameSrc}
              width={pluginWidth}
              height={frameHeight}
              frameBorder={0}
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              title="Facebook embed"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />
          ) : null}
        </MediaFrame>
      </EmbedShell>
    </div>
  );
};
