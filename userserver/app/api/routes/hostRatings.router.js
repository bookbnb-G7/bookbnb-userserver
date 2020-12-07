const hostRatingController = require('../controllers/hostRating.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users/{userId}/host_ratings:
 *  post:
 *    tags:
 *    - Host Ratings
 *    summary: Creates a host rating for a user
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
 *        $ref: '#/definitions/HostRating'
 *    - name: access_token
 *      in: header
 *      required: true
 *      type: string
 *      example: token_unico_de_autorizacion
 *    responses:
 *      "201":
 *        description: Host rating was created successfully
 *        schema:
 *          $ref: "#/definitions/HostRating"
 *      "403":
 *        description: Forbidden, invalid access token
 *      "500":
 *        description: The host rating could not be created
 */
router.post('/:userId/host_ratings', hostRatingController.createRating);

/**
 * @swagger
 * /users/{userId}/host_ratings:
 *  get:
 *    tags:
 *    - Host Ratings
 *    summary: Find all the host ratings of an User
 *    description: Returns a list of host ratings
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of a specific user"
 *      required: true
 *      type: "integer"
 *    - name: access_token
 *      in: header
 *      required: true
 *      type: string
 *      example: token_unico_de_autorizacion
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
 *              description: The amount of users returned
 *              example: 1
 *            ratings:
 *              type: array
 *              description: The list of ratings
 *              items:
 *                $ref: "#/definitions/HostRating"
 *      "403":
 *        description: Forbidden, invalid access token
 *      "500":
 *        description: An error ocurred
 */
router.get('/:userId/host_ratings', hostRatingController.getAllRatings);

/**
 * @swagger
 * /users/{userId}/host_ratings/{ratingId}:
 *  get:
 *    tags:
 *    - Host Ratings
 *    summary: Find rating by ID
 *    description: Returns a single host rating
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of a specific user"
 *      required: true
 *      type: "integer"
 *    - name: "ratingId"
 *      in: "path"
 *      description: "Rating id to return"
 *      required: true
 *      type: "integer"
 *    - name: access_token
 *      in: header
 *      required: true
 *      type: string
 *      example: token_unico_de_autorizacion
 *    responses:
 *      "200":
 *        description: Successful operation
 *        schema:
 *          $ref: "#/definitions/HostRating"
 *      "403":
 *        description: Forbidden, invalid access token
 *      "404":
 *        description: User or rating not found
 */
router.get('/:userId/host_ratings/:ratingId', hostRatingController.getRating);

/**
 * @swagger
 * /users/{userId}/host_ratings/{ratingId}:
 *  patch:
 *    tags:
 *    - Host Ratings
 *    summary: Updates a rating
 *    description: Changes the attributes received of a specific rating of a specific user
 *    parameters:
 *    - name: "userId"
 *      in: path
 *      description: "The ID of a specific user" 
 *      required: true
 *      type: "integer"
 *    - name: "ratingId"
 *      in: "path"
 *      description: "Rating id to be updated"
 *      required: true
 *      type: "integer"
 *    - name: JsonPatch
 *      in: body
 *      required: false
 *      schema:
 *        $ref: "#/definitions/HostRating"
 *    - name: access_token
 *      in: header
 *      required: true
 *      type: string
 *      example: token_unico_de_autorizacion
 *    responses:
 *      "200":
 *        description: Rating updated
 *      "403":
 *        description: Forbidden, invalid access token
 *      "404":
 *        description: User or rating not found
 */
router.patch('/:userId/host_ratings/:ratingId', hostRatingController.updateRating);

/**
 * @swagger
 * /users/{userId}/host_ratings/{ratingId}:
 *  delete:
 *    tags:
 *    - Host Ratings
 *    summary: Deletes a rating by ID
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User id of the user rated"
 *      required: true
 *      type: "integer"
 *    - name: "ratingId"
 *      in: "path"
 *      description: "Rating id to be deleted"
 *      required: true
 *      type: "integer"
 *    - name: access_token
 *      in: header
 *      required: true
 *      type: string
 *      example: token_unico_de_autorizacion
 *    responses:
 *      "200":
 *        description: Rating deleted
 *      "403":
 *        description: Forbidden, invalid access token
 *      "404":
 *        description: User or rating not found
 */
router.delete('/:userId/host_ratings/:ratingId', hostRatingController.deleteRating);

module.exports = router;