import { assert } from 'chai'
import { importNativeLib } from '../../src/'
import { unloadNativeLib } from '../../src/core'
import { Asset, _Asset, Price, _Price } from '../../src/utils'

describe('golos.utils.Asset Price', function() {
    beforeEach(function() {
        unloadNativeLib();
    });

    it('asset-based constructor', async function() {
        await importNativeLib()

        var asset = Asset('1.999 GOLOS')
        var asset2 = Asset('10.001 GBG')
        var price = Price(asset, asset2)
        assert.equal(price.base.toString(), '1.999 GOLOS')
        assert.equal(price.quote.toString(), '10.001 GBG')

        asset.amount += 1
        asset2.amount -= 1
        assert.equal(asset.toString(), '2.000 GOLOS')
        assert.equal(asset2.toString(), '10.000 GBG')
        assert.equal(price.base.toString(), '1.999 GOLOS')
        assert.equal(price.quote.toString(), '10.001 GBG')
    })

    it('object-based constructor', async function() {
        await importNativeLib()

        var price = Price({ base: '1.999 GOLOS', quote: '0.001 GBG'})
        assert.equal(price.base.toString(), '1.999 GOLOS')
        assert.equal(price.quote.toString(), '0.001 GBG')
    })

    it('object-based constructor + lib loading promise', async function() {
        var price = await Price({ base: '1.999 GOLOS', quote: '0.001 GBG'})
        assert.equal(price.base.toString(), '1.999 GOLOS')
        assert.equal(price.quote.toString(), '0.001 GBG')
    })

    it('immutability', async function() {
        await importNativeLib()

        var price = Price({ base: '1.999 GOLOS', quote: '0.001 GBG'})
        var base = price.base
        var quote = price.quote
        base.amount = 2
        quote.amount = 3
        assert.equal(base.toString(), '0.002 GOLOS')
        assert.equal(quote.toString(), '0.003 GBG')
        assert.equal(price.base.toString(), '1.999 GOLOS')
        assert.equal(price.quote.toString(), '0.001 GBG')
    })

    it('toString + toJSON', async function() {
        await importNativeLib()

        var price0 = { base: '1.999 GOLOS', quote: '0.001 GBG'}
        var price = Price({ base: '1.999 GOLOS', quote: '0.001 GBG'})
        var obj = {
            price
        }
        var obj0 = {
            price: price0
        }
        assert.equal(JSON.stringify(obj), JSON.stringify(obj0))
        assert.equal(price.toString(), price0.toString())
    })
})
