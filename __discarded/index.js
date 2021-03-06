'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
// var env = app.get('env') == 'development' ? 'dev' : app.get('env');
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

// Decide which database to use
if (config.use_env_variable) {
  // A production envionment database (remote)
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  // or a local database
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
