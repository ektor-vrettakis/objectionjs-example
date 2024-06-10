const knex = require('./setup');
const Movie = require('../model/movie');
const Actor = require('../model/actor');
const Director = require('../model/director');
const Genre = require('../model/genre');
const Review = require('../model/review');

async function seedDatabase() {
  const trx = await Movie.startTransaction();

  const reducer = (acc, { id, ...rest }) => {
    // Strip '.', '-' and spaces
    const strippedName = (rest.name || rest.title).replace(/[:.\-\s]/g, '');
    // Capitalize first letter of each word
    const transformedName = strippedName.replace(/\b\w/g, c => c.toUpperCase());
    return { ...acc, [transformedName]: id }
  };

  try {
    // Create genres.
    const genres = await Genre.query(trx).insert([
      { name: 'Drama' },
      { name: 'Comedy' },
      { name: 'Action' },
      { name: 'Sci-Fi' },
      { name: 'Adventure' },
      { name: 'Thriller' }
    ]);
    const Genres = genres.reduce(reducer, {});

    // Create directors.
    const directors = await Director.query(trx).insertGraph([
      { name: 'Frank Darabont' },
      { name: 'Francis Ford Coppola' },
      { name: 'Robert Zemeckis' },
      { name: 'Christopher Nolan' },
      { name: 'Steven Spielberg' },
      { name: 'James Cameron' },
      { name: 'John McTiernan' },
      { name: 'Quentin Tarantino' },
      { name: 'Martin Scorsese' },
      { name: 'Peter Jackson' },
      { name: 'Ridley Scott' },
      { name: 'Lana Wachowski' },
      { name: 'Jon Favreau' }
    ]);
    const Directors = directors.reduce(reducer, {});

    // Create actors.
    const actors = await Actor.query(trx).insert([
      { name: 'Tim Robbins' },
      { name: 'Marlon Brando' },
      { name: 'Tom Hanks' },
      { name: 'Leonardo DiCaprio' },
      { name: 'Sam Neill' },
      { name: 'Arnold Schwarzenegger' },
      { name: 'Bruce Willis' },
      { name: 'Keanu Reeves' },
      { name: 'Robert Downey Jr.' },
      { name: 'Harrison Ford' },
      { name: 'Christian Bale' },
      { name: 'Michael Caine' },
      { name: 'Morgan Freeman' },
      { name: 'Samuel Jackson' },
      { name: 'Wayne Knight' }
    ]);
    const Actors = actors.reduce(reducer, {});

    // Create movies.
    const movies = await Movie.query(trx).insertGraph([
      {
        title: 'The Shawshank Redemption',
        releaseYear: 1994,
        directorId: Directors.FrankDarabont,
        actors: [{ '#dbRef': Actors.TimRobbins }, { '#dbRef': Actors.MorganFreeman }],
        genres: [{ '#dbRef': Genres.Drama }]
      },
      {
        title: 'The Godfather',
        releaseYear: 1972,
        directorId: Directors.FrancisFordCoppola,
        actors: [{ '#dbRef': Actors.MarlonBrando }],
        genres: [{ '#dbRef': Genres.Drama }]
      },
      {
        title: 'Forrest Gump',
        releaseYear: 1994,
        directorId: Directors.RobertZemeckis,
        actors: [{ '#dbRef': Actors.TomHanks }],
        genres: [{ '#dbRef': Genres.Drama }, { '#dbRef': Genres.Comedy }]
      },
      {
        title: 'Inception',
        releaseYear: 2010,
        directorId: Directors.ChristopherNolan,
        actors: [{ '#dbRef': Actors.LeonardoDiCaprio }, { '#dbRef': Actors.MichaelCaine }, { '#dbRef': Actors.MorganFreeman }],
        genres: [{ '#dbRef': Genres.SciFi }, { '#dbRef': Genres.Action }]
      },
      {
        title: 'Jurassic Park',
        releaseYear: 1993,
        directorId: Directors.StevenSpielberg,
        actors: [{ '#dbRef': Actors.SamNeill }, { '#dbRef': Actors.SamuelJackson }, { '#dbRef': Actors.WayneKnight }],
        genres: [{ '#dbRef': Genres.SciFi }, { '#dbRef': Genres.Adventure }]
      },
      {
        title: 'Terminator 2: Judgment Day',
        releaseYear: 1991,
        directorId: Directors.JamesCameron,
        actors: [{ '#dbRef': Actors.ArnoldSchwarzenegger }],
        genres: [{ '#dbRef': Genres.SciFi }, { '#dbRef': Genres.Action }]
      },
      {
        title: 'Die Hard',
        releaseYear: 1988,
        directorId: Directors.JohnMcTiernan,
        actors: [{ '#dbRef': Actors.BruceWillis }],
        genres: [{ '#dbRef': Genres.Action }, { '#dbRef': Genres.Thriller }]
      },
      {
        title: 'The Matrix',
        releaseYear: 1999,
        directorId: Directors.LanaWachowski,
        actors: [{ '#dbRef': Actors.KeanuReeves }, { '#dbRef': Actors.SamuelJackson }, { '#dbRef': Actors.WayneKnight }],
        genres: [{ '#dbRef': Genres.SciFi }, { '#dbRef': Genres.Action }]
      },
      {
        title: 'Iron Man',
        releaseYear: 2008,
        directorId: Directors.JonFavreau,
        actors: [{ '#dbRef': Actors.RobertDowneyJr }],
        genres: [{ '#dbRef': Genres.SciFi }, { '#dbRef': Genres.Action }]
      },
      {
        title: 'Indiana Jones and the Raiders of the Lost Ark',
        releaseYear: 1981,
        directorId: Directors.StevenSpielberg,
        actors: [{ '#dbRef': Actors.HarrisonFord }],
        genres: [{ '#dbRef': Genres.Action }, { '#dbRef': Genres.Adventure }]
      },
      {
        title: 'The Dark Knight',
        releaseYear: 2008,
        directorId: Directors.ChristopherNolan,
        actors: [{ '#dbRef': Actors.ChristianBale }, { '#dbRef': Actors.MichaelCaine }, { '#dbRef': Actors.MorganFreeman }, { '#dbRef': Actors.TimRobbins }],
        genres: [{ '#dbRef': Genres.Action }, { '#dbRef': Genres.Drama }]
      }
    ], {
      relate: ['actors', 'genres']
    });
    const Movies = movies.reduce(reducer, {});

    // Create reviews.
    await Review.query(trx).insert([
      { content: 'A masterpiece!', rating: 5, movieId: Movies.TheShawshankRedemption },
      { content: 'Brilliant storytelling.', rating: 5, movieId: Movies.TheGodfather },
      { content: 'Heartwarming and inspiring.', rating: 4, movieId: Movies.ForrestGump },
      { content: 'Mind-bending!', rating: 5, movieId: Movies.Inception },
      { content: 'Just another movie with large lizards', rating: 1, movieId: Movies.JurassicPark },
      { content: 'Exciting adventure!', rating: 4, movieId: Movies.JurassicPark },
      { content: 'Best adventure ever!', rating: 5, movieId: Movies.JurassicPark },
      { content: 'Iconic sci-fi action!', rating: 5, movieId: Movies.Terminator2JudgmentDay },
      { content: 'Classic action thriller!', rating: 4, movieId: Movies.DieHard },
      { content: 'Revolutionary sci-fi!', rating: 5, movieId: Movies.TheMatrix },
      { content: 'Superhero blockbuster!', rating: 4, movieId: Movies.IronMan },
      { content: 'Iconic adventure!', rating: 5, movieId: Movies.IndianaJonesandtheRaidersoftheLostArk },
      { content: 'Gripping action drama!', rating: 5, movieId: Movies.TheDarkKnight }
    ]);

    // Commit the transaction.
    await trx.commit();
    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error:', err);
    // Rollback the transaction in case of any error.
    await trx.rollback();
  } finally {
    // Destroy the knex instance to close the database connection.
    await knex.destroy();
  }
}

seedDatabase().catch(err => console.error('Error:', err));
