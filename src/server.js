const letsencrypt = require('letsencrypt-express')
const express = require('express')
const evh = require('express-vhost')
const redirect = require('./redirect')

module.exports = function(options, apps) {
    const email = options.email
    const prod = options.prod

    const server = express()

    server.set('trust proxy', true)
    server.use(redirect)
    server.use(evh.vhost(server.enabled('trust proxy')))

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
        app: server
    })

    lex.listen(80, 443)
}
