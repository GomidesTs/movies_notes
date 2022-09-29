const {
    Router
} = require('express')
const Movie_tagsController = require('../controllers/Movie_tagsController')
const movie_tagsRouter = new Router()
const movie_tagsController = new Movie_tagsController()

movie_tagsRouter.use('/:user_id', movie_tagsController.index)

module.exports = movie_tagsRouter