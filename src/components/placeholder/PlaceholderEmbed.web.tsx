import { Box, EmbedImage, EmbedLink, Txt } from '../../host';
import { classNames } from '../../utils/classNames';
import { EmbedStyle } from '../embeds/EmbedStyle';
import { BorderSpinner } from './parts/BorderSpinner';
import { EngagementIconsPlaceholder } from './parts/EngagementIconsPlaceholder';
import { ProfilePlaceholder } from './parts/ProfilePlaceholder';
import type { PlaceholderEmbedProps } from './PlaceholderEmbed.types';

export type { PlaceholderEmbedProps } from './PlaceholderEmbed.types';

const isJavaScriptProtocol =
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;

export const PlaceholderEmbed = ({
  url,
  linkText = 'View post',
  imageUrl,
  spinner = <BorderSpinner />,
  allowJavaScriptUrls = true,
  spinnerDisabled,
  className,
  style,
}: PlaceholderEmbedProps) => {
  if (isJavaScriptProtocol.test(url) && !allowJavaScriptUrls) {
    console.warn(`PlaceholderEmbed has blocked a javascript: URL as a security precaution`);
    return null;
  }

  return (
    <Box
      className={classNames(className)}
      style={{
        overflow: 'hidden',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#dee2e6',
        backgroundColor: '#ffffff',
        borderRadius: 0,
        boxSizing: 'border-box',
        position: 'relative',
        ...style,
      }}
    >
      <EmbedStyle />
      <EmbedLink href={url} style={{ textDecoration: 'none' }}>
        {!imageUrl && (
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 16,
              paddingBottom: 16,
              zIndex: 2,
              backgroundColor: '#ffffff',
            }}
          >
            <ProfilePlaceholder />
          </Box>
        )}
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: imageUrl ? 'flex-start' : 'center',
            height: '100%',
            width: '100%',
          }}
        >
          {!imageUrl && (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                rowGap: 16,
                zIndex: 3,
                padding: 8,
                backgroundColor: '#ffffff',
              }}
            >
              {!spinnerDisabled && spinner}
              {!!linkText && (
                <Txt
                  style={{
                    color: '#000000',
                    fontFamily: 'Arial,sans-serif',
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: 18,
                    textAlign: 'center',
                  }}
                >
                  {linkText}
                </Txt>
              )}
            </Box>
          )}
          {imageUrl &&
            (typeof style?.height !== 'undefined' ? (
              <Box style={{ width: '100%', height: '100%', marginBottom: 40 }}>
                <EmbedImage src={imageUrl} style={{ width: '100%', height: '100%' }} />
              </Box>
            ) : (
              <Box style={{ width: '100%', marginBottom: 40 }}>
                <EmbedImage src={imageUrl} style={{ width: '100%' }} />
              </Box>
            ))}
        </Box>
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 40,
            width: '100%',
            backgroundColor: '#ffffff',
            zIndex: 1,
          }}
        >
          {!imageUrl && <EngagementIconsPlaceholder style={{ marginLeft: 16 }} />}
          {imageUrl && (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                columnGap: 16,
              }}
            >
              <Txt
                style={{
                  color: '#0095f6',
                  fontWeight: '600',
                  fontFamily: 'Arial,sans-serif',
                  fontSize: 14,
                  fontStyle: 'normal',
                  marginLeft: 16,
                }}
              >
                {linkText}
              </Txt>
              {!spinnerDisabled && <Box style={{ marginRight: 16 }}>{spinner}</Box>}
            </Box>
          )}
        </Box>
      </EmbedLink>
    </Box>
  );
};
