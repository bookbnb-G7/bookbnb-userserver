const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

const HostRating = database.define('host_ratings', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  rating: { type: Sequelize.INTEGER, allowNull: false , validate: { isInt: true, min: 1, max: 5 }},
  reviewer: { type: Sequelize.STRING(50), allowNull: false },
  reviewer_id: { type: Sequelize.STRING(50), allowNull: false },
})

// defines a foreign key 'userId'
HostRating.belongsTo(User);

module.exports = HostRating;

