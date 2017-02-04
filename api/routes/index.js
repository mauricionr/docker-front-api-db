const Router = require('express').Router()

Router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD")
    next();
});

Router.use('/auth', require('./auth'))
Router.use('/users', require('./users'))

module.exports = Router;