class EmptyMiddleware {
    broadcast({ tx, privKeys, orig, }) {
        return orig(tx);
    }
}

module.exports = EmptyMiddleware;
