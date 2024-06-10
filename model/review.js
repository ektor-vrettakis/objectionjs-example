const BaseModel = require('./base-model');

class Review extends BaseModel {
  static tableName = 'reviews';

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['content', 'rating', 'movieId'],
      properties: {
        id: {type: 'integer'},
        content: {type: 'string'},
        rating: {type: 'integer'},
        movieId: {type: 'integer'},
        ...super.jsonSchema.properties
      }
    };
  }

  static get relationMappings() {
    const Movie = require('./movie');
    return {
      reviews: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Movie,
        join: {
          from: `${Review.tableName}.movieId`,
          to: `${Movie.tableName}.id`
        }
      }
    }
  }
}

module.exports = Review;
