exports.up = function(knex) {
  return knex.schema.createTable('actor_movie', function(table) {
    table.increments('id')
      .primary();
    table.integer('actorId')
      .unsigned();
    table.integer('movieId')
      .unsigned();
    table.foreign('actorId')
      .references('actors.id')
      .onDelete('CASCADE');
    table.foreign('movieId')
      .references('movies.id')
      .onDelete('CASCADE');
    table.unique(['actorId', 'movieId']);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('actor_movies');
};
