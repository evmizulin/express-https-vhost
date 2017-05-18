const letsencrypt = require('letsencrypt-express')
const express = require('express')
const evh = require('express-vhost')
const redirect = require('./src/redirect')

const server = express()

server.set('trust proxy', true)
server.use(redirect)
server.use(evh.vhost(server.enabled('trust proxy')))

const appOne = express()
const appTwo = express()

appOne.use('/', (req, res) => res.status(200).send('i am app one'))
appTwo.use('/', (req, res) => res.status(200).send('i am app two'))

evh.register('photo-mosaic.ru', appOne)
evh.register('api.photo-mosaic.ru', appTwo)

server.listen(80)

// const lex = letsencrypt.create({
//     server: prod ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',
//     email: email,
//     agreeTos: true,
//     approveDomains: apps.map(item => item.host),
//     app: server
// })
//
// lex.listen(80, 443)
