const userController = require('../controllers/user.controller');

const hostReviewController = require('../controllers/hostReview.controller');
const hostRatingController = require('../controllers/hostRating.controller');

const express = require('express');
const router = express.Router();

router.post('/', userController.createUser);

router.post('/:userId/host_reviews', hostReviewController.createReview);
router.post('/:userId/host_ratings', hostRatingController.createRating);

router.get('/:userId', userController.getUser);

router.get('/:userId/host_reviews', hostReviewController.getAllReviews);
router.get('/:userId/host_ratings', hostRatingController.getAllRatings);

router.get('/:userId/host_reviews/:reviewId', hostReviewController.getReview);
router.get('/:userId/host_ratings/:ratingId', hostRatingController.getRating);

module.exports = router;