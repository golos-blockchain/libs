class EmptyMiddleware {
    async broadcast({ tx, privKeys, orig, prepareTx, signTx, }) {
        tx = await prepareTx(tx)
        tx = await signTx(tx)
        return await orig(tx)
    }
}

module.exports = EmptyMiddleware;
