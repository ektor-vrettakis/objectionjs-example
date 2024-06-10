const BaseModel = require('./base-model');

class Actor extends BaseModel {
  static tableName = 'actors';

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
          from: `${Actor.tableName}.id`,
          through: {
            from: 'actor_movie.actorId',
            to: 'actor_movie.movieId'
          },
          to: `${Movie.tableName}.id`
        }
      }
    };
  }
}

module.exports = Actor;
