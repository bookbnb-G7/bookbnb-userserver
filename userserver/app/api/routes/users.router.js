const userController = require('../controllers/user.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users:
 *  post:
 *    tags:
 *    - Users
 *    summary: Creates a user
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: body
 *      in: body
 *      required: true
 *      schema:
 *        $ref: '#/definitions/UserPayload'
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "201":
 *        description: User was created successfully
 *        schema:
 *          $ref: "#/definitions/User"
 *      "400":
 *        description: Payload is invalid
 *        schema:
 *          type: object
 *          properties:
 *            error:
 *              type: string
 *              example: User with that id already exists
 *      "401":
 *        description: unauthorized, invalid api key
 *      "500":
 *        description: The user could not be created
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /users:
 *  get:
 *    tags:
 *    - Users
 *    summary: Get a list of all the Users
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: A list of users
 *        schema:
 *          type: object
 *          properties:
 *            amount:
 *              type: integer
 *              description: The amount of users returned
 *              example: 1
 *            users:
 *              type: array
 *              description: The list of users
 *              items:
 *                $ref: "#/definitions/User"
 *      "401":
 *        description: unauthorized, invalid api key
 *      
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *  get:
 *    tags:
 *    - Users
 *    summary: Find user by ID
 *    description: Returns a single user
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of user to return"
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
 *          $ref: "#/definitions/User"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User not found
 */
router.get('/:userId', userController.getUser);

/**
 * @swagger
 * /users/{userId}:
 *  patch:
 *    tags:
 *    - Users
 *    summary: Updates a user
 *    description: Changes the attributes received of a specific user
 *    parameters:
 *    - name: "userId"
 *      in: path
 *      description: "The ID of a specific user" 
 *      required: true
 *      type: "integer"
 *    - name: JsonPatch
 *      in: body
 *      required: false
 *      schema:
 *        $ref: "#/definitions/User"
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: User updated
 *      "400":
 *        description: Payload is invalid
 *        schema:
 *          type: object
 *          properties:
 *            error:
 *              type: string
 *              example: birthdate should be a date-like string with the format YYYY-MM-DD
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User not found
 */
router.patch('/:userId', userController.updateUser);

/**
 * @swagger
 * /users/{userId}:
 *  delete:
 *    tags:
 *    - Users
 *    summary: Deletes a user by ID
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User id to delete"
 *      required: true
 *      type: "integer"
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: User deleted
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User not found
 */
router.delete('/:userId', userController.deleteUser);

module.exports = router;