import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { toNativeSize } from '../../utils/style';
import type { NativeEmbedViewProps } from './NativeEmbedView.types';

export type { NativeEmbedViewProps } from './NativeEmbedView.types';

export const NativeEmbedView = ({
  html,
  uri,
  baseUrl,
  width,
  height,
  style,
  fallbackHeight,
  placeholder,
  placeholderDisabled,
  allowsInlineMediaPlayback = false,
  mediaPlaybackRequiresUserAction = true,
  allowsFullscreenVideo = false,
  webViewProps,
}: NativeEmbedViewProps) => {
  const [ready, setReady] = useState(false);
  const hasPlaceholder = placeholder != null && !placeholderDisabled;
  const resolvedHeight = toNativeSize(height, ready || hasPlaceholder ? fallbackHeight : 0);
  const {
    style: webViewStyle,
    onLoad,
    source: _source,
    ...restWebViewProps
  } = webViewProps ?? {};

  return (
    <View
      style={[
        { overflow: 'hidden', width: width ?? '100%', height: resolvedHeight },
        style as StyleProp<ViewStyle>,
      ]}
    >
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        automaticallyAdjustContentInsets={false}
        allowsInlineMediaPlayback={allowsInlineMediaPlayback}
        mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
        allowsFullscreenVideo={allowsFullscreenVideo}
        {...restWebViewProps}
        source={html ? { html, baseUrl } : { uri: uri ?? '' }}
        onLoad={(event: unknown) => {
          setReady(true);
          if (typeof onLoad === 'function') {
            onLoad(event);
          }
        }}
        style={[
          {
            width: '100%',
            height: resolvedHeight,
            backgroundColor: 'transparent',
          },
          webViewStyle,
        ]}
      />
      {!ready && hasPlaceholder ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>{placeholder}</View>
      ) : null}
    </View>
  );
};
