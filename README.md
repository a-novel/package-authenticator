# Package authenticator

Unify authentication between clients and the authentication service.

[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/agorastoryverse)](https://twitter.com/agorastoryverse)
[![Discord](https://img.shields.io/discord/1315240114691248138?logo=discord)](https://discord.gg/rp4Qr8cA)

<hr />

![GitHub repo file or directory count](https://img.shields.io/github/directory-file-count/a-novel/package-authenticator)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/a-novel/package-authenticator)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/a-novel/package-authenticator/main.yaml)
[![codecov](https://codecov.io/gh/a-novel/package-authenticator/graph/badge.svg?token=VWCzfxjM1h)](https://codecov.io/gh/a-novel/package-authenticator)

![Coverage graph](https://codecov.io/gh/a-novel/package-authenticator/graphs/sunburst.svg?token=VWCzfxjM1h)

## Installation

> ⚠️ **Warning**: Even though the package is public, GitHub registry requires you to have a Personal Access Token
> with `repo` and `read:packages` scopes to pull it in your project. See
> [this issue](https://github.com/orgs/community/discussions/23386#discussioncomment-3240193) for more information.

Create a `.npmrc` file in the root of your project if it doesn't exist, and make sure it contains the following:

```ini
@a-novel:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${YOUR_PERSONAL_ACCESS_TOKEN}
```

Then, install the package using pnpm:

```bash
# pnpm config set auto-install-peers true
#  Or
# pnpm config set auto-install-peers true --location project
pnpm add @a-novel/package-authenticator
```

### Requirements

You need to import material symbols in your app.

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

## Usage

In your entry file.

```tsx
import i18n from "./locale_i18n_instance";

import { init as initAuthAPI } from "@a-novel/connector-authentication";
import { theme } from "@a-novel/neon-ui";
import { init as initAuthenticator, WithSession, useAuthNavConnector, AuthNav } from "@a-novel/package-authenticator";

import { FC, ReactNode } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { FormatIcu } from "@tolgee/format-icu";
import { BackendFetch, Tolgee, TolgeeProvider } from "@tolgee/react";

const cdn = "https://cdn.tolg.ee/74c1bb8828074430ae95b462ab95374b";

// A Tolgee instance is required for translations.
const tolgee = Tolgee()
  .use(BackendFetch({ prefix: cdn }))
  .use(FormatIcu())
  .init({
    defaultLanguage: "en",
    fallbackLanguage: "en",
    availableLanguages: ["en", "fr"],
    defaultNs: "generic",
  });

// Make sure the global context is properly set up.
initAuthAPI({ baseURL: import.meta.env.VITE_AUTH_API_URL });
initAuthenticator({ logo: "/path/to/logo.png" });

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const authConnector = useAuthNavConnector();

  return (
    <>
      <AuthNav connector={authConnector} account={{ onClick: () => goTo("/manage/account/page") }} />
      {children}
    </>
  );
};

export const App: FC<{ children: ReactNode }> = ({ children }) => (
  <TolgeeProvider tolgee={tolgee}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WithSession layout={AppLayout}>{children}</WithSession>
    </ThemeProvider>
  </TolgeeProvider>
);
```

### Make a page private

Private pages are only accessible to authenticated users. If an anonymous user tries to load a private page, it will
be presented with the login screen instead.

```tsx
import { SessionPrivateSuspense } from "@a-novel/package-authenticator";

import { FC } from "react";

const MyPage: FC = () => {
  // ...

  return (
    <SessionPrivateSuspense>
      <div>My private page</div>
    </SessionPrivateSuspense>
  );
};

export default MyPage;
```
