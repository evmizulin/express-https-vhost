const letsencrypt = require('letsencrypt-express')
const express = require('express')
const evh = require('express-vhost')
const http = require('http')
const https = require('https')
const redirect = require('redirect-https')()

module.exports = function(options) {
    const email = options.email
    const prod = options.prod

    return (apps) => {
        const server = express()

        server.use(evh.vhost(server.enabled('trust proxy')))

        apps.forEach(ref => {
            const host = ref.host
            const app = ref.app

            evh.register(host, app)
        })

        const lex = letsencrypt.create({
            server: prod ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',
            email: email,
            agreeTos: true,
            approveDomains: apps.map(item => item.host)
        })

        http.createServer(lex.middleware(redirect)).listen(80)
        https.createServer(lex.httpsOptions, lex.middleware(server)).listen(443)
    }
}
