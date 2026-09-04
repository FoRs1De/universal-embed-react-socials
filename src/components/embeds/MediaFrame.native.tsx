import type { ReactNode } from 'react';
import { View } from 'react-native';

export const MediaFrame = ({
  children,
  placeholder,
  showPlaceholder,
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  showPlaceholder: boolean;
}) => (
  <View style={{ position: 'relative', width: '100%' }}>
    {children}
    {showPlaceholder ? (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>{placeholder}</View>
    ) : null}
  </View>
);
