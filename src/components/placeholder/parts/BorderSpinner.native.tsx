import type { CSSProperties } from 'react';
import { ActivityIndicator } from 'react-native';

export interface BorderSpinnerProps {
  className?: string;
  style?: CSSProperties;
}

export const BorderSpinner = ({ style }: BorderSpinnerProps) => (
  <ActivityIndicator size="small" color="#000000" style={style} />
);
