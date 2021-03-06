const ENV           = process.env.ENV || process.env.NODE_ENV || "development";
const knexConfig    = require("../knexfile");
const k             = require("knex")(knexConfig[ENV]);


function database() {
  this.knex = k;
}

database.prototype.delRow = function (query, callback) {
  this.knex(query.table)
    .where(query.data)
    .del()
    .asCallback(callback);
}

database.prototype.insertRow = function (query, callback) {
  this.knex(query.table)
    .insert(query.data)
    .returning("*") //makes it so callback will have data which = the inserted row as an array on sucess
    .asCallback(callback);
}

database.prototype.getRow = function (query, callback) {
  this.knex(query.table)
    .where(query.data)
    .asCallback(callback);
}

database.prototype.getAll = function (query, callback) {
  this.knex
    .select()
    .table(query.table)
    .asCallback(callback);
}
database.prototype.updateRow = function (query, callback) {
  this.knex(query.table)
    .where("id", query.data.id)
    .update(query.data)
    .asCallback(callback);
}

database.prototype.updateTable = function (query, callback) {
  this.knex(query.table)
    .update(query.data)
    .asCallback(callback);
}

database.prototype.getAllWhere = function (query, callback) {
  this.knex
    .select()
    .table(query.table)
    .where(query.data)
    .asCallback(callback);
}
database.prototype.getGoalsWithTasks = function(query, callback) {
  //queries database for all goals and joins their respective
  // tasks to the goal as an array of JSON objects
  // contained in a property named 'tasks' for a goal

  this.knex('goals')
  .select([
    'goals.*',
    this.knex.raw("JSON_AGG(JSON_BUILD_OBJECT('id',tasks.id, 'name', tasks.name, 'is_done', tasks.is_done) order by tasks.id) as tasks")
  ])
  .where(query.data)
  .innerJoin('tasks','goals.id','tasks.goal_id')
  .groupBy('goals.id')
  .orderBy("goals.id", "desc")
  .asCallback(callback)
}
module.exports = new database();
