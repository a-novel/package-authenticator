#!/bin/bash

set -e

echo "@a-novel:registry=https://npm.pkg.github.com" > "$PWD/.npmrc"
echo "//npm.pkg.github.com/:_authToken=${RENOVATE_NPM_NPM_PKG_GITHUB_COM_TOKEN}" >> "$PWD/.npmrc"

pnpm i --frozen-lockfile
pnpm format
