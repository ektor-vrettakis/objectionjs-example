const Knex = require('knex');
const { Model, knexSnakeCaseMappers } = require('objection');
const knexConfig = require('./knexfile');

// initialize knex
const knex = Knex({
  ...knexConfig.development,
  debug: !!process.env.LOG_VERBOSE,
  asyncStackTraces: true,
  ...knexSnakeCaseMappers()
});

// bind all models to the knex instance
Model.knex(knex);

module.exports = knex;
