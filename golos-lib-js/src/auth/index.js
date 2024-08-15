var bigi = require('bigi'),
    bs58 = require('bs58'),
    ecurve = require('ecurve'),
    Point = ecurve.Point,
    secp256k1 = ecurve.getCurveByName('secp256k1'),
    config = require('../config'),
    operations = require('./serializer/src/operations'),
    Signature = require('./ecc/src/signature'),
    PrivateKey = require('./ecc/src/key_private'),
    PublicKey = require('./ecc/src/key_public'),
    session = require('./session'),
    multiSession = require('./multiSession'),
    golosApi = require('../api'),
  hash = require('./ecc/src/hash');

var Auth = {};
var transaction = operations.transaction;
var signed_transaction = operations.signed_transaction;
import { promisify, } from '../promisify';

Auth.verify = function (name, password, auths) {
    var hasKey = false;
    var roles = [];
    for (var role in auths) {
        roles.push(role);
    }
    var pubKeys = this.generateKeys(name, password, roles);
    roles.forEach(function (role) {
        if (auths[role][0][0] === pubKeys[role]) {
            hasKey = true;
        }
    });
    return hasKey;
};

Auth.generateKeys = function (name, password, roles) {
    var pubKeys = {};
    roles.forEach(function (role) {
        var seed = name + role + password;
        var brainKey = seed.trim().split(/[\t\n\v\f\r ]+/).join(' ');
        var hashSha256 = hash.sha256(brainKey);
        var bigInt = bigi.fromBuffer(hashSha256);
        var toPubKey = secp256k1.G.multiply(bigInt);
        var point = new Point(toPubKey.curve, toPubKey.x, toPubKey.y, toPubKey.z);
        var pubBuf = point.getEncoded(toPubKey.compressed);
        var checksum = hash.ripemd160(pubBuf);
        var addy = Buffer.concat([pubBuf, checksum.slice(0, 4)]);
        pubKeys[role] = config.get('address_prefix') + bs58.encode(addy);
    });
    return pubKeys;
};

/**
    @arg {string} name - blockchain account name
    @arg {string} password - very strong password typically no shorter than a private key
    @arg {array} roles - defaults to standard Golos blockchain-level roles
*/
Auth.getPrivateKeys = function (name, password, roles = ['owner', 'active', 'posting', 'memo']) {
    var privKeys = {};
    roles.forEach(function (role) {
        privKeys[role] = this.toWif(name, password, role);
        privKeys[role + 'Pubkey'] = this.wifToPublic(privKeys[role]);
    }.bind(this));
    return privKeys;
};

Auth.isWif = function (privWif) {
    var isWif = false;
    try {
        var bufWif = new Buffer(bs58.decode(privWif));
        var privKey = bufWif.slice(0, -4);
        var checksum = bufWif.slice(-4);
        var newChecksum = hash.sha256(privKey);
        newChecksum = hash.sha256(newChecksum);
        newChecksum = newChecksum.slice(0, 4);
        if (checksum.toString() == newChecksum.toString()) {
            isWif = true;
        }
    } catch (e) { }
    return isWif;
};

Auth.loginAsync = function (name, password, callback) {
    try {
        let result = {owner: null, active: null, posting: null, memo: null, password: null}
        const roles = Object.keys(result).slice(0, 4);
        let privateKeys = {};
        let isPass = false;
        try {
            const pk = PrivateKey.fromWif(password);
            roles.map(role =>
                privateKeys[role] = pk.toString()
            );
        } catch (err) {
            isPass = true;
            roles.map(role =>
                privateKeys[role] = PrivateKey.fromSeed(`${name}${role}${password}`).toString()
            );
        }
        golosApi.getAccountsAsync([name], (err, res) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (res.length == 0) {
                callback('No such account', null);
                return;
            }
            if (res[0].frozen) {
                callback('Account is frozen', null)
                return
            }
            roles.slice(0, 3).map(role => {
                let key_auths = res[0][role].key_auths;
                for (let i = 0; i < key_auths.length; i++) {
                  if (this.wifIsValid(privateKeys[role], key_auths[i][0])) {
                    result[role] = privateKeys[role];
                    break;
                  }
                }
            });
            if (this.wifIsValid(privateKeys.memo, res[0].memo_key)) result.memo = privateKeys.memo;
            if (isPass && result.posting) result.password = password;
            callback(null, result)
        });
    } catch (err) { callback(err, null); }
};

