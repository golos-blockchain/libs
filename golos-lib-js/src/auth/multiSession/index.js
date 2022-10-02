const MultiSession = require('./MultiSession')
const MultiSessionData = require('./MultiSessionData')
const MultiSessionTempData = require('./MultiSessionTempData')

module.exports = {
    multiSession: new MultiSession(),
    MultiSession,
    MultiSessionData,
    MultiSessionTempData,
}
