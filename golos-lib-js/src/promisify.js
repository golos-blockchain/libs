class PromiseError {
    constructor(error) {
        this.cause = error;
        this.message = error.message;
        this.name = error.name || 'Error';
        if (error.payload)
            this.payload = error.payload;
        this.stack = error.stack;
    }
}

export function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn.call(this, ...args, (err, res) => {
                if (err) reject(err);
                else resolve(res); 
            });
        })
    };
}

export function promisifyAll(obj, suffix = 'Async') {
    let keys = Object.getOwnPropertyNames(obj);
    let ret = new Set();
    for (let key of keys) {
        if (key === 'constructor')
            continue;
        var desc = Object.getOwnPropertyDescriptor(obj, key);
        if (desc != null && desc.get == null && desc.set == null) {
            ret.add(key);
        }
    }
    for (let key of ret) {
        obj[key + suffix] = promisify(obj[key]);
    }
}

export function nodeify(promise, callback) {
    const isCallback = typeof callback === 'function'
    return promise
      .then(res => {
        if (isCallback) callback(null, res);
        return res;
      })
      .catch(err => {
        if (isCallback)
            callback(err, null);
        else
            throw err;
      });
}
