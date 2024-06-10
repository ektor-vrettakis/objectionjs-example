const knex = require('../db/setup');
const Movie = require('../model/movie');

async function main() {
  const allMovies =
    await Movie.query();
  console.log({ allMovies });

  const movieById = await Movie.query()
    .findById(1);
  console.log({ movieById });

  const relativelyNewMovies =
    await Movie.query()
      .where('releaseYear', '>', 2000)
      .orderBy('releaseYear', 'asc');
  console.log({ relativelyNewMovies });

  const ninetiesMovies =
    await Movie.query()
      .whereBetween('releaseYear', [1990, 1999])
      .orderBy('releaseYear', 'desc');
  console.log({ ninetiesMovies });

  const spielbergMovies = await Movie.query()
    .joinRelated('director')
    .where('director.name', 'ILIKE', '\%spielberg\%');

  const nolanMovies = await Movie.query()
    .withGraphJoined('director', { joinOperation: 'innerJoin' })
    .modifyGraph('director', b => b.where('name', '~', 'Nolan'))
  console.log({ spielbergMovies, nolanMovies });


  const jurassicPark =
    spielbergMovies.find(({ title }) => title === 'Jurassic Park');

  const topReview = await jurassicPark
    .$relatedQuery('reviews')
    .max('rating');

  const averageRating = await Movie.relatedQuery('reviews')
    .for(jurassicPark.id)
    .avg({average: 'rating'});

  console.log({ topReview, averageRating });
}

main()
  .catch(err => console.error('Error:', err))
  .finally(() => knex.destroy());
