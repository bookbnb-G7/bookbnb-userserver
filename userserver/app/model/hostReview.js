const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

/**
 * @swagger
 * definitions:
 *  HostReview:
 *    type: object
 *    properties:
 *      review:
 *        type: string
 *        required: true
 *        description: "The review of the host"
 *        example: He was a very good host.
 *      reviewer:
 *        type: string
 *        required: true
 *        description: "Name of the user who made the review"
 *        example: Barack Obama
 *      reviewer_id:
 *        type: integer
 *        required: true
 *        description: "Id of the user who made the review"
 *        example: 22
 */

const HostReview = database.define('host_reviews', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  review: { type: Sequelize.STRING(50), allowNull: false },
  reviewer: { type: Sequelize.STRING(50), allowNull: false },
  reviewer_id: { type: Sequelize.INTEGER, allowNull: false, validate: { notEmpty: true, isNumeric: true } },
})

// defines a foreign key 'userId'
HostReview.belongsTo(User);

module.exports = HostReview;

