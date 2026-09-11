import type { CSSProperties, ReactElement } from 'react';

export interface BorderSpinnerProps {
  className?: string;
  style?: CSSProperties;
}

/** Platform implementations: `BorderSpinner.web.tsx` / `BorderSpinner.native.tsx`. */
export declare const BorderSpinner: (props: BorderSpinnerProps) => ReactElement;
