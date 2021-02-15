const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

/**
 * @swagger
 * definitions:
 *  FavoriteRoomPayload:
 *    type: object
 *    properties:
 *      room_id:
 *        type: integer
 *        minimum: 0
 *        required: true
 *        description: "Id of a room"
 *        example: 5
 *  FavoriteRoom:
 *    allOf:
 *      - $ref: "#/definitions/FavoriteRoomPayload"
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


const FavoriteRoom = database.define('favorite_room', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  room_id: { type: Sequelize.INTEGER, allowNull: false, validate: { isInt: true, min: 0 }},
})

// defines a foreign key 'userId'
FavoriteRoom.belongsTo(User);

module.exports = FavoriteRoom;
