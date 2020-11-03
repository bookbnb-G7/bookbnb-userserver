const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

const GuestReview = database.define('guest_reviews', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  review: { type: Sequelize.STRING(50), allowNull: false },
  reviewer: { type: Sequelize.STRING(50), allowNull: false },
  reviewer_id: { type: Sequelize.STRING(50), allowNull: false },
})

// defines a foreign key 'userId'
GuestReview.belongsTo(User);

module.exports = GuestReview;

