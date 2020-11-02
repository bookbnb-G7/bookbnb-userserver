const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

const GuestRating = database.define('guest_ratings', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  rating: { type: Sequelize.INTEGER, allowNull: false, validate: { isInt: true, min: 1, max: 5 }},
  reviewer: { type: Sequelize.STRING(50), allowNull: false },
  reviewer_id: { type: Sequelize.STRING(50), allowNull: false },
})

// defines a foreign key 'userId'
GuestRating.belongsTo(User);

module.exports = GuestRating;

