const guestRatingController = require('../controllers/guestRating.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users/{userId}/guest_ratings/:
 *  post:
 *    tags:
 *    - Guest Ratings
 *    summary: Creates a guest rating for a user
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
 *        $ref: '#/definitions/GuestRating'
 *    responses:
 *      "201":
 *        description: Guest rating was created successfully
 *        schema:
 *          $ref: "#/definitions/GuestRating"
 *      "500":
 *        description: The guest rating could not be created
 */
router.post('/:userId/guest_ratings', guestRatingController.createRating);

/**
 * @swagger
 * /users/{userId}/guest_ratings/:
 *  get:
 *    tags:
 *    - Guest Ratings
 *    summary: Find all the guest ratings of an User
 *    description: Returns a list of guest ratings
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: "userId"
 *      in: "path"
 *      description: "ID of a specific user"
 *      required: true
 *      type: "integer"
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
 *                $ref: "#/definitions/GuestRating"
 *      "500":
 *        description: An error ocurred
 */
router.get('/:userId/guest_ratings', guestRatingController.getAllRatings);

/**
 * @swagger
 * /users/{userId}/guest_ratings/{ratingId}:
 *  get:
 *    tags:
 *    - Guest Ratings
 *    summary: Find rating by ID
 *    description: Returns a single guest rating
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
 *    responses:
 *      "200":
 *        description: Successful operation
 *        schema:
 *          $ref: "#/definitions/GuestRating"
 *      "404":
 *        description: User or rating not found
 */
router.get('/:userId/guest_ratings/:ratingId', guestRatingController.getRating);

/**
 * @swagger
 * /users/{userId}/guest_ratings/{ratingId}:
 *  patch:
 *    tags:
 *    - Guest Ratings
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
 *        $ref: "#/definitions/GuestRating"
 *    responses:
 *      "200":
 *        description: Rating updated
 *      "404":
 *        description: User or rating not found
 */
router.patch('/:userId/guest_ratings/:ratingId', guestRatingController.updateRating);

/**
 * @swagger
 * /users/{userId}/guest_ratings/{ratingId}:
 *  delete:
 *    tags:
 *    - Guest Ratings
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
 *    responses:
 *      "200":
 *        description: Rating deleted
 *      "404":
 *        description: User or rating not found
 */
router.delete('/:userId/guest_ratings/:ratingId', guestRatingController.deleteRating);

module.exports = router;