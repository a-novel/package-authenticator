#!/bin/bash

set -e

pnpm config set "@a-novel:registry" "https://npm.pkg.github.com"
pnpm config set "//npm.pkg.github.com/:_authToken" "${RENOVATE_NPM_NPM_PKG_GITHUB_COM_TOKEN}"

pnpm i --frozen-lockfile
pnpm format
