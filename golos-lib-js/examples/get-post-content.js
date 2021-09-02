const golos = require('../lib');

const resultP = golos.api.getContentAsync('pal', '2scmtp-test');
resultP.then(result => console.log(result));
