import type { ReactNode } from 'react';
import { Box } from '../../host';

export const MediaFrame = ({
  children,
  placeholder,
  showPlaceholder,
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  showPlaceholder: boolean;
}) => (
  <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
    {children}
    {showPlaceholder && placeholder != null ? (
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {placeholder}
      </Box>
    ) : null}
  </Box>
);
