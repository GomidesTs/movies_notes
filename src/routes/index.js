const {
    Router
} = require('express')

const usersRouter = require('./users.routes')
const movie_notes = require('./movie_notes.routes')
const routes = new Router()

routes.use('/users', usersRouter)
routes.use('/movie_notes', movie_notes)

module.exports = routes