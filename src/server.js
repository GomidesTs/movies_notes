require('express-async-errors')

const express = require('express')
const AppError = require('./utils/AppError')
const databaseRun = require('./database/sqlite')
const app = express()

const PORT = 3000

databaseRun()

app.use(express.json())
app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }

    console.error(error)

    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    })
})

app.listen(PORT, () => console.log(`Listen on ${PORT}`))