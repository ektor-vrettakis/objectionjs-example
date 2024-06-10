const knex = require('./db/setup');
const Movie = require('./model/movie');
const Director = require('./model/director');
const Genre = require('./model/genre');
const {raw} = require("objection");
const Actor = require("./model/actor");

async function driver() {
  // Start a transaction.
  const trx = await Movie.startTransaction();

  try {
    // Create a new director.
    const newDirector = await Director.query(trx)
      .insert({ name: 'Sidney Lumet' });
    console.log('New Director:', newDirector);

    const genres = await Genre.query(trx);
    const createOrRelateGenre = (name) => ({
      id: genres.find(g => g.name === name)?.id,
      name
    });

    const newMovies = await Movie.query(trx)
      .where('releaseYear', '>=', 2000)
    console.log({ newMovies })

    const famousActors = await Actor.query(trx)
      .joinRelated('movies')
      .groupBy('actors.id')
      .having(raw('count(*) > ?', 2))
      .select('actors.*');
    console.log({ famousActors });

    // discuss some on implementations of graph fetched
    // join vs 2 queries
    const moviesWithActors = await Actor.query(trx)
      .withGraphFetched('movies');
    for(const movieWithActors of moviesWithActors)
      console.log({ movieWithActors });

    const activeActorsWithMovies = await Actor.query(trx)
      .withGraphJoined('movies', { joinOperation: 'innerJoin' })
      .modifyGraph('movies', builder => {
        builder.where('movies.releaseYear', '>=', 2010);
      });
    console.log({ activeActorsWithMovies });

    // Create a new movie.
    const newMovie = await Movie.query(trx).upsertGraph({
      title: '12 Angry Men',
      releaseYear: 1957,
      director: { name: 'Sidney Lumet' },
      genres: ['Drama', 'Crime'].map(createOrRelateGenre)
    }, {
      relate: ['genres']
    });
    await newMovie.$fetchGraph('genres', {
      transaction: trx, skipFetched: true
    });
    console.log('New Movie:', newMovie);

    const updatedMovie = await newMovie.$query(trx)
      .patchAndFetch({ title: newMovie.title + '!' });
    console.log('Updated Movie:', updatedMovie);

    // Delete a movie.
    const deletedCount = await Movie.query(trx)
      .deleteById(newMovie.id);
    console.log(`Deleted ${deletedCount} movies!`);

    await trx.commit();
  } catch (err) {
    console.error('Error:', err);
    await trx.rollback();
    throw err;
  }
}

driver()
  .catch(err => console.error('Error:', err))
  .finally(() => knex.destroy());
