import { DEFAULT_FACEBOOK_API_VERSION, DEFAULT_FACEBOOK_LOCALE } from '../../utils/apiVersion';
import { isPercentage } from '../../utils/style';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { facebookEmbedHtml } from './embedHtml';
import type { FacebookEmbedProps } from './FacebookEmbed.types';
import { NativeEmbedView } from './NativeEmbedView';

export type { FacebookEmbedProps } from './FacebookEmbed.types';

const defaultEmbedWidth = 550;
const defaultPlaceholderHeight = 372;

export const FacebookEmbed = ({
  url,
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
  style,
  webViewProps,
}: FacebookEmbedProps) => {
  const resolvedWidth = isPercentage(width) ? '100%' : width ?? defaultEmbedWidth;
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={url}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      {...placeholderProps}
      style={{
        width: width ?? '100%',
        height: height ?? defaultPlaceholderHeight,
        ...placeholderProps?.style,
      }}
    />
  );

  return (
    <NativeEmbedView
      html={facebookEmbedHtml({ url, width: resolvedWidth, apiVersion, locale })}
      baseUrl="https://www.facebook.com"
      width={width}
      height={height}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={placeholder}
      placeholderDisabled={placeholderDisabled}
      webViewProps={webViewProps}
    />
  );
};
