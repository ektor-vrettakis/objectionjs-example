const knex = require('../db/setup');
const Actor = require('../model/actor');
const Movie = require('../model/movie');
const Director = require('../model/director');

async function main() {
  let name = 'Al Pacino';
  let pacino;
  try {
    pacino = await Actor.query()
      .insert({name});
  } catch (e) {
    if (e.constraint !== 'actors_name_unique')
      throw e;
    console.log(`actor with name=${name} already exists.`)
    pacino = await Actor.query()
      .findOne({name: 'Al Pacino'});
  }
  console.log({ pacino });

  const theGodfather = await Movie.query()
    .findOne({ title: 'The Godfather'})
  // Relate Al Pacino with the Godfather movie
  try {
    await pacino.$relatedQuery('movies').relate(theGodfather.id);
  } catch (e) {
    if (e.constraint !== 'actor_movie_actorid_movieid_unique')
      throw e;
    console.log(`actor with id=${pacino.id} is already related to the movie with id=${theGodfather.id}.`)
  }

  const { actors: theGodfatherActors } = await Movie.query()
    .findOne({ title: 'The Godfather'})
    .withGraphFetched('actors');
  console.log({ theGodfatherActors });

  name = 'John Cazale';
  let johnCazale;
  try {
    // insert & relate John Cazale with the Godfather movie
    johnCazale = await theGodfather.$relatedQuery('actors')
      .insert({ name });
  } catch (e) {
    if (e.constraint !== 'actors_name_unique')
      throw e;
    console.log(`actor with name=${name} already exists.`)
      // relate John Cazale with the Godfather movie
    johnCazale = await Actor.query()
      .findOne({ name })
      .relate(theGodfather.id);
  }

  await theGodfather.$fetchGraph('actors');
  console.log({ johnCazale, updatedActors: theGodfather.actors });


  // const [tarantino, jackson] = await Promise.all([
  //   Director.query().findOne('name', '~', 'Tarantino'),
  //   Actor.query().findOne('name', '~', 'Jackson')
  // ]);
  //
  // const { actors, ...rest } = await Movie.query().insertGraph({
  //   title: 'Pulp Fiction',
  //   releaseYear: 1994,
  //   directorId: tarantino.id,
  //   actors: [
  //     { id: jackson.id },  // related instead of inserted
  //     { name: 'Uma Thurman' },
  //     { name: 'John Travolta' }
  //   ]
  // }, {
  //   relate: ['actors']
  // });
  // console.log({ ...rest, actors });
  //
  // await jackson.$fetchGraph('movies');
  // console.log('Samuel Jackson movies:', jackson.movies);
}

main()
  .catch(err => console.error('Error:', err))
  .finally(() => knex.destroy());
