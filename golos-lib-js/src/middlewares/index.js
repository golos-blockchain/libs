const EmptyMiddleware = require('./EmptyMiddleware');
const OAuthMiddleware = require('./OAuthMiddleware');

let current = new EmptyMiddleware();

function use(middleware) {
    current = middleware;
}

function mw() {
    return current;
}

module.exports = {
    EmptyMiddleware,
    OAuthMiddleware,
    use,
    mw,
}
