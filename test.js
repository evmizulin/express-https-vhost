const express = require('express')
const server = require('./index')({
    email: 'some@email.com',
    prod: false
})

const appOne = express()
const appTwo = express()

appOne.get('*', (req, res) => {
    res.status(200).send('i am app one')
})

appTwo.get('*', (req, res) => {
    res.status(200).send('i am app two')
})

server([
    {
        host: 'photo-mosaic.ru',
        app: appOne
    },
    {
        host: 'api.photo-mosaic.ru',
        app: appTwo
    },
])