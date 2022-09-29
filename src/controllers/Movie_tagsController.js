const knex = require('../database/knex')
class Movie_tagsController {
    async index(request, response) {
        const {
            user_id
        } = request.params

        const movie_tags = await knex('movie_tags')
            .where({
                user_id
            })
            .orderBy('name')

        return response.status(200).json({
            movie_tags
        })
    }
}

module.exports = Movie_tagsController