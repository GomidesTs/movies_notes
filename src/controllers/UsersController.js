const {
    hash,
    compare
} = require('bcryptjs')
const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class UsersController {
    async create(request, response) {
        const {
            name,
            email,
            password
        } = request.body

        const checkUserEmailExists = await knex('users').where('email', [email])

        if (checkUserEmailExists.length > 0) {
            throw new AppError('Email already exists', 403)
        }

        const hashedPassword = await hash(password, 8)

        await knex('users').insert({
            name,
            email,
            password: hashedPassword
        })
        return response.status(201).json()
    }

    async update(request, response) {
        const {
            id
        } = request.params

        const {
            name,
            email,
            password,
            old_password
        } = request.body

        const user = await knex('users').where('id', id)

        if (user.length == 0) {
            throw new AppError('User does not exists', 404)
        }

        if (email) {
            const userWithEmail = await knex('users').where('email', email)

            if (userWithEmail[0] && userWithEmail[0].id !== user[0].id) {
                throw new AppError('Email already in use', 403)
            }
        }

        user[0].name = name || user[0].name
        user[0].email = email || user[0].email

        if (password && !old_password) {
            throw new AppError('Old password not entered', 403)
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user[0].password)

            if (!checkOldPassword) {
                throw new AppError('Incorrect old password', 403)
            }

            user[0].password = await hash(password, 8)
        }

        await knex('users').where('id', id).update({
            name: user[0].name,
            email: user[0].email,
            password: user[0].password,

        })

        return response.status(202).json()
    }
}

module.exports = UsersController