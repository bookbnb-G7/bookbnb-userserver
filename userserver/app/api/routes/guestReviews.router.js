const guestReviewController = require('../controllers/guestReview.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users/{userId}/guest_reviews:
 *  post:
 *    tags:
 *    - Guest Reviews
 *    summary: Creates a guest review for a user
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
 *        $ref: '#/definitions/GuestReview'
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "201":
 *        description: Guest review was created successfully
 *        schema:
 *          $ref: "#/definitions/GuestRating"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "500":
 *        description: The guest review could not be created
 */
router.post('/:userId/guest_reviews', guestReviewController.createReview);

/**
 * @swagger
 * /users/{userId}/guest_reviews:
 *  get:
 *    tags:
 *    - Guest Reviews
 *    summary: Find all the guest reviews of an User
 *    description: Returns a list of guest reviews
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
 *              description: The id of the user reviewed
 *              example: 1
 *            amount:
 *              type: integer
 *              description: The amount of reviews returned
 *              example: 1
 *            reviews:
 *              type: array
 *              description: The list of reviews
 *              items:
 *                $ref: "#/definitions/GuestReview"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "500":
 *        description: An error ocurred
 */
router.get('/:userId/guest_reviews', guestReviewController.getAllReviews);

/**
 * @swagger
 * /users/{userId}/guest_reviews/{reviewId}:
 *  get:
 *    tags:
 *    - Guest Reviews
 *    summary: Find review by ID
 *    description: Returns a single guest review
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
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: Successful operation
 *        schema:
 *          $ref: "#/definitions/GuestReview"
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User or review not found
 */
router.get('/:userId/guest_reviews/:reviewId', guestReviewController.getReview);

/**
 * @swagger
 * /users/{userId}/guest_reviews/{reviewId}:
 *  delete:
 *    tags:
 *    - Guest Reviews
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
 *    - name: api-key
 *      in: header
 *      required: true
 *      type: string
 *      example: fake_api_key
 *    responses:
 *      "200":
 *        description: Review deleted
 *      "401":
 *        description: unauthorized, invalid api key
 *      "404":
 *        description: User or review not found
 */
router.delete('/:userId/guest_reviews/:reviewId', guestReviewController.deleteReview);

module.exports = router;