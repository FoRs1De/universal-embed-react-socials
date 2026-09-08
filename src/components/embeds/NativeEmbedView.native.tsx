import { useRef, useState } from 'react';
import { Linking, View, type StyleProp, type ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { toNativeSize } from '../../utils/style';
import {
  injectAutoHeightScript,
  nativeAutoHeightScript,
  nativePinterestBootScript,
  parseAutoHeightMessage,
} from './nativeEmbedHeight';
import type { NativeEmbedViewProps } from './NativeEmbedView.types';

export type { NativeEmbedViewProps } from './NativeEmbedView.types';

type WebViewRequest = {
  url?: string;
  navigationType?: string;
  isTopFrame?: boolean;
};

type WebViewOpenWindowEvent = {
  nativeEvent?: { targetUrl?: string };
};

const isHttpUrl = (url: string): boolean => /^https?:\/\//i.test(url);

const normalizeUrl = (url: string): string => url.replace(/\/$/, '').split('#')[0];

const isEmbedHostPath = (url: string, host: string, path: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith(host) && parsed.pathname.includes(path);
  } catch {
    return false;
  }
};

const isProviderEmbedUrl = (url: string): boolean =>
  isEmbedHostPath(url, 'tiktok.com', '/embed') ||
  isEmbedHostPath(url, 'tiktok.com', '/player') ||
  isEmbedHostPath(url, 'facebook.com', '/plugins') ||
  isEmbedHostPath(url, 'linkedin.com', '/embed') ||
  isEmbedHostPath(url, 'instagram.com', '/embed') ||
  isEmbedHostPath(url, 'pinterest.com', '/embed') ||
  isEmbedHostPath(url, 'youtube.com', '/embed') ||
  isEmbedHostPath(url, 'youtube-nocookie.com', '/embed');

const isEmbedDocumentUrl = (url: string, uri?: string, baseUrl?: string): boolean => {
  if (!url || url === 'about:blank' || url.startsWith('data:') || url.startsWith('blob:')) {
    return true;
  }
  const normalized = normalizeUrl(url);
  if (uri != null && (normalized === normalizeUrl(uri) || url.startsWith(uri))) {
    return true;
  }
  if (isProviderEmbedUrl(url)) {
    return true;
  }
  return baseUrl != null && normalized === normalizeUrl(baseUrl);
};

const shouldOpenInBrowser = (
  request: WebViewRequest,
  uri: string | undefined,
  baseUrl: string | undefined,
  enabled: boolean,
): boolean => {
  if (!enabled) {
    return false;
  }
  const url = request.url ?? '';
  if (!isHttpUrl(url) || isEmbedDocumentUrl(url, uri, baseUrl)) {
    return false;
  }
  if (request.navigationType === 'click') {
    return true;
  }
  return request.isTopFrame === true;
};

const openExternalUrl = (url: string) => {
  Linking.openURL(url).catch(() => undefined);
};

export const NativeEmbedView = ({
  html,
  uri,
  baseUrl,
  headers,
  width,
  height,
  aspectRatio,
  autoHeight,
  fitDesignWidth,
  style,
  fallbackHeight,
  placeholder,
  placeholderDisabled,
  allowsInlineMediaPlayback = false,
  mediaPlaybackRequiresUserAction = true,
  allowsFullscreenVideo = false,
  openLinksInBrowser = true,
  webViewProps,
}: NativeEmbedViewProps) => {
  const webViewRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const [boxWidth, setBoxWidth] = useState(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const hasPlaceholder = placeholder != null && !placeholderDisabled;
  const fitEnabled = fitDesignWidth != null && fitDesignWidth > 0 && height == null;
  const autoHeightEnabled = autoHeight ?? (height == null && aspectRatio == null);
  const useAspectRatio = aspectRatio != null && height == null && !autoHeightEnabled;
  const designHeight =
    measuredHeight > 0 ? measuredHeight : toNativeSize(height, fallbackHeight);
  const fitScale = fitEnabled && boxWidth > 0 ? boxWidth / fitDesignWidth : 1;
  const fittedHeight = fitEnabled ? Math.max(1, Math.round(designHeight * fitScale)) : undefined;
  const resolvedHeight = useAspectRatio
    ? undefined
    : fittedHeight != null
      ? fittedHeight
      : measuredHeight > 0
        ? measuredHeight
        : toNativeSize(height, ready || hasPlaceholder ? fallbackHeight : 0);
  const {
    style: webViewStyle,
    onLoad,
    onMessage,
    injectedJavaScript,
    source: _source,
    onShouldStartLoadWithRequest,
    onOpenWindow,
    setSupportMultipleWindows: _setSupportMultipleWindows,
    injectedJavaScriptBeforeContentLoaded,
    ...restWebViewProps
  } = webViewProps ?? {};
  const sizingScript = autoHeightEnabled ? nativeAutoHeightScript : '';
  const uriBootScript = html
    ? ''
    : fitEnabled && autoHeightEnabled
      ? nativePinterestBootScript(fitDesignWidth)
      : sizingScript;
  const source = html
    ? {
        html: sizingScript ? injectAutoHeightScript(html, sizingScript) : html,
        baseUrl,
        headers,
      }
    : { uri: uri ?? '', headers };

  return (
    <View
      onLayout={(event) => {
        const next = Math.round(event.nativeEvent.layout.width);
        setBoxWidth((prev) => (Math.abs(prev - next) < 2 ? prev : next));
      }}
      style={[
        {
          overflow: 'hidden',
          width: width ?? '100%',
          ...(useAspectRatio ? { aspectRatio } : { height: resolvedHeight }),
        },
        style as StyleProp<ViewStyle>,
      ]}
    >
      <View
        style={
          fitEnabled
            ? {
                width: fitDesignWidth,
                height: designHeight,
                transform: [{ scale: fitScale }],
                transformOrigin: 'top left',
              }
            : { width: '100%', height: '100%' }
        }
      >
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          mixedContentMode="always"
          automaticallyAdjustContentInsets={false}
          allowsInlineMediaPlayback={allowsInlineMediaPlayback}
          mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
          allowsFullscreenVideo={allowsFullscreenVideo}
          setSupportMultipleWindows={openLinksInBrowser}
          scrollEnabled={!autoHeightEnabled && !fitEnabled && !useAspectRatio}
          bounces={false}
          overScrollMode="never"
          {...restWebViewProps}
          source={source}
          injectedJavaScriptBeforeContentLoaded={
            uriBootScript
              ? `${uriBootScript}\n${injectedJavaScriptBeforeContentLoaded ?? ''}`
              : injectedJavaScriptBeforeContentLoaded
          }
          injectedJavaScript={
            uriBootScript ? `${uriBootScript}\n${injectedJavaScript ?? ''}` : injectedJavaScript
          }
          onMessage={(event: { nativeEvent?: { data?: string } }) => {
            if (typeof onMessage === 'function') {
              onMessage(event);
            }
            if (!autoHeightEnabled) {
              return;
            }
            const next = parseAutoHeightMessage(event?.nativeEvent?.data);
            if (next) {
              setMeasuredHeight((prev) => (prev === next ? prev : next));
            }
          }}
          onShouldStartLoadWithRequest={(request: WebViewRequest) => {
            if (shouldOpenInBrowser(request, uri, baseUrl, openLinksInBrowser)) {
              openExternalUrl(request.url ?? '');
              return false;
            }
            if (typeof onShouldStartLoadWithRequest === 'function') {
              return onShouldStartLoadWithRequest(request);
            }
            return true;
          }}
          onOpenWindow={(event: WebViewOpenWindowEvent) => {
            const targetUrl = event.nativeEvent?.targetUrl;
            if (openLinksInBrowser && targetUrl && isHttpUrl(targetUrl)) {
              openExternalUrl(targetUrl);
              return;
            }
            if (typeof onOpenWindow === 'function') {
              onOpenWindow(event);
            }
          }}
          onLoad={(event: unknown) => {
            setReady(true);
            if (typeof onLoad === 'function') {
              onLoad(event);
            }
          }}
          onContentProcessDidTerminate={() => {
            webViewRef.current?.reload();
          }}
          style={[
            {
              width: fitEnabled ? fitDesignWidth : '100%',
              height: fitEnabled ? designHeight : '100%',
              backgroundColor: 'transparent',
            },
            webViewStyle,
          ]}
        />
      </View>
      {!ready && hasPlaceholder ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>{placeholder}</View>
      ) : null}
    </View>
  );
};
