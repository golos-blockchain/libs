import { assert } from 'chai';

import { Asset, } from '../src/utils';
import { formatter, importNativeLib } from '../src'

describe('golos.formatter', function() {
    it('vestToGolos + golosToVest', async function() {
        await importNativeLib()

        const total_vesting = '1000.000000 GESTS'
        const total_golos = '1.000 GOLOS'
        const vesting_shares = '2222.222222 GESTS'

        assert.equal(formatter.vestToGolos('2222.222222 GESTS',
            total_vesting, total_golos), 2.222222222)

        assert.equal(formatter.golosToVest('2.222 GOLOS',
            total_vesting, total_golos), 2222)

        assert.equal(formatter.vestToGolos(Asset('2222.222222 GESTS'),
            total_vesting, total_golos).toString(), Asset('2.222 GOLOS').toString())
        assert.equal(formatter.vestToGolos(Asset('2222.222222 GESTS'),
            Asset(total_vesting), total_golos).toString(), Asset('2.222 GOLOS').toString())
        assert.equal(formatter.vestToGolos(Asset('2222.222222 GESTS'),
            Asset(total_vesting), Asset(total_golos)).toString(), Asset('2.222 GOLOS').toString())

        assert.equal(formatter.golosToVest(Asset('2.222 GOLOS'),
            total_vesting, total_golos).toString(), Asset('2222.000000 GESTS').toString())
        assert.equal(formatter.golosToVest(Asset('2.222 GOLOS'),
            Asset(total_vesting), total_golos).toString(), Asset('2222.000000 GESTS').toString())
        assert.equal(formatter.golosToVest(Asset('2.222 GOLOS'),
            Asset(total_vesting), Asset(total_golos)).toString(), Asset('2222.000000 GESTS').toString())
    })
})
