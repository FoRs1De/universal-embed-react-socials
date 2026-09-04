import type {
  BoxProps,
  HtmlEmbedProps,
  IFrameProps,
  ImageProps,
  LinkProps,
  StyleTagProps,
  TextProps,
} from './types';

export type {
  BoxProps,
  HtmlEmbedProps,
  IFrameProps,
  ImageProps,
  LinkProps,
  StyleTagProps,
  TextProps,
} from './types';

export const Box = ({ id, className, style, children, testID, nativeID, ...rest }: BoxProps) => (
  <div id={id ?? nativeID} className={className} style={style} data-testid={testID} {...rest}>
    {children}
  </div>
);

export const Txt = ({ className, style, children }: TextProps) => (
  <span className={className} style={style}>
    {children}
  </span>
);

export const EmbedLink = ({
  href,
  className,
  style,
  children,
  target = '_blank',
  rel = 'noopener noreferrer',
}: LinkProps) => (
  <a href={href} className={className} style={style} target={target} rel={rel}>
    {children}
  </a>
);

export const EmbedImage = ({ src, className, style, alt }: ImageProps) => (
  <img src={src} className={className} style={style} alt={alt} />
);

export const IFrame = ({
  src,
  width,
  height,
  className,
  style,
  onLoad,
  scrolling,
  frameBorder = 0,
  allow,
  allowFullScreen,
  title,
}: IFrameProps) => (
  <iframe
    src={src}
    width={width}
    height={height}
    className={className}
    style={style}
    onLoad={onLoad}
    scrolling={scrolling}
    frameBorder={frameBorder}
    allow={allow}
    allowFullScreen={allowFullScreen}
    title={title}
  />
);

export const HtmlEmbed = (_props: HtmlEmbedProps) => null;

export const StyleTag = ({ className, style, children }: StyleTagProps) => (
  <style className={className} style={style}>
    {children}
  </style>
);
