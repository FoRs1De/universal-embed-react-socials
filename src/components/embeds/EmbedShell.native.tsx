import type { CSSProperties, ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

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
  width,
  height,
  borderRadius,
  style,
  children,
}: EmbedShellProps) => (
  <View
    style={[
      { overflow: "hidden", width, height, borderRadius },
      style as StyleProp<ViewStyle>,
    ]}
  >
    {children}
  </View>
);
