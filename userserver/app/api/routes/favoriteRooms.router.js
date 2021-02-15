const favoriteRoomController = require('../controllers/favoriteRoom.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users/{userId}/favorite_rooms:
 *  post:
 *    tags:
 *    - Favorite Rooms
 *    summary: Creates a favorite room for a user
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
 *        $ref: '#/definitions/FavoriteRoomPayload'
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "201":
 *        description: Favorite room was created successfully
 *        schema:
 *          $ref: "#/definitions/FavoriteRoom"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "500":
 *        description: The favorite room could not be created
 */
router.post('/:userId/favorite_rooms', favoriteRoomController.createFavorite);

/**
 * @swagger
 * /users/{userId}/favorite_rooms:
 *  get:
 *    tags:
 *    - Favorite Rooms
 *    summary: Find all the favorite rooms of an User
 *    description: Returns a list of favorite rooms
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of a specific user"
 *      required: true
 *      type: "integer"
 *    - name: api-key
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
 *              description: The id of the user rated
 *              example: 1
 *            amount:
 *              type: integer
 *              description: The amount of favorite rooms returned
 *              example: 1
 *            favorites:
 *              type: array
 *              description: The list of favorite rooms
 *              items:
 *                $ref: "#/definitions/FavoriteRoom"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "500":
 *        description: An error ocurred
 */
router.get('/:userId/favorite_rooms', favoriteRoomController.getAllFavorites);

/**
 * @swagger
 * /users/{userId}/favorite_rooms/{roomId}:
 *  get:
 *    tags:
 *    - Favorite Rooms
 *    summary: Find favorite room by ID
 *    description: Returns a single favorite room
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of a specific user"
 *      required: true
 *      type: "integer"
 *    - name: "roomId"
 *      in: "path"
 *      description: "Favorite room id to return"
 *      required: true
 *      type: "integer"
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: Successful operation
 *        schema:
 *          $ref: "#/definitions/FavoriteRoom"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User or favorite not found
 */
router.get('/:userId/favorite_rooms/:roomId', favoriteRoomController.getFavorite);

/**
 * @swagger
 * /users/{userId}/favorite_rooms/{roomId}:
 *  delete:
 *    tags:
 *    - Favorite Rooms
 *    summary: Deletes a favorite by ID
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User id of the user rated"
 *      required: true
 *      type: "integer"
 *    - name: "roomId"
 *      in: "path"
 *      description: "Favorite room id to be deleted"
 *      required: true
 *      type: "integer"
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: Favorite room deleted
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User or favorite room not found
 */
router.delete('/:userId/favorite_rooms/:roomId', favoriteRoomController.deleteFavorite);

module.exports = router;