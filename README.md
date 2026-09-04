# universal-embed-react-socials

Embed posts from Facebook, Instagram, LinkedIn, Pinterest, TikTok, X (Twitter), YouTube, and Xymatic in **React** and **React Native**. Configurable platform API versions available.

On web, embeds use the official platform scripts and iframes. On React Native, paired `.native` files render a `WebView` (`react-native-webview`).

## Install

```bash
npm i universal-embed-react-socials
```

React Native also needs:

```bash
npm i react-native-webview
```

## Usage

```jsx
import { FacebookEmbed, InstagramEmbed } from 'universal-embed-react-socials';

<FacebookEmbed
  url="https://www.facebook.com/andrewismusic/posts/451971596293956"
  width={550}
  apiVersion="v26.0"
/>

<InstagramEmbed
  url="https://www.instagram.com/p/CUbHfhpswxt/"
  width={328}
  apiVersion="14"
  captioned
/>
```

### Facebook

```jsx
import { FacebookEmbed } from "universal-embed-react-socials";

<FacebookEmbed
  url="https://www.facebook.com/andrewismusic/posts/451971596293956"
  width={550}
  apiVersion="v26.0"
  locale="en_US"
/>;
```

`apiVersion` accepts `v26.0`, `26.0`, `v26`, or `26`. Default is `v26.0` (current Graph API).

### Instagram

```jsx
import { InstagramEmbed } from "universal-embed-react-socials";

<InstagramEmbed
  url="https://www.instagram.com/p/CUbHfhpswxt/"
  width={328}
  apiVersion="14"
  captioned
/>;
```

`apiVersion` maps to Instagram's `data-instgrm-version`. The original `igVersion` prop still works; `apiVersion` wins if both are set.

### LinkedIn

```jsx
import { LinkedInEmbed } from "universal-embed-react-socials";

<LinkedInEmbed
  url="https://www.linkedin.com/embed/feed/update/urn:li:share:6898694772484112384"
  postUrl="https://www.linkedin.com/posts/peterdiamandis_5-discoveries-the-james-webb-telescope-will-activity-6898694773406875648-z-D7"
  width={325}
  height={570}
/>;
```

Use the `src` from LinkedIn's "Embed this post" iframe.

### Pinterest

```jsx
import { PinterestEmbed } from "universal-embed-react-socials";

<PinterestEmbed
  url="https://www.pinterest.co.uk/pin/875105771321194304/"
  width={345}
  height={467}
/>;
```

### TikTok

```jsx
import { TikTokEmbed } from "universal-embed-react-socials";

<TikTokEmbed
  url="https://www.tiktok.com/@epicgardening/video/7055411162212633903"
  width={325}
/>;
```

### X (Twitter)

```jsx
import { XEmbed } from "universal-embed-react-socials";

<XEmbed
  url="https://twitter.com/PixelAndBracket/status/1356633038717923333"
  width={325}
/>;
```

`TwitterEmbed` is still exported as a deprecated alias of `XEmbed`.

### YouTube

```jsx
import { YouTubeEmbed } from "universal-embed-react-socials";

<YouTubeEmbed
  url="https://www.youtube.com/watch?v=HpVOs5imUN0"
  width={325}
  height={220}
/>;
```

Shorts (`youtube.com/shorts/ID`) and `youtu.be` links work. Extra player options go through `youTubeProps.opts.playerVars`.

### Xymatic

Same Green Video player used in the journal/app: load `gv.js` with a license key and render a `green-video` element.

```jsx
import { XymaticEmbed } from "universal-embed-react-socials";

<XymaticEmbed
  embedId="uPl8iezg"
  licenseKey="your-license-key"
  contentId="optional-content-id"
  width="100%"
  height={360}
/>;
```

Required: `embedId` and `licenseKey`. Optional: `contentId`, `mixId`, `hasNoAds`, `scriptSrc` (defaults to `https://cdn.greenvideo.io/players/gv.js`), and `pageTitle` (React Native WebView document title).

## React vs React Native

Platform-specific code lives in paired `.web.tsx` and `.native.tsx` files. Metro picks the native files; the web build flattens `.web` files for React DOM. Native embeds use `View` and `WebView` JSX.

You do not need `react-native` installed for a web-only app. On React Native, give embeds an explicit `width` and `height` so the WebView has a concrete size.

Pass extra `react-native-webview` options with `webViewProps` (ignored on web):

```jsx
<FacebookEmbed
  url="https://www.facebook.com/andrewismusic/posts/451971596293956"
  width={550}
  height={372}
  webViewProps={{
    allowsInlineMediaPlayback: true,
    userAgent: 'custom-ua',
    onMessage: (event) => console.log(event.nativeEvent.data),
  }}
/>
```

## Shared embed props

Every embed accepts:

- `url`
- `width` / `height`
- `linkText`
- `placeholderImageUrl`
- `placeholderSpinner` / `placeholderSpinnerDisabled`
- `embedPlaceholder` / `placeholderDisabled` / `placeholderProps`
- `className` / `style`
- `webViewProps` (React Native only)

Facebook, Instagram, and TikTok also support `scriptLoadDisabled`, `retryDelay`, `retryDisabled`, `frame`, and `debug`.

## API version helpers

```ts
import {
  DEFAULT_FACEBOOK_API_VERSION,
  DEFAULT_INSTAGRAM_API_VERSION,
  normalizeFacebookApiVersion,
  getFacebookSdkSrc,
} from "universal-embed-react-socials";
```

## License

MIT
