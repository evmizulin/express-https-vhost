const letsencrypt = require('letsencrypt-express')
const express = require('express')
const evh = require('express-vhost')
const wwwRedirect = require('./wwwRedirect')
const httpRedirect = require('./httpRedirect')

module.exports = function(options, apps) {
    const email = options.email
    const prod = options.prod

    const httpServer = express()
    const httpsServer = express()

    httpServer.set('trust proxy', true)
    httpServer.use(httpRedirect)

    httpsServer.set('trust proxy', true)
    httpsServer.use(wwwRedirect)
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

    lex.listen([], [443])
    httpServer.listen(80)
}
