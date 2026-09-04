import type { CSSProperties, ReactNode } from "react";
import { Box } from "../../host";
import { classNames } from "../../utils/classNames";
import { boxSizeStyle } from "../../utils/style";
import { EmbedStyle } from "./EmbedStyle";

export interface EmbedShellProps {
  className?: string;
  extraClassName?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

export const EmbedShell = ({
  className,
  extraClassName,
  width,
  height,
  borderRadius,
  style,
  children,
}: EmbedShellProps) => (
  <Box
    className={classNames("rsme-embed", extraClassName, className)}
    style={boxSizeStyle(width, height, { borderRadius, ...style })}
  >
    <EmbedStyle />
    {children}
  </Box>
);
