# express-https-vhost

## usage
```
const express = require('express')
const server = require('express-https-vhost')

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
        email: 'myemail@mail.com',
        // flag switching between production and staging servers of letsencript
        // use "prod: false" first. 
        // Read more https://www.npmjs.com/package/letsencrypt-express#why-you-must-use-staging-first
        prod: false
    },
    [
        {
            host: 'site.com',
            app: appOne,
            aliases: ['www.site.com']
        },
        {
            host: 'api.site.com',
            app: appTwo
        }
    ]
)
```
