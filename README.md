# express-https-vhost

## usage
```
const express = require('express')
const server = require('express-https-vhost')({
    email: 'some@email.com',
    prod: true
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
        host: 'domain.com',
        app: appOne
    },
    {
        host: 'api.domain.com',
        app: appTwo
    },
])
```
