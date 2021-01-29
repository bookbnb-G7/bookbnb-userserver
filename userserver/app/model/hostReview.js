const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

/**
 * @swagger
 * definitions:
 *  HostReviewPayload:
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
 *  HostReview:
 *    allOf:
 *      - $ref: "#/definitions/HostReviewPayload"
 *      - type: object
 *        properties:
 *          id:
 *            type: integer
 *            required: true
 *            example: 1
 *          userId:
 *            type: integer
 *            required: true
 *            example: 1
 *          createdAt:
 *            type: string
 *            format: datetime
 *            example: "2020-11-10T22:51:03.539Z"
 *          updatedAt:
 *            type: string
 *            format: datetime
 *            example: "2020-11-10T22:51:03.539Z"
 */

const HostReview = database.define('host_reviews', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  review: { type: Sequelize.STRING(256), allowNull: false },
  reviewer: { type: Sequelize.STRING(70), allowNull: false },
  reviewer_id: { type: Sequelize.INTEGER, allowNull: false },
})

// defines a foreign key 'userId'
HostReview.belongsTo(User);

module.exports = HostReview;

