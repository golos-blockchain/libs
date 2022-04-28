import { assert } from 'chai';
import { importNativeLib } from '../../src/';
import { unloadNativeLib } from '../../src/core';
import { Asset, _Asset, AssetEditor, _AssetEditor } from '../../src/utils';

describe('golos.utils.AssetEditor', function() {
    beforeEach(function() {
        unloadNativeLib();
    });

    it('asset-like constructor', async function() {
        await importNativeLib()

        var av = AssetEditor(0, 3, 'GOLOS')

        assert.equal(av.asset.amount, 0)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '')
        assert.equal(av.hasChange, true)

        var av = AssetEditor(123456, 3, 'GOLOS')

        assert.equal(av.asset.amount, 123456)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123.456')
        assert.equal(av.hasChange, true)
    })

    it('asset-like constructor + lib loading promise', async function() {
        var av = await AssetEditor(123456, 3, 'GOLOS')

        assert.equal(av.asset.amount, 123456)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123.456')
        assert.equal(av.hasChange, true)
    })

    it('asset-based constructor', async function() {
        await importNativeLib()

        var a = Asset(0, 3, 'GOLOS')
        var av = AssetEditor(a)

        assert.equal(av.asset.amount, 0)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '')
        assert.equal(av.hasChange, true)

        a.amount = 100;
        assert.equal(a.amount, 100);
        assert.equal(av.asset.amount, 0);

        var a = Asset(123456, 3, 'GOLOS')
        var av = AssetEditor(a)

        assert.equal(av.asset.amount, 123456)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123.456')
        assert.equal(av.hasChange, true)
    })

    it('instanceof test', async function() {
        var av = AssetEditor(1000, 3, 'GOLOS')
        assert.equal(av instanceof AssetEditor, false)
        assert.equal(av instanceof _AssetEditor, false)
        assert.equal(av instanceof Promise, true)

        av = await av
        assert.equal(av instanceof AssetEditor, false)
        assert.equal(av instanceof _AssetEditor, true)

        var av = AssetEditor(1000, 3, 'GOLOS')
        assert.equal(av instanceof AssetEditor, false)
        assert.equal(av instanceof _AssetEditor, true)
    })

    it('float case', async function() {
        await importNativeLib()

        var av = AssetEditor(0, 3, 'GOLOS')

        av = av.withChange('123')

        assert.equal(av.asset.amount, 123000)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123')
        assert.equal(av.hasChange, true)

        av = av.withChange('123.')

        assert.equal(av.asset.amount, 123000)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123.')
        assert.equal(av.hasChange, true)

        av = av.withChange('123.456')

        assert.equal(av.asset.amount, 123456)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123.456')
        assert.equal(av.hasChange, true)

        av = av.withChange('123.456.')

        assert.equal(av.asset.amount, 123456)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123.456')
        assert.equal(av.hasChange, false)

        av = av.withChange('123,456.')

        assert.equal(av.asset.amount, 123456)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123.456')
        assert.equal(av.hasChange, false)
    })

    it('clearing case', async function() {
        await importNativeLib()

        var av = AssetEditor(0, 3, 'GOLOS')

        av = av.withChange('123')

        assert.equal(av.asset.amount, 123000)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123')
        assert.equal(av.hasChange, true)

        av = av.withChange('')

        assert.equal(av.asset.amount, 0)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '')
        assert.equal(av.hasChange, true)
    })

    it('zeroing case', async function() {
        await importNativeLib()

        var av = AssetEditor(0, 3, 'GOLOS')

        av = av.withChange('123')

        assert.equal(av.asset.amount, 123000)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123')
        assert.equal(av.hasChange, true)

        av = av.withChange('0')

        assert.equal(av.asset.amount, 0)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '0')
        assert.equal(av.hasChange, true)
    })

    it('invalid characters + extra spaces', async function() {
        await importNativeLib()

        var av = AssetEditor(0, 3, 'GOLOS')

        av = av.withChange('123')

        assert.equal(av.asset.amount, 123000)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123')
        assert.equal(av.hasChange, true)

        av = av.withChange('123f')

        assert.equal(av.asset.amount, 123000)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123')
        assert.equal(av.hasChange, false)

        av = av.withChange(' 123.456 ')

        assert.equal(av.asset.amount, 123456)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '123.456')
        assert.equal(av.hasChange, true)
    })

    it('NaN', async function() {
        await importNativeLib()

        var av = AssetEditor(0, 3, 'GOLOS')

        av = av.withChange('f')

        assert.equal(av.asset.amount, 0)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '')
        assert.equal(av.hasChange, false)
    })

    it('negative cases', async function() {
        await importNativeLib()

        var av = AssetEditor(1, 3, 'GOLOS')

        av = av.withChange('-')

        assert.equal(av.asset.amount, 0)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '-')
        assert.equal(av.hasChange, true)

        av = av.withChange('-4')

        assert.equal(av.asset.amount, -4000)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '-4')
        assert.equal(av.hasChange, true)

        av = av.withChange('-45.67')

        assert.equal(av.asset.amount, -45670)
        assert.equal(av.asset.precision, 3)
        assert.equal(av.asset.symbol, 'GOLOS')
        assert.equal(av.amountStr, '-45.67')
        assert.equal(av.hasChange, true)
    })

    it('toJSON + toString', async function() {
        await importNativeLib()

        var av = AssetEditor(1000, 3, 'GOLOS')
        av = av.withChange('1.')
        assert.equal(JSON.stringify({
            av
        }), '{"av":"1.000 GOLOS"}')
        assert.equal(av.toString(), JSON.stringify({
            asset: '1.000 GOLOS',
            amount_str: '1.',
        }))
    })
})
