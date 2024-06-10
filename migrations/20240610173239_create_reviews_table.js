exports.up = function(knex) {
  return knex.schema.createTable('reviews', function(table) {
    table.increments('id')
      .primary();
    table.text('content')
      .notNullable();
    table.integer('rating')
      .notNullable();
    table.integer('movieId')
      .unsigned();
    table.foreign('movieId')
      .references('movies.id')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reviews');
};
