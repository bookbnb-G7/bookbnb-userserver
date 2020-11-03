const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

const HostReview = database.define('host_reviews', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  review: { type: Sequelize.STRING(50), allowNull: false },
  reviewer: { type: Sequelize.STRING(50), allowNull: false },
  reviewer_id: { type: Sequelize.STRING(50), allowNull: false },
})

// defines a foreign key 'userId'
HostReview.belongsTo(User);

module.exports = HostReview;

