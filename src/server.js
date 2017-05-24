const letsencrypt = require('letsencrypt-express')
const express = require('express')
const evh = require('express-vhost')
const wwwRedirect = require('./wwwRedirect')
const compression = require('compression')

module.exports = function(options, apps) {
    const email = options.email
    const prod = options.prod
    const isCompression = options.compression || false
    const isWwwRedirect = options.wwwRedirect || false

    const httpsServer = express()
    httpsServer.set('trust proxy', true)

    if (isCompression) {
        httpsServer.use(compression())
    }
    if (isWwwRedirect) {
        httpsServer.use(wwwRedirect)
    }

    httpsServer.use(evh.vhost(httpsServer.enabled('trust proxy')))

    let approveDomains = []

    apps.forEach(ref => {
        const host = ref.host
        const aliases = ref.aliases || []
        const app = ref.app

        approveDomains.push(host)
        approveDomains = approveDomains.concat(aliases)

        evh.register(host, app)
    })

    const lex = letsencrypt.create({
        server: prod ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',
        email: email,
        agreeTos: true,
        approveDomains: approveDomains,
        app: httpsServer
    })

    lex.listen(80, 443)
}
