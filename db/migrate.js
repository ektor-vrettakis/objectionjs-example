const knex = require('./setup');

knex.migrate.latest()
  .then(() => console.log('Migrations have been executed successfully.'))
  .catch(err => console.error('Error executing migrations:', err))
  .finally(() => knex.destroy());
