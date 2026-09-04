import type { ReactNode } from 'react';
import type { EmbedContainerProps, EmbedWebViewProps } from '../../types';
import type { Frame } from '../../hooks/useFrame';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';

export interface XymaticEmbedProps extends EmbedContainerProps {
  /** Green Video / Xymatic player embed id. */
  embedId: string;
  /** License key set on the gv.js script as `data-license-key`. */
  licenseKey: string;
  /** Optional Xymatic content id. */
  contentId?: string;
  /** Optional Xymatic mix id. */
  mixId?: string;
  /** Disable follow-up ads, matching the journal `hasNoAds` flag. */
  hasNoAds?: boolean;
  /** Override the player script. Defaults to `https://cdn.greenvideo.io/players/gv.js`. */
  scriptSrc?: string;
  /** Optional link used by the placeholder. */
  url?: string;
  maxWidth?: string | number;
  /** @deprecated Use `maxWidth`. */
  width?: string | number;
  height?: string | number;
  linkText?: string;
  placeholderImageUrl?: string;
  placeholderSpinner?: ReactNode;
  placeholderSpinnerDisabled?: boolean;
  placeholderProps?: PlaceholderEmbedProps;
  embedPlaceholder?: ReactNode;
  placeholderDisabled?: boolean;
  scriptLoadDisabled?: boolean;
  frame?: Frame;
  debug?: boolean;
  pageTitle?: string;
  /** Extra `react-native-webview` props. Native only. */
  webViewProps?: EmbedWebViewProps;
}
