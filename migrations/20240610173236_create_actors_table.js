exports.up = function(knex) {
  return knex.schema.createTable('actors', function(table) {
    table.increments('id')
      .primary();
    table.string('name')
      .notNullable();
    table.unique('name');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('actors');
};
