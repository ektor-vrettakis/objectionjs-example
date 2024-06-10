const BaseModel = require('./base-model');

class Movie extends BaseModel {
  static tableName = 'movies';

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'releaseYear', 'directorId'],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        releaseYear: { type: 'integer' },
        directorId: { type: 'integer' },
        ...super.jsonSchema.properties
      }
    };
  }

  static get relationMappings() {
    const Actor = require('./actor');
    const Director = require('./director');
    const Genre = require('./genre');
    const Review = require('./review');
    return {
      actors: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Actor,
        join: {
          from: `${Movie.tableName}.id`,
          through: {
            from: 'actor_movie.movieId',
            to: 'actor_movie.actorId'
          },
          to: `${Actor.tableName}.id`
        }
      },
      director: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Director,
        join: {
          from: `${Movie.tableName}.directorId`,
          to: `${Director.tableName}.id`
        }
      },
      genres: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Genre,
        join: {
          from: `${Movie.tableName}.id`,
          through: {
            from: 'movie_genre.movieId',
            to: 'movie_genre.genreId'
          },
          to: `${Genre.tableName}.id`
        }
      },
      reviews: {
        relation: BaseModel.HasManyRelation,
        modelClass: Review,
        join: {
          from: `${Movie.tableName}.id`,
          to: `${Review.tableName}.movieId`
        }
      }
    };
  }
}

module.exports = Movie;
