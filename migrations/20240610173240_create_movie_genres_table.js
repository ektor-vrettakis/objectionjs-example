exports.up = function(knex) {
  return knex.schema.createTable('movie_genre', function(table) {
    table.increments('id')
      .primary();
    table.integer('movieId')
      .unsigned();
    table.integer('genreId')
      .unsigned();
    table.foreign('movieId')
      .references('movies.id')
      .onDelete('CASCADE');
    table.foreign('genreId')
      .references('genres.id')
      .onDelete('CASCADE');
    table.unique(['movieId', 'genreId']);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('movie_genres');
};
