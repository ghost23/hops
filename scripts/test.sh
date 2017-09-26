#!/usr/bin/env bash
set -ex
cd spec
REACT_VERSION="${REACT_VERSION:-"^16.0.0"}"

rm -rf node_modules/
npm install --no-package-lock
npm install --no-save {react,react-dom}@$REACT_VERSION

mocha *.js