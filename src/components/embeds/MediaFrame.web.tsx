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
  <Box style={{ position: 'relative', width: '100%' }}>
    {children}
    {showPlaceholder ? (
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {placeholder}
      </Box>
    ) : null}
  </Box>
);
