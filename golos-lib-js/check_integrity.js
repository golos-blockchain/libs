const fs = require('fs')
const { hashElement } = require('folder-hash')

async function main() {
    try {
        const hashOut = './lib/my_hash.js'

        const path = '../golos-lib-js'
        const res = await hashElement(path, {
            files: {
                exclude: [
                    path + '/lib/my_hash.js',
                    path + '/dist/golos.min.js.gz',
                    path + '/dist/golos-tests.min.js.gz',
                    path + '/dist/stats.html',
                    // These not including when NPM publishes
                    '.npmrc',
                    '.babelrc',
                    '.gitignore',
                    '.npmignore',
                    'yarn.lock',
                ],
                matchBasename: true,
                matchPath: true,
            },
            folders: {
                exclude: [
                    path + '/node_modules',
                    path + '/src',
                    path + '/examples'
                ],
                matchPath: true,
                ignoreRootName: true
            }
        })

        console.log(res.children)

        let code = fs.readFileSync(hashOut, 'utf8')
        code = code.replace('NO_HASH', res.hash)
        fs.writeFileSync(hashOut, code)

        console.log('LIBRARY HASH IS', res.hash)
    } catch (err) {
        console.error('LIBRARY HASH FAILED:', err)
    }
}

main()
