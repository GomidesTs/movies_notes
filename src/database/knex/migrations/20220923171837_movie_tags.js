exports.up = knex => knex.schema.createTable('movie_tags', table => {
    table.increments('id').primary().unsigned()
    table.integer('note_id').references('id').inTable('movies_notes').onDelete('cascade')
    table.integer('user_id').references('id').inTable('users')
    table.text('name')
})

exports.down = knex => knex.schema.dropTable('movie_tags')