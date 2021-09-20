import { assert } from 'chai';
import { importNativeLib } from '../src/';
import { unloadNativeLib } from '../src/core';
import { Asset } from '../src/utils';
import th from './test_helper';
var sandbox = global.sandbox;

describe('golos.utils.Asset', function() {
    beforeEach(function() {
        unloadNativeLib();
    });

    it('returns promise if core not initialized', function() {
        assert.typeOf(Asset('1.000 GOLOS'), 'Promise');
    })

    it('in-place core init works', async function() {
        assert.equal((await Asset('1.000 GOLOS')).toString(0), '1 GOLOS');
    })

    it('early init works', async function() {
        await importNativeLib();
        assert.equal(Asset('1.000 GOLOS').toString(0), '1 GOLOS');
    })

    it('can be used synchronously after async call', async function() {
        assert.typeOf(Asset('1.000 GOLOS'), 'Promise');
        assert.equal((await Asset('1.000 GOLOS')).toString(0), '1 GOLOS');
        assert.equal(Asset('1.000 GOLOS').toString(0), '1 GOLOS');
    })

    it('constructor from string', async function() {
        await importNativeLib();

        var asset = Asset('1.000 GOLOS');
        assert.equal(asset.amount, 1000);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GOLOS');

        var asset = Asset('1.000000 GESTS');
        assert.equal(asset.amount, 1000000);
        assert.equal(asset.precision, 6);
        assert.equal(asset.symbol, 'GESTS');

        var asset = Asset('1.0 GOLOS');
        assert.equal(asset.amount, 10);
        assert.equal(asset.precision, 1);
        assert.equal(asset.symbol, 'GOLOS');

        var asset = Asset('1 GOLOS');
        assert.equal(asset.amount, 1);
        assert.equal(asset.precision, 0);
        assert.equal(asset.symbol, 'GOLOS');

        var asset = Asset('0.010 GBG');
        assert.equal(asset.amount, 10);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');

        var asset = Asset('0.001 GBG');
        assert.equal(asset.amount, 1);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');

        var asset = Asset('0.000 GBG');
        assert.equal(asset.amount, 0);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');

        var asset = Asset('-0.001 GBG');
        assert.equal(asset.amount, -1);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');

        var asset = Asset('-0.001 GBG');
        assert.equal(asset.amount, -1);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');

        var asset = Asset('123456789.123 GBG');
        assert.equal(asset.amount, 123456789123);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '123456789.123 GBG');

        var asset = Asset('-123456789.123 GBG');
        assert.equal(asset.amount, -123456789123);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '-123456789.123 GBG');

        var asset = Asset('9223372036854775.807 GBG');
        assert.equal(asset.amount, 9223372036854776000);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '9223372036854776.000 GBG');

        var asset = Asset('92233720368.54775808 GBG');
        assert.equal(asset.amount, 9223372036854776000);
        assert.equal(asset.precision, 8);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '92233720368.54776000 GBG');

        var asset = Asset('-9223372036854775.808 GBG');
        assert.equal(asset.amount, -9223372036854776000);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '-9223372036854776.000 GBG');

        var asset = Asset('-92233720368.54775808 GBG');
        assert.equal(asset.amount, -9223372036854776000);
        assert.equal(asset.precision, 8);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '-92233720368.54776000 GBG');
    })

    it('full constructor', async function() {
        await importNativeLib();

        var asset = Asset(1000, 3, 'GOLOS');
        assert.equal(asset.amount, 1000);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GOLOS');
        assert.equal(asset.toString(), '1.000 GOLOS');

        var asset = Asset(1000000, 6, 'GESTS');
        assert.equal(asset.amount, 1000000);
        assert.equal(asset.precision, 6);
        assert.equal(asset.symbol, 'GESTS');
        assert.equal(asset.toString(), '1.000000 GESTS');

        var asset = Asset(10, 1, 'GOLOS');
        assert.equal(asset.amount, 10);
        assert.equal(asset.precision, 1);
        assert.equal(asset.symbol, 'GOLOS');
        assert.equal(asset.toString(), '1.0 GOLOS');

        var asset = Asset(1, 0, 'GOLOS');
        assert.equal(asset.amount, 1);
        assert.equal(asset.precision, 0);
        assert.equal(asset.symbol, 'GOLOS');
        assert.equal(asset.toString(), '1. GOLOS');

        var asset = Asset(10, 3, 'GBG');
        assert.equal(asset.amount, 10);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '0.010 GBG');

        var asset = Asset(1, 3, 'GBG');
        assert.equal(asset.amount, 1);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '0.001 GBG');

        var asset = Asset(0, 3, 'GBG');
        assert.equal(asset.amount, 0);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '0.000 GBG');

        var asset = Asset(123456789123, 3, 'GBG');
        assert.equal(asset.amount, 123456789123);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '123456789.123 GBG');

        var asset = Asset(-123456789123, 3, 'GBG');
        assert.equal(asset.amount, -123456789123);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GBG');
        assert.equal(asset.toString(), '-123456789.123 GBG');
    })

    it('arithmetics: < > =', async function() {
        var a1 = await Asset('1.00000000 GESTS');
        var a2 = Asset('1.00000000 VESTS');
        var a3 = Asset('1.00000001 GESTS');
        var a4 = Asset('1.00000000 GESTS');
        var a5 = Asset('0.99999999 GESTS');

        assert.isTrue(a1.eq(a4));
        assert.isTrue(!a1.eq(a3));
        assert.isTrue(!a1.eq(a5));

        assert.isTrue(a1.lt(a3));
        assert.isTrue(a3.gt(a1));
        assert.isTrue(a1.gt(a5));
        assert.isTrue(a5.lt(a1));
        assert.isTrue(!a5.gt(a1));
        assert.isTrue(!a4.gt(a1));
        assert.isTrue(!a4.lt(a1));

        assert.isTrue(a1.lte(a3));
        assert.isTrue(a3.gte(a1));
        assert.isTrue(a1.gte(a5));
        assert.isTrue(a5.lte(a1));
    })

    it('arithmetics: +', async function() {
        var a1 = await Asset('1.00000001 GESTS');
        var a2 = Asset('1.00500919 GESTS');
        var a3 = Asset('2.00500920 GESTS');

        assert.isTrue(a1.plus(a2).eq(a3));

        var a1 = await Asset('1.00000000 GESTS');
        var a2 = Asset('-2.00000000 GESTS');
        var a3 = Asset('-1.00000000 GESTS');

        assert.isTrue(a1.plus(a2).eq(a3));

        var a1 = await Asset('1.00000000 GESTS');
        var a2 = 100000000;
        var a3 = Asset('2.00000000 GESTS');

        assert.isTrue(a1.plus(a2).eq(a3));

        var a1 = await Asset('1.00000000 GESTS');
        var a2 = -200000000;
        var a3 = Asset('-1.00000000 GESTS');

        assert.isTrue(a1.plus(a2).eq(a3));
    })

    it('arithmetics: -', async function() {
        var a1 = await Asset('2.00000000 GESTS');
        var a2 = Asset('1.00000001 GESTS');
        var a3 = Asset('0.99999999 GESTS');

        assert.isTrue(a1.minus(a2).eq(a3));
        var a1 = Asset('1.00000001 GESTS');
        var a2 = Asset('2.00000000 GESTS');
        var a3 = Asset('-0.99999999 GESTS');

        assert.isTrue(a1.minus(a2).eq(a3));
    })

    it('arithmetics: * /', async function() {
        var a1 = await Asset('2.00000000 GESTS');
        var a2 = Asset('10.00000000 GESTS');

        assert.isTrue(a1.mul(5).eq(a2));
        assert.isTrue(a2.div(5).eq(a1));
        assert.isTrue(a2.mul(100).div(100).eq(a2));
        assert.isTrue(a2.mul(20).div(100).eq(a1));

        var a3 = Asset('5.543 GOLOS');
        assert.equal(a3.mul(25).div(100).amount, 1385);
    })

    it('arithmetics: chaining', async function() {
        var a1 = await Asset('1.00000000 GESTS');

        assert.equal(a1.plus(2000).minus(1999).mul(4).div(2).amount, 200000002);
    })
})
