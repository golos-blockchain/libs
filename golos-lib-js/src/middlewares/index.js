const EmptyMiddleware = require('./EmptyMiddleware');
const MultiAuthMiddleware = require('./MultiAuthMiddleware');

let current = new EmptyMiddleware();

function use(middleware) {
    current = middleware;
}

function mw() {
    return current;
}

module.exports = {
    EmptyMiddleware,
    MultiAuthMiddleware,
    use,
    mw,
}
