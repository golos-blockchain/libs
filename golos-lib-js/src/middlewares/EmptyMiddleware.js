class EmptyMiddleware {
    async broadcast({ tx, privKeys, orig, }) {
        return await orig(tx);
    }
}

module.exports = EmptyMiddleware;
