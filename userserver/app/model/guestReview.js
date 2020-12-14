const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

/**
 * @swagger
 * definitions:
 *  GuestReview:
 *    type: object
 *    properties:
 *      review:
 *        type: string
 *        required: true
 *        description: "The review of the guest"
 *        example: He was a very good guest.
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

const GuestReview = database.define('guest_reviews', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  review: { type: Sequelize.STRING(50), allowNull: false },
  reviewer: { type: Sequelize.STRING(50), allowNull: false },
  reviewer_id: { type: Sequelize.INTEGER, allowNull: false, validate: { notEmpty: true, isNumeric: true } },
})

// defines a foreign key 'userId'
GuestReview.belongsTo(User);

module.exports = GuestReview;

