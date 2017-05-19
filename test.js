const express = require('express')
const server = require('./index')

const appOne = express()
const appTwo = express()

appOne.use('/', (req, res) => {
    res.status(200).send('i am app one')
})

appTwo.use('/', (req, res) => {
    res.status(200).send('i am app two')
})

server(
    {
        email: 'evgeny.mizulin@gmail.com',
        prod: false
    },
    [
        {
            host: 'photo-mosaic.ru',
            app: appOne,
            aliases: ['www.photo-mosaic.ru']
        },
        {
            host: 'api.photo-mosaic.ru',
            app: appTwo
        }
    ]
)
