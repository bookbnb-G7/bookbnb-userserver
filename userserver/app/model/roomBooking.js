const database = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

/**
 * @swagger
 * definitions:
 *  RoomBooking:
 *    type: object
 *    properties:
 *      booking_id:
 *        type: integer
 *        required: true
 *        description: "Id of the room booking made by the user"
 *        example: 22
 *      room_id:
 *        type: integer
 *        required: true
 *        description: "Id of the room booked by the user"
 *        example: 15
 */


const RoomBooking = database.define('room_bookings', {
  booking_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:false, allowNull: false},
  room_id: { type: Sequelize.INTEGER, allowNull: false }
})

// defines a foreign key 'userId'
RoomBooking.belongsTo(User);

module.exports = RoomBooking;

