const userController = require('../controllers/user.controller');

const hostReviewController = require('../controllers/hostReview.controller');
const hostRatingController = require('../controllers/hostRating.controller');

const guestReviewController = require('../controllers/guestReview.controller');
const guestRatingController = require('../controllers/guestRating.controller');

const express = require('express');
const router = express.Router();

router.post('/', userController.createUser);

router.post('/:userId/host_reviews', hostReviewController.createReview);
router.post('/:userId/host_ratings', hostRatingController.createRating);

router.post('/:userId/guest_reviews', guestReviewController.createReview);
router.post('/:userId/guest_ratings', guestRatingController.createRating);

router.get('/:userId', userController.getUser);

router.get('/:userId/host_reviews', hostReviewController.getAllReviews);
router.get('/:userId/host_ratings', hostRatingController.getAllRatings);

router.get('/:userId/guest_reviews', guestReviewController.getAllReviews);
router.get('/:userId/guest_ratings', guestRatingController.getAllRatings);

router.get('/:userId/host_reviews/:reviewId', hostReviewController.getReview);
router.get('/:userId/host_ratings/:ratingId', hostRatingController.getRating);

router.get('/:userId/guest_reviews/:reviewId', guestReviewController.getReview);
router.get('/:userId/guest_ratings/:ratingId', guestRatingController.getRating);

module.exports = router;