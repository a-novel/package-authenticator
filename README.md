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

Also create the following `mui.d.ts` file (make sure it is included in your `tsconfig.json`):

```typescript
import type { AgoraUIButtonPropsVariant } from "@a-novel/package-ui/mui";

import "@mui/material";

declare module "@mui/material" {
  //eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ButtonPropsVariantOverrides extends AgoraUIButtonPropsVariant {}
}
```
