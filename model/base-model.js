const { Model } = require("objection");

class BaseModel extends Model {
  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  $beforeInsert(queryContext) {
    if (!this.updatedAt)
      this.updatedAt = new Date();
    if (!this.createdAt)
      this.createdAt = new Date();
    return super.$beforeInsert(queryContext);
  }

  $beforeUpdate(options, queryContext) {
    this.updatedAt = new Date();
    return super.$beforeUpdate(options, queryContext);
  }
}

module.exports = BaseModel;
