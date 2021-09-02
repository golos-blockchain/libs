const golos = require('../lib');

const username = process.env.GOLOS_USERNAME;
const password = process.env.GOLOS_PASSWORD;
const wif = golos.auth.toWif(username, password, 'posting');

golos
  .broadcast
  .upvote(
    wif,
    username,
    'pal',
    '2scmtp-test',
    null,
    function(err, result) {
      console.log(err, result);
    }
  );
