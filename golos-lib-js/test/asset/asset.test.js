import { assert } from 'chai';
import { importNativeLib } from '../../src/';
import { unloadNativeLib } from '../../src/core';
import { Asset, _Asset, Price, _Price } from '../../src/utils';

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

    const check = (str, amount, precision, symbol, amountFloat, str2 = null) => {
        var asset = Asset(str)
        assert.equal(asset.amount, amount)
        assert.equal(asset.precision, precision)
        assert.equal(asset.symbol, symbol)
        assert.equal(asset.toString(), str2 || str)
        assert.equal(JSON.stringify({
            asset
        }), JSON.stringify({
            asset: asset.toString()
        }))
        assert.equal(asset.amountFloat, amountFloat)
        const isUIA = (symbol !== 'GOLOS' && symbol !== 'GBG' && symbol !== 'GESTS')
        assert.equal(asset.isUIA, isUIA)
        return asset
    }

    it('constructor from string + amountFloat + toString + toJSON', async function() {
        await importNativeLib()

        check('1.000 GOLOS', 1000, 3, 'GOLOS', '1')
        check('1.000000 GESTS', 1000000, 6, 'GESTS', '1')

        check('0.000 GOLOS', 0, 3, 'GOLOS', '0')
        check('0.001 GOLOS', 1, 3, 'GOLOS', '0.001')
        check('0.010 GOLOS', 10, 3, 'GOLOS', '0.01')
        check('0.100 GOLOS', 100, 3, 'GOLOS', '0.1')
        check('0.099 GOLOS', 99, 3, 'GOLOS', '0.099')
        check('1.001 GOLOS', 1001, 3, 'GOLOS', '1.001')
        check('1234.567 GOLOS', 1234567, 3, 'GOLOS', '1234.567')

        check('-0.000 GOLOS', 0, 3, 'GOLOS', '0', '0.000 GOLOS')
        check('-0.001 GOLOS', -1, 3, 'GOLOS', '-0.001')
        check('-0.010 GOLOS', -10, 3, 'GOLOS', '-0.01')
        check('-0.100 GOLOS', -100, 3, 'GOLOS', '-0.1')
        check('-0.099 GOLOS', -99, 3, 'GOLOS', '-0.099')
        check('-1.001 GOLOS', -1001, 3, 'GOLOS', '-1.001')
    })

    it('same, but limits', async function() {
        await importNativeLib()

        check('9223372036854775.807 GBG', 9223372036854776000, 3, 'GBG', '9223372036854775.807')
        check('92233720368.54775808 GBG', -9223372036854776000, 8, 'GBG', '-92233720368.54775808', '-92233720368.54775808 GBG')
        check('-9223372036854775.808 GBG', -9223372036854776000, 3, 'GBG', '-9223372036854775.808')
        check('-92233720368.54775808 GBG', -9223372036854776000, 8, 'GBG', '-92233720368.54775808')
    })

    it('same, but UIA precisions', async function() {
        await importNativeLib()

        check('0.00000001 BTC', 1, 8, 'BTC', '0.00000001')
        check('-0.00000001 BTC', -1, 8, 'BTC', '-0.00000001')
        check('0.99999999 BTC', 99999999, 8, 'BTC', '0.99999999')
        check('-0.99999999 BTC', -99999999, 8, 'BTC', '-0.99999999')
        check('0.00000000 BTC', 0, 8, 'BTC', '0')

        check('0.00000000000001 DEVILCOIN', 1, 14, 'DEVILCOIN', '0.00000000000001')
        check('-0.00000000000001 DEVILCOIN', -1, 14, 'DEVILCOIN', '-0.00000000000001')
        check('0.00000000000000 DEVILCOIN', 0, 14, 'DEVILCOIN', '0')

        check('1.0 GOLOS', 10, 1, 'GOLOS', '1')
        check('1.1 GOLOS', 11, 1, 'GOLOS', '1.1')
        check('1.9 GOLOS', 19, 1, 'GOLOS', '1.9')
        check('0.1 GOLOS', 1, 1, 'GOLOS', '0.1')
        check('0.0 GOLOS', 0, 1, 'GOLOS', '0')
        check('-0.0 GOLOS', 0, 1, 'GOLOS', '0', '0.0 GOLOS')
        check('-1.0 GOLOS', -10, 1, 'GOLOS', '-1')
        check('-1.1 GOLOS', -11, 1, 'GOLOS', '-1.1')
        check('-1.9 GOLOS', -19, 1, 'GOLOS', '-1.9')
        check('-0.1 GOLOS', -1, 1, 'GOLOS', '-0.1')

        check('1 GOLOS', 1, 0, 'GOLOS', '1')
        check('1234 GOLOS', 1234, 0, 'GOLOS', '1234')
        check('0 GOLOS', 0, 0, 'GOLOS', '0')
        check('-0 GOLOS', 0, 0, 'GOLOS', '0', '0 GOLOS')
        check('-1 GOLOS', -1, 0, 'GOLOS', '-1')
        check('-1234 GOLOS', -1234, 0, 'GOLOS', '-1234')
    })

    it('full constructor', async function() {
        await importNativeLib();

        var asset = Asset(1000, 3, 'GOLOS');
        assert.equal(asset.amount, 1000);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GOLOS');

        var asset = Asset(1000000, 6, 'GESTS');
        assert.equal(asset.amount, 1000000);
        assert.equal(asset.precision, 6);
        assert.equal(asset.symbol, 'GESTS');

        var asset = Asset(0, 3, 'GOLOS');
        assert.equal(asset.amount, 0);
        assert.equal(asset.precision, 3);

        var asset = Asset(-1, 3, 'GOLOS');
        assert.equal(asset.amount, -1);
        assert.equal(asset.precision, 3);

        var asset = Asset(10, 0, 'GOLOS');
        assert.equal(asset.amount, 10);
        assert.equal(asset.precision, 0);

        var asset = Asset(0, 0, 'GOLOS');
        assert.equal(asset.amount, -0);
        assert.equal(asset.precision, 0);
    })

    it('instanceof test', async function() {
        var asset = Asset(1000, 3, 'GOLOS')
        assert.equal(asset instanceof Asset, false)
        assert.equal(asset instanceof _Asset, false)
        assert.equal(asset instanceof Promise, true)

        asset = await asset
        assert.equal(asset instanceof Asset, false)
        assert.equal(asset instanceof _Asset, true)

        var asset = Asset(1000, 3, 'GOLOS')
        assert.equal(asset instanceof Asset, false)
        assert.equal(asset instanceof _Asset, true)
    })

    it('clone test', async function() {
        await importNativeLib();

        var a = Asset(1000, 3, 'GOLOS')
        var a2 = a.clone()
        assert.equal(a.toString(), '1.000 GOLOS')
        assert.equal(a2.toString(), '1.000 GOLOS')
        a2.amount = 2000
        a2.symbol = 'GBG'
        assert.equal(a.toString(), '1.000 GOLOS')
        assert.equal(a2.toString(), '2.000 GBG')
        a.amount = 3000000
        a.precision = 6
        a.symbol = 'GESTS'
        assert.equal(a.toString(), '3.000000 GESTS')
        assert.equal(a2.toString(), '2.000 GBG')
    })

    it('amountFloat + floatString', async function() {
        await importNativeLib();

        const checkRes = (asset, str) => {
            assert.equal(asset.amountFloat, str)
            assert.equal(asset.floatString, str + ' ' + asset.symbol)
        }

        var asset = Asset('1.000 GOLOS');
        assert.equal(asset.amount, 1000);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GOLOS');
        checkRes(asset, '1')

        asset.amountFloat = '1.1';
        checkRes(asset, '1.1')

        assert.equal(asset.amount, 1100);
        asset.amountFloat = '1';
        checkRes(asset, '1')

        assert.equal(asset.amount, 1000);
        asset.amountFloat = '-0.1';
        checkRes(asset, '-0.1')

        assert.equal(asset.amount, -100);
        asset.amountFloat = '0';
        checkRes(asset, '0')

        assert.equal(asset.amount, 0);
        asset.amountFloat = '-0.01';
        checkRes(asset, '-0.01')

        assert.equal(asset.amount, -10);
        asset.amountFloat = '0.01';
        checkRes(asset, '0.01')

        assert.equal(asset.amount, 10);
        asset.amountFloat = '0,01';
        checkRes(asset, '0.01')

        assert.equal(asset.amount, 10);
        asset.amountFloat = '1.';
        checkRes(asset, '1')

        assert.equal(asset.amount, 1000);
        asset.amountFloat = '-';
        checkRes(asset, '0')

        assert.equal(asset.amount, 0);
        asset.amountFloat = '';
        assert.equal(asset.amount, 0);
        checkRes(asset, '0')

        var asset = Asset('1 GBG');
        assert.equal(asset.amount, 1);
        assert.equal(asset.precision, 0);
        assert.equal(asset.symbol, 'GBG');
        checkRes(asset, '1')

        asset.amountFloat = '2'
        checkRes(asset, '2')

        asset.amountFloat = '0.01'
        checkRes(asset, '0')
    })

    it('updateAmountFloat', async function() {
        await importNativeLib();

        var asset = Asset('1.000 GOLOS');
        assert.equal(asset.amount, 1000);
        assert.equal(asset.precision, 3);
        assert.equal(asset.symbol, 'GOLOS');
        assert.equal(asset.updateAmountFloat(' 0.100 '), '0.100')
        assert.equal(asset.updateAmountFloat(' 0. '), '0.')
        assert.equal(asset.updateAmountFloat(' 10.90 '), '10.90')
        assert.equal(asset.updateAmountFloat(' 1.9999 '), '1.999')
        assert.equal(asset.updateAmountFloat(' 1,9999 '), '1.999')
        assert.equal(asset.updateAmountFloat(' 10.12.34 '), '10.123')
        assert.equal(asset.updateAmountFloat(' 10,12,34 '), '10.123')
        assert.equal(asset.updateAmountFloat(''), '')
        assert.equal(asset.updateAmountFloat('-'), '-')
        assert.equal(asset.updateAmountFloat('.'), '.')
        assert.equal(asset.updateAmountFloat('-.'), '-.')
        assert.throws(() => asset.updateAmountFloat('0.1k0'), 'NaN')
        assert.throws(() => asset.updateAmountFloat('k.100'), 'NaN')
        assert.throws(() => asset.updateAmountFloat('1k.100'), 'NaN')
        assert.throws(() => asset.updateAmountFloat('-0.-100'), 'NaN')
        assert.throws(() => asset.updateAmountFloat('--0.100'), 'NaN')
        assert.throws(() => asset.updateAmountFloat('1.000 GOLOS'), 'NaN')
    })

    it('arithmetics: < > = min max', async function() {
        var a1 = await Asset('1.00000000 GESTS');
        var a2 = Asset('1.00000000 VESTS');
        var a3 = Asset('1.00000001 GESTS');
        var a4 = Asset('1.00000000 GESTS');
        var a5 = Asset('0.99999999 GESTS');

        assert.isTrue(a1.eq(a4));
        assert.isTrue(a1.eq(100000000))
        assert.isTrue(!a1.eq(a3));
        assert.isTrue(!a1.eq(100000001))
        assert.isTrue(!a1.eq(a5));
        assert.isTrue(!a1.eq(99999999))

        assert.isTrue(a1.lt(a3));
        assert.isTrue(a1.lt(100000001))
        assert.isTrue(a3.gt(a1));
        assert.isTrue(a3.gt(100000000))
        assert.isTrue(a1.gt(a5));
        assert.isTrue(a1.gt(99999999))
        assert.isTrue(a5.lt(a1));
        assert.isTrue(a5.lt(100000000))
        assert.isTrue(!a5.gt(a1));
        assert.isTrue(!a5.gt(100000000))
        assert.isTrue(!a4.gt(a1));
        assert.isTrue(!a4.gt(100000000))
        assert.isTrue(!a4.lt(a1));
        assert.isTrue(!a4.lt(100000000))

        assert.isTrue(a1.lte(a3));
        assert.isTrue(a1.lte(100000001))
        assert.isTrue(a3.gte(a1));
        assert.isTrue(a3.gte(100000000))
        assert.isTrue(a1.gte(a5));
        assert.isTrue(a1.gte(99999999))
        assert.isTrue(a5.lte(a1));
        assert.isTrue(a5.lte(100000000))

        assert.isTrue(a1.min(a2).eq(a1))
        assert.isTrue(a1.min(100000000).eq(100000000))
        assert.isTrue(a1.min(a3).eq(a1))
        assert.isTrue(a1.min(100000001).eq(100000000))
        assert.isTrue(a3.min(a1).eq(a1))
        assert.isTrue(a3.min(100000000).eq(100000000))

        assert.isTrue(a1.max(a2).eq(a1))
        assert.isTrue(a1.max(100000000).eq(100000000))
        assert.isTrue(a1.max(a3).eq(a3))
        assert.isTrue(a1.max(100000001).eq(100000001))
        assert.isTrue(a3.max(a1).eq(a3))
        assert.isTrue(a3.max(100000000).eq(100000001))
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

    it('arithmetics: * / mod', async function() {
        var a1 = await Asset('2.00000000 GESTS');
        var a2 = Asset('10.00000000 GESTS');

        assert.isTrue(a1.mul(5).eq(a2));
        assert.isTrue(a2.div(5).eq(a1));
        assert.isTrue(a2.mul(100).div(100).eq(a2));
        assert.isTrue(a2.mul(20).div(100).eq(a1));

        var a3 = Asset('5.543 GOLOS');
        assert.equal(a3.mul(25).div(100).amount, 1385);
        assert.equal(a3.mul(25).mod(100).amount, 75)
        assert.equal(a3.mod(5543).amount, 0)
        assert.equal(a3.mod(5544).amount, 5543)
    })

    it('arithmetics: mul price', async function() {
        var price = await Price({
            base: '54345.321 GOLOS',
            quote: '8.000012 GESTS'
        })

        var asset = Asset('25.002 GOLOS')
        assert.equal(asset.mul(price).toString(), '0.003680 GESTS')
        var remain = Asset('0.000 GOLOS')
        assert.equal(asset.mul(price, remain).toString(), '0.003680 GESTS')
        assert.equal(remain.toString(), '25518.744 GOLOS')

        var price = await Price({
            base: '1.000 GOLOS',
            quote: '1.000 GESTS'
        })

        var asset = Asset('25.002 GESTS')
        var remain = Asset('0.000 GESTS')
        assert.equal(asset.mul(price, remain).toString(), '25.002 GOLOS')
        assert.equal(remain.toString(), '0.000 GESTS')

        var asset = Asset('9223372036854775.807 GESTS')
        assert.equal(asset.mul(price, remain).toString(), '9223372036854775.807 GOLOS')
        assert.equal(remain.toString(), '0.000 GESTS')
    })

    it('arithmetics: chaining', async function() {
        var a1 = await Asset('1.00000000 GESTS');

        assert.equal(a1.plus(2000).minus(1999).mul(4).div(2).amount, 200000002);
    })
})
