#!/bin/sh
wasm-pack build --target no-modules
echo "global._golos_wasm = wasm_bindgen;" >> pkg/golos_lib.js
