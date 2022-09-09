const kcPromisify = (method) => {
    return async function(args) {
        return await new Promise((resolve, reject) => {
            method.call(golosKeychain, {...args, callback: (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            }})
        })
    }
}

const promises = {}
const singles = {}
for (let key of ['login', 'loggedIn', 'logout', 'sign']) {
    singles[key] = async (args) => {
        promises[key] = promises[key] || kcPromisify(golosKeychain[key])
        return await promises[key](args)
    }
}

export { singles }
