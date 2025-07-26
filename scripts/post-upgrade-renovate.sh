#!/bin/bash

set -e

echo "${#GITHUB_TOKEN}"
echo "@a-novel:registry=https://npm.pkg.github.com" > "$PWD/.npmrc"
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> "$PWD/.npmrc"

pnpm i --frozen-lockfile
pnpm format
