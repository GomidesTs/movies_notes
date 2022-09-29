const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class Movie_notesController {
    async create(request, response) {
        const {
            user_id
        } = request.params
        const {
            title,
            description,
            rating,
            tags
        } = request.body

        const movieExists = await knex('movie_notes')
            .where({
                title
            })

        if (movieExists.length > 0) {
            throw new AppError("Film already registered", 401)
        }

        const note_id = await knex('movie_notes')
            .insert({
                title,
                description,
                rating,
                user_id
            })

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        })

        await knex('movie_tags').insert(tagsInsert)

        return response.status(201).json()
    }

    async show(request, response) {
        const {
            id
        } = request.params

        const movie_note = await knex('movie_notes')
            .where({
                id
            })
            .first()
        const movie_tags = await knex('movie_tags')
            .where({
                note_id: id
            })
            .orderBy('name')

        response.status(200).json({
            ...movie_note,
            movie_tags
        })
    }

    async delete(request, response) {
        const {
            id
        } = request.params

        await knex('movie_notes')
            .where({
                id
            })
            .delete()

        return response.status(200).json({
            success: true
        })
    }

    async index(request, response) {
        const {
            title,
            rating,
            tags,
            user_id,
        } = request.query

        let movie_notes

        if (tags) {
            const filterTags = tags.split(',').map(tag => tag.trim())


            movie_notes = await knex('movie_tags')
                .select([
                    'movie_notes.id',
                    'movie_notes.title',
                    'movie_notes.user_id'
                ])
                .where('movie_notes.user_id', user_id)
                .whereLike('movie_notes.title', `%${title}%`)
                .whereIn('name', filterTags)
                .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
                .orderBy('movie_notes.title')
        } else {
            movie_notes = await knex('movie_notes')
                .where({
                    user_id
                })
                .whereLike('title', `%${title}%`)
                .orderBy('title')
        }

        const movie_tags = await knex('movie_tags')
            .where({
                user_id
            })
           
        const movieNotesWithTags = movie_notes.map(note => {
            const noteTags = movie_tags.filter(tag => tag.note_id === note.id)

            return {
                ...note,
                movie_tags: noteTags
            }
        })



        return response.status(200).json({
            movieNotesWithTags
        })
    }
}

module.exports = Movie_notesController