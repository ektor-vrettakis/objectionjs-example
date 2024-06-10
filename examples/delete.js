const knex = require('../db/setup');
const Movie = require('../model/movie');

async function main() {
  // Delete all movies in which Morgan Freeman acted.
  const deletedCount = await Movie.query()
    .whereExists(Movie.relatedQuery('actors').findOne({ name: 'Morgan Freeman' }))
    .delete();
    // .returning('*'); // uncomment to return the deleted model instances instead
  console.log({ deletedCount });
}

main()
  .catch(err => console.error('Error:', err))
  .finally(() => knex.destroy());