Auth.login = promisify(Auth.loginAsync);

// `keys` is object like:
// { posting: "private posting key" }
Auth.withNodeLogin = async function ({ account, keys,
    call, dgp, api, sessionName }) {
    if (!sessionName) sessionName = 'node_login'
    if (!api) {
        api = golosApi
    }

    if (!dgp) {
        dgp = await api.getDynamicGlobalPropertiesAsync()
    }

    let resp

    const { MultiSession } = multiSession
    const ms = new MultiSession(sessionName)
    const sessionData = ms.load()
    let loginData = sessionData.getVal(account, 'login_data')
    if (loginData) {
        let resp = await call(loginData)
        if (!resp.login_error) {
            return resp
        }
    }

    const { head_block_number, witness } = dgp

    console.time('withNodeLogin - signData')
    const signed = this.signData(head_block_number.toString(), keys)
    console.timeEnd('withNodeLogin - signData')

    // TODO: only 1st, because node supports only 1 key
    const signature = Object.values(signed)[0]

    loginData = {
        account,
        signed_data:  {
            head_block_number,
            witness,
        },
        signature,
    }

    resp = await call(loginData)
    if (resp.login_error) {
        throw resp.login_error
    }

    sessionData.setVal(account, 'login_data', loginData).save()

    return resp
}

Auth.toWif = function (name, password, role) {
    var seed = name + role + password;
    var brainKey = seed.trim().split(/[\t\n\v\f\r ]+/).join(' ');
    var hashSha256 = hash.sha256(brainKey);
    var privKey = Buffer.concat([new Buffer([0x80]), hashSha256]);
    var checksum = hash.sha256(privKey);
    checksum = hash.sha256(checksum);
    checksum = checksum.slice(0, 4);
    var privWif = Buffer.concat([privKey, checksum]);
    return bs58.encode(privWif);
};

Auth.wifIsValid = function (privWif, pubWif) {
    return (this.wifToPublic(privWif) == pubWif);
};

Auth.wifToPublic = function (privWif) {
    var pubWif = PrivateKey.fromWif(privWif);
    pubWif = pubWif.toPublic().toString();
    return pubWif;
};

Auth.isPubkey = function(pubkey, address_prefix) {
    return PublicKey.fromString(pubkey, address_prefix) != null
}

Auth.signTransaction = function (trx, keys) {
    var signatures = [];
    if (trx.signatures) {
        signatures = [].concat(trx.signatures);
    }

    var cid = new Buffer(config.get('chain_id'), 'hex');
    var buf = transaction.toBuffer(trx);

    for (var key in keys) {
        var sig = Signature.signBuffer(Buffer.concat([cid, buf]), keys[key]);
        signatures.push(sig.toBuffer())
    }

    return signed_transaction.toObject(Object.assign(trx, { signatures: signatures }))
};

Auth.signData = function(data, keys) {
    const signatures = {};
    const bufSha = hash.sha256(data);
    const sign = (role, d) => {
        if (!d) return;
        const sig = Signature.signBufferSha256(bufSha, d);
        signatures[role] = sig.toHex();
    };
    for (let key in keys) {
        sign(key, keys[key]);
    }
    return signatures;
};

Auth.verifySignedData = function(data, signatures, account, authTypes) {
    const auth = { };
    const bufSha = hash.sha256(data);
    const verify = (type, sigHex, pubkey, weight, weight_threshold) => {
        if (!sigHex) return
        if (weight !== 1 || weight_threshold !== 1) {
            console.error(`Auth.verifySignedData unsupported ${type} auth configuration: ${account.name}`);
        } else {
            const parseSig = hexSig => {
                try {
                    return Signature.fromHex(hexSig);
                } catch(e) {
                    return null;
                }
            };
            const sig = parseSig(sigHex)
            const public_key = PublicKey.fromString(pubkey)
            const verified = sig.verifyHash(bufSha, public_key)
            auth[type] = verified
        }
    }
    for (const authType of authTypes) {
        const { key_auths, weight_threshold, } = account[authType];
        const [[ pubKey, weight, ]] = key_auths;
        verify(authType, signatures[authType], pubKey, weight, weight_threshold);
    }
    return auth;
};

Auth = {...Auth, ...session, ...multiSession};

module.exports = Auth;
