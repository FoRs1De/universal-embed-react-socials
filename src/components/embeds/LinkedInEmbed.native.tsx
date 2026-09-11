import { useMemo } from 'react';
import { LINKEDIN_DESIGN_HEIGHT, linkedinEmbedHtml } from './embedHtml';
import type { LinkedInEmbedProps } from './LinkedInEmbed.types';
import { NativeSocialEmbed } from './NativeSocialEmbed';

export type { LinkedInEmbedProps } from './LinkedInEmbed.types';

export const LinkedInEmbed = ({
  url,
  postUrl,
  height,
  placeholderText = 'View post on LinkedIn',
  ...props
}: LinkedInEmbedProps) => {
  const html = useMemo(
    () => (height == null ? linkedinEmbedHtml({ url }) : undefined),
    [height, url],
  );
  return (
    <NativeSocialEmbed
      {...props}
      url={url}
      height={height}
      placeholderText={placeholderText}
      placeholderUrl={postUrl ?? url}
      {...(html != null ? { html, autoHeight: true } : { uri: url })}
      baseUrl="https://www.linkedin.com"
      fallbackHeight={LINKEDIN_DESIGN_HEIGHT}
    />
  );
};
