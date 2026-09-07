import type { CSSProperties, ReactNode } from 'react';
import type { EmbedContainerProps, EmbedPlaceholder, EmbedWebViewProps } from '../../types';
import type { Frame } from '../../hooks/useFrame';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';
import type {
  XymaticEnvironment,
  XymaticPlayerConfig,
  XymaticProps,
  XymaticTemplateData,
} from '../../utils/xymatic';

export type {
  XymaticEnvironment,
  XymaticPlayerConfig,
  XymaticProps,
  XymaticTemplateData,
} from '../../utils/xymatic';

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
  /** Ad tag URL passed through to the Green Video player. */
  adTagUrl?: string;
  /** Disable ads on the player. */
  adsDisallowed?: boolean;
  /** IAB TCF consent string. */
  consentString?: string;
  /** Green Video environment. */
  environment?: XymaticEnvironment;
  /** Extra `templateData` merged into the player JSON config. */
  templateData?: XymaticTemplateData;
  /** Extra player JSON merged into the `<script type="application/json">` payload. */
  playerConfig?: XymaticPlayerConfig;
  /** Extra Green Video options. Explicit props above win on overlap. */
  xymaticProps?: XymaticProps;
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
  placeholder?: EmbedPlaceholder;
  /** Width of the placeholder box. Defaults to the embed width, then the provider default. */
  placeholderWidth?: string | number;
  /** Height of the placeholder box. Defaults to the embed height, then the provider default. */
  placeholderHeight?: string | number;
  placeholderStyle?: CSSProperties;
  embedPlaceholder?: EmbedPlaceholder;
  placeholderDisabled?: boolean;
  scriptLoadDisabled?: boolean;
  frame?: Frame;
  debug?: boolean;
  pageTitle?: string;
  /** Extra `react-native-webview` props. Native only. */
  webViewProps?: EmbedWebViewProps;
}
