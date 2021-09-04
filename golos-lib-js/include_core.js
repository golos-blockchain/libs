const fs = require('fs');

console.log('Copying golos-lib wasm code...');

const buf = fs.readFileSync('../pkg/golos_lib_bg.wasm');
let code = buf.toString('base64');
code = `export default '${code}';`;
fs.writeFileSync('src/core/code.js', code);

console.log('Copying golos-lib JS wrapper...');
fs.copyFileSync('../pkg/golos_lib.js', 'src/core/golos_lib.js');
