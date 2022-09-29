const {
    Router
} = require('express')

const usersRouter = require('./users.routes')
const movie_notes = require('./movie_notes.routes')
const movie_tags = require('./movie_tags.routes')
const routes = new Router()

routes.use('/users', usersRouter)
routes.use('/movie_notes', movie_notes)
routes.use('/movie_tags', movie_tags)

module.exports = routes