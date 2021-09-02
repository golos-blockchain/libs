import Promise from 'bluebird';
import should from 'should';
import golos from '../src';

const username = process.env.GOLOS_USERNAME || 'guest123';
const password = process.env.GOLOS_PASSWORD;
const postingWif = password
  ? golos.auth.toWif(username, password, 'posting')
  : '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg';

describe.skip('golos.broadcast:', () => {
  it('exists', () => {
    should.exist(golos.broadcast);
  });

  it('has generated methods', () => {
    should.exist(golos.broadcast.vote);
    should.exist(golos.broadcast.voteWith);
    should.exist(golos.broadcast.comment);
    should.exist(golos.broadcast.transfer);
  });

  it('has backing methods', () => {
    should.exist(golos.broadcast.send);
  });

  it('has promise methods', () => {
    should.exist(golos.broadcast.sendAsync);
    should.exist(golos.broadcast.voteAsync);
    should.exist(golos.broadcast.transferAsync);
  });

  describe('patching transaction with default global properties', () => {
    it('works', async () => {
      const tx = await golos.broadcast._prepareTransaction({
        extensions: [],
        operations: [['vote', {
          voter: 'pal',
          author: 'pal',
          permlink: '2scmtp-test',
        }]],
      });

      tx.should.have.properties([
        'expiration',
        'ref_block_num',
        'ref_block_prefix',
        'extensions',
        'operations',
      ]);
    });
  });

  describe('downvoting', () => {
    it('works', async () => {
      const tx = await golos.broadcast.voteAsync(
        postingWif,
        username,
        'pal',
        '2scmtp-test',
        -1000
      );

      tx.should.have.properties([
        'expiration',
        'ref_block_num',
        'ref_block_prefix',
        'extensions',
        'operations',
        'signatures',
      ]);
    });
  });

  describe('voting', () => {
    beforeEach(() => {
      return Promise.delay(2000);
    });

    it('works', async () => {
      const tx = await golos.broadcast.voteAsync(
        postingWif,
        username,
        'pal',
        '2scmtp-test',
        10000
      );

      tx.should.have.properties([
        'expiration',
        'ref_block_num',
        'ref_block_prefix',
        'extensions',
        'operations',
        'signatures',
      ]);
    });

    it('works with callbacks', (done) => {
      golos.broadcast.vote(
        postingWif,
        username,
        'pal',
        '2scmtp-test',
        5000,
        (err, tx) => {
          if (err) return done(err);
          tx.should.have.properties([
            'expiration',
            'ref_block_num',
            'ref_block_prefix',
            'extensions',
            'operations',
            'signatures',
          ]);
          done();
        }
      );
    });
  });

  describe('customJson', () => {
    before(() => {
      return Promise.delay(2000);
    });

    it('works', async () => {
      const tx = await golos.broadcast.customJsonAsync(
        postingWif,
        [],
        [username],
        'follow',
        JSON.stringify([
          'follow',
          {
            follower: username,
            following: 'fabien',
            what: ['blog'],
          },
        ])
      );

      tx.should.have.properties([
        'expiration',
        'ref_block_num',
        'ref_block_prefix',
        'extensions',
        'operations',
        'signatures',
      ]);
    });
  });
});
