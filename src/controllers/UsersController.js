const {
    hash,
    compare
} = require('bcryptjs')
const AppError = require('../utils/AppError')
const databaseConnection = require('../database/sqlite')

class UsersController {
    async create(request, response) {
        const {
            name,
            email,
            password
        } = request.body

        const database = await databaseConnection()
        const checkUserEmailExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if (checkUserEmailExists) {
            throw new AppError('Email already exists', 403)
        }

        const hashedPassword = await hash(password, 8)

        await database.run('INSERT INTO users (name, email, password) VALUES(?,?,?)', [name, email, hashedPassword])
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

        const database = await databaseConnection()
        const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])

        if (!user) {
            throw new AppError('User does not exists', 404)
        }

        const userWithEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if (userWithEmail && userWithEmail.id !== user.id) {
            throw new AppError('Email already in use', 403)
        }

        user.name = name || user.name
        user.email = email || user.email

        if (password && !old_password) {
            throw new AppError('Old password not entered', 403)
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if (!checkOldPassword) {
                throw new AppError('Incorrect old password', 403)
            }

            user.password = await hash(password, 8)
        }

        await database.run('UPDATE users SET name = (?), email = (?), password = (?), updated_at = DATETIME("now") WHERE id = (?)', [user.name, user.email, user.password, id])

        return response.status(202).json()
    }
}

module.exports = UsersController