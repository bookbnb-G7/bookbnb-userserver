const roomBookingController = require('../controllers/roomBooking.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users/{userId}/bookings:
 *  post:
 *    tags:
 *    - Room Bookings
 *    summary: Creates a room booking for a user
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of a specific user"
 *      required: true
 *      type: "integer"
 *    - name: body
 *      in: body
 *      required: true
 *      schema:
 *        $ref: '#/definitions/RoomBooking'
 *    - name: api_key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "201":
 *        description: Room booking was created successfully
 *        schema:
 *          $ref: "#/definitions/RoomBooking"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "500":
 *        description: The room booking could not be created
 */
router.post('/:userId/bookings', roomBookingController.createBooking);

/**
 * @swagger
 * /users/{userId}/bookings:
 *  get:
 *    tags:
 *    - Room Bookings
 *    summary: Find all the room bookings of an User
 *    description: Returns a list of room bookings
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of a specific user"
 *      required: true
 *      type: "integer"
 *    - name: api_key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: Successful operation
*        schema:
 *          type: object
 *          properties:
 *            userId:
 *              type: integer
 *              description: The id of the user booked
 *              example: 1
 *            amount:
 *              type: integer
 *              description: The amount of room bookings returned
 *              example: 1
 *            roomBookings:
 *              type: array
 *              description: The list of room bookings
 *              items:
 *                $ref: "#/definitions/RoomBooking"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "500":
 *        description: An error ocurred
 */
router.get('/:userId/bookings', roomBookingController.getAllBookings);

/**
 * @swagger
 * /users/{userId}/bookings/{roomBookingId}:
 *  get:
 *    tags:
 *    - Room Bookings
 *    summary: Find rating by ID
 *    description: Returns a single room booking
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of a specific user"
 *      required: true
 *      type: "integer"
 *    - name: "roomBookingId"
 *      in: "path"
 *      description: "Room booking id to return"
 *      required: true
 *      type: "integer"
 *    - name: api_key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: Successful operation
 *        schema:
 *          $ref: "#/definitions/RoomBooking"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User or room booking not found
 */
router.get('/:userId/bookings/:roomBookingId', roomBookingController.getBooking);

/**
 * @swagger
 * /users/{userId}/bookings/{roomBookingId}:
 *  delete:
 *    tags:
 *    - Room Bookings
 *    summary: Deletes a room booking by ID
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User id of the user booked"
 *      required: true
 *      type: "integer"
 *    - name: "roomBookingId"
 *      in: "path"
 *      description: "Room booking id to be deleted"
 *      required: true
 *      type: "integer"
 *    - name: api_key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: Room booking deleted
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User or room booking not found
 */
router.delete('/:userId/bookings/:roomBookingId', roomBookingController.deleteBooking);

module.exports = router;