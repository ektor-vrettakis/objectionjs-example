const BaseModel = require('./base-model');

class Genre extends BaseModel {
  static tableName = 'genres';

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        ...super.jsonSchema.properties
      }
    };
  }

  static get relationMappings() {
    const Movie = require('./movie');
    return {
      movies: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Movie,
        join: {
          from: `${Genre.tableName}.id`,
          through: {
            from: 'movie_genre.genreId',
            to: 'movie_genre.movieId'
          },
          to: `${Movie.tableName}.id`
        }
      }
    };
  }
}

module.exports = Genre;
