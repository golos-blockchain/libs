import { MY_HASH } from './my_hash.js'

class Libs {
    constructor(rootObj) {
        this.rootObj = rootObj
        rootObj.libs = this
    }

    add = (lib) => {
        const { rootObj } = this
        const { libName } = lib
        if (!libName) throw new Error('Lib should have field libName')
        if (!libName.split) throw new Error('libName should be string')
        if (rootObj.libs[libName]) {
            rootObj.libs[libName] = lib
            return false
        } else {
            rootObj.libs[libName] = lib
            return true
        }
    }

    remove = (libOrName) => {
        const { rootObj } = this
        const libName = libOrName
        if (!libName.split) {
            libName = libName.libName
            if (!libName) throw new Error('Lib should have field libName')
        }
        if (rootObj.libs[libName]) {
            delete rootObj.libs[libName]
            return true
        }
        return false
    }

    libHash = () => {
        return MY_HASH
    }
}

module.exports = Libs
