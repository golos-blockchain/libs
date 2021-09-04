#!/bin/sh
wasm-pack build --target no-modules
echo "export default wasm_bindgen;" >> pkg/golos_lib.js
