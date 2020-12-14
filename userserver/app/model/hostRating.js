const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

/**
 * @swagger
 * definitions:
 *  HostRating:
 *    type: object
 *    properties:
 *      rating:
 *        type: integer
 *        minimum: 1.0
 *        maximum: 5.0
 *        required: true
 *        description: "Rating of the host (1-5)"
 *        example: 5
 *      reviewer:
 *        type: string
 *        required: true
 *        description: "Name of the user who made the rating"
 *        example: Barack Obama
 *      reviewer_id:
 *        type: integer
 *        required: true
 *        description: "Id of the user who made the rating"
 *        example: 22
 */

const HostRating = database.define('host_ratings', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  rating: { type: Sequelize.INTEGER, allowNull: false , validate: { isInt: true, min: 1, max: 5 }},
  reviewer: { type: Sequelize.STRING(50), allowNull: false },
  reviewer_id: { type: Sequelize.INTEGER, allowNull: false },
})

// defines a foreign key 'userId'
HostRating.belongsTo(User);

module.exports = HostRating;

