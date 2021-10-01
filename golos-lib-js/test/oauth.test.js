import { assert } from 'chai';
import { check, } from '../src/oauth';
import th from './test_helper';
import { clientId, apiHost, uiHost, login, logout, } from '../src/oauth';
import config from '../src/config';

describe('golos.oauth: check', function() {
    it('clientId()', async function() {
        assert.throws(() => clientId(), 'oauth.client is not set in golos.config');
        assert.isRejected(logout(), 'oauth.client is not set in golos.config');
        config.set('oauth.client', 'alicenet');
        assert.equal(clientId(), 'alicenet');
        assert.equal(clientId(), 'alicenet');
    });
    it('apiHost() + uiHost()', async function() {
        assert.throws(() => apiHost(), 'oauth.host is not set in golos.config');
        assert.throws(() => uiHost(), 'oauth.host is not set in golos.config');
        config.set('oauth.host', '/');
        assert.throws(() => apiHost(), 'oauth.host cannot be parsed as URL: https:///');
        config.set('oauth.host', 'golos.app/test');
        assert.equal(apiHost(), 'https://golos.app');
        assert.equal(apiHost(), 'https://golos.app');
        assert.equal(uiHost(), 'https://golos.app');
    });
    it('login', async function() {
        config.set('oauth.client', 'alicenet');
        config.set('oauth.host', 'golos.app');
        assert.throws(() => login(), 'OAuth works only in browser environment (window should be defined)');
    });
});
