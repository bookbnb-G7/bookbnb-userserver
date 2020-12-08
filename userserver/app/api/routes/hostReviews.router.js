const hostReviewController = require('../controllers/hostReview.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users/{userId}/host_reviews:
 *  post:
 *    tags:
 *    - Host Reviews
 *    summary: Creates a host review for a user
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
 *        $ref: '#/definitions/HostReview'
 *    - name: api_key
 *      in: header
 *      required: true
 *      type: string
 *      example: token_unico_de_autorizacion
 *    responses:
 *      "201":
 *        description: Host review was created successfully
 *        schema:
 *          $ref: "#/definitions/HostRating"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "500":
 *        description: The host review could not be created
 */
router.post('/:userId/host_reviews', hostReviewController.createReview);

/**
 * @swagger
 * /users/{userId}/host_reviews:
 *  get:
 *    tags:
 *    - Host Reviews
 *    summary: Find all the host reviews of an User
 *    description: Returns a list of host reviews
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
 *      example: token_unico_de_autorizacion
 *    responses:
 *      "200":
 *        description: Successful operation
 *        schema:
 *          type: object
 *          properties:
 *            userId:
 *              type: integer
 *              description: The id of the user reviewed
 *              example: 1
 *            amount:
 *              type: integer
 *              description: The amount of users returned
 *              example: 1
 *            reviews:
 *              type: array
 *              description: The list of reviews
 *              items:
 *                $ref: "#/definitions/HostReview"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "500":
 *        description: An error ocurred
 */
router.get('/:userId/host_reviews', hostReviewController.getAllReviews);

/**
 * @swagger
 * /users/{userId}/host_reviews/{reviewId}:
 *  get:
 *    tags:
 *    - Host Reviews
 *    summary: Find review by ID
 *    description: Returns a single host review
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of a specific user"
 *      required: true
 *      type: "integer"
 *    - name: "reviewId"
 *      in: "path"
 *      description: "Review id to return"
 *      required: true
 *      type: "integer"
 *    - name: api_key
 *      in: header
 *      required: true
 *      type: string
 *      example: token_unico_de_autorizacion
 *    responses:
 *      "200":
 *        description: Successful operation
 *        schema:
 *          $ref: "#/definitions/HostReview"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User or review not found
 */
router.get('/:userId/host_reviews/:reviewId', hostReviewController.getReview);

/**
 * @swagger
 * /users/{userId}/host_reviews/{reviewId}:
 *  patch:
 *    tags:
 *    - Host Reviews
 *    summary: Updates a review
 *    description: Changes the attributes received of a specific review of a specific user
 *    parameters:
 *    - name: "userId"
 *      in: path
 *      description: "The ID of a specific user" 
 *      required: true
 *      type: "integer"
 *    - name: "reviewId"
 *      in: "path"
 *      description: "Review id to be updated"
 *      required: true
 *      type: "integer"
 *    - name: JsonPatch
 *      in: body
 *      required: false
 *      schema:
 *        $ref: "#/definitions/HostReview"
 *    - name: api_key
 *      in: header
 *      required: true
 *      type: string
 *      example: token_unico_de_autorizacion
 *    responses:
 *      "200":
 *        description: Review updated
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User or review not found
 */
router.patch('/:userId/host_reviews/:reviewId', hostReviewController.updateReview);

/**
 * @swagger
 * /users/{userId}/host_reviews/{reviewId}:
 *  delete:
 *    tags:
 *    - Host Reviews
 *    summary: Deletes a review by ID
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "User id of the user reviewed"
 *      required: true
 *      type: "integer"
 *    - name: "reviewId"
 *      in: "path"
 *      description: "Review id to be deleted"
 *      required: true
 *      type: "integer"
 *    - name: api_key
 *      in: header
 *      required: true
 *      type: string
 *      example: token_unico_de_autorizacion
 *    responses:
 *      "200":
 *        description: Review deleted
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User or review not found
 */
router.delete('/:userId/host_reviews/:reviewId', hostReviewController.deleteReview);

module.exports = router;