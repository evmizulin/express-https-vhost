module.exports = (req, res, next) => {
    if (req.protocol === 'http') {
        return res.redirect(301, 'https://' + req.headers.host + req.originalUrl)
    }
    next()
}
