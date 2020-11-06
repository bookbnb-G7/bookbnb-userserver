const guestReviewController = require('../controllers/guestReview.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users/{userId}/guest_reviews/:
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
 *    responses:
 *      201:
 *        description: Guest review was created successfully
 *        schema:
 *          $ref: "#/definitions/GuestRating"
 *      500:
 *        description: The guest review could not be created
 */
router.post('/:userId/guest_reviews', guestReviewController.createReview);

/**
 * @swagger
 * /users/{userId}/guest_reviews/:
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
 *    responses:
 *      "200":
 *        description: Successful operation
 *        schema:
 *          type: "array"
 *          items:
 *            $ref: "#/definitions/GuestReview"
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
 *    responses:
 *      "200":
 *        description: Successful operation
 *        schema:
 *          $ref: "#/definitions/GuestReview"
 *      "404":
 *        description: User or review not found
 */
router.get('/:userId/guest_reviews/:reviewId', guestReviewController.getReview);

/**
 * @swagger
 * /users/{userId}/guest_reviews/{reviewId}:
 *  patch:
 *    tags:
 *    - Guest Reviews
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
 *        $ref: "#/definitions/GuestReview"
 *    responses:
 *      "200":
 *        description: Review updated
 *      "404":
 *        description: User or review not found
 */
router.patch('/:userId/guest_reviews/:reviewId', guestReviewController.updateReview);

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
 *    responses:
 *      "200":
 *        description: Review deleted
 *      "404":
 *        description: User or review not found
 */
router.delete('/:userId/guest_reviews/:reviewId', guestReviewController.deleteReview);

module.exports = router;