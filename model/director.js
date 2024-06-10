const BaseModel = require('./base-model');

class Director extends BaseModel {
  static tableName = 'directors';

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
        relation: BaseModel.HasManyRelation,
        modelClass: Movie,
        join: {
          from: `${Director.tableName}.id`,
          to: `${Movie.tableName}.directorId`
        }
      }
    };
  }
}

module.exports = Director;
