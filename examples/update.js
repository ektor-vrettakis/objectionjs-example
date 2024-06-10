const knex = require('../db/setup');
const Genre = require('../model/genre');
const Movie = require('../model/movie');
const Director = require('../model/director');

async function main() {
  const oldTitle = 'The Godfather';
  const newTitle = 'The Godfather Part 2';
  let theGodfather2 = await Movie.query()
    .where({ title: oldTitle })
    .patch({ title: newTitle, releaseYear: 1974 })
    .returning('*').first(); // without this statement, the query will return the number of affected rows
  if (!theGodfather2)
    theGodfather2 = await Movie.query()
      .findOne({ title: newTitle })

  const newMovies = await Movie.query()
    .where('releaseYear', '>', 2000)
    .patch({ note: 'kind-of-new' })
    .returning('*');

  console.log({ theGodfather2, newMovies });

  const newGenres= await Genre.query()
    .select('id')
    .whereIn('name', ['Action', 'Adventure'])
  await theGodfather2.$relatedQuery('genres')
    .relate(newGenres.map(g => g.id))
    .onConflict()
    .ignore();

  await theGodfather2.$relatedQuery('genres')
    .findOne({ name: 'Drama' }).unrelate();

  const { genres } = await Movie.query()
    .findById(theGodfather2.id)
    .withGraphFetched('genres');
  console.log({ genres });

  // relate the God father part 2 with Frank Darabont
  const strangeGodfather = await theGodfather2.$query()
    .patch({
      directorId: Director.query()
        .select('id')
        .findOne({ name: 'Frank Darabont' })
    })
    .withGraphFetched('director')
    .returning('*')
    .first();
  console.log({ strangeGodfather });
}

main()
  .catch(err => console.error('Error:', err))
  .finally(() => knex.destroy());
