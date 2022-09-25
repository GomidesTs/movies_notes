const {
    Router
} = require('express')

const usersRouter = require('./users.routes')
const routes = new Router()

routes.use('/users', usersRouter)

module.exports = routes