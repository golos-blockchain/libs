import isFunction from 'lodash/isFunction'
import { Asset, Price } from '../utils'

const ORDER_MAX_EXPIRATION = 0xffffffff

function makeOrderID() {
    return Math.floor(Date.now() / 1000)
}

async function makeExchangeTx(exchangeSteps, opts) {
    const defOpts = {
        op_type: 'limit_order_create',
        orderid: (op, i, ops, step) => {
            return makeOrderID()
        }
    }
    opts = {...defOpts, ...opts}

    const ops = []
    let i = 0
    for (const step of exchangeSteps) {
        const op = {}

        const copyField = (key, defVal) => {
            if (key in opts) {
                if (opts[key] !== undefined) {
                    op[key] = opts[key]
                }
            } else if (defVal !== undefined) {
                op[key] = defVal
            }
        }

        copyField('owner')
        if ('orderid' in opts) op.orderid = opts.orderid

        op.amount_to_sell = step.sell

        const prc = await new Price(step.limit_price)
        op.min_to_receive = Asset(step.sell).mul(prc).toString()

        copyField('fill_or_kill', false)

        op.expiration = opts.expiration || ORDER_MAX_EXPIRATION

        if (isFunction(opts.orderid)) {
            op.orderid = await opts.orderid(op, i++, ops, step)
        }

        ops.push([opts.op_type, op])
    }
    return ops
}

module.exports = {
    ORDER_MAX_EXPIRATION,
    makeOrderID,
    makeExchangeTx,
};
