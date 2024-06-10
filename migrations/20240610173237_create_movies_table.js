exports.up = function(knex) {
  return knex.schema.createTable('movies', function(table) {
    table.increments('id')
      .primary();
    table.string('title')
      .notNullable();
    table.string('note')
      .defaultTo(null);
    table.integer('releaseYear')
      .notNullable();
    table.integer('directorId')
      .unsigned();
    table.foreign('directorId')
      .references('directors.id')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('movies');
};
