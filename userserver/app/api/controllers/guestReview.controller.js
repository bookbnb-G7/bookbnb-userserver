const UserController = require('./user.controller');
const GuestReview = require('../../model/guestReview')
const aux = require('../filterObjectKeys');
const utils = require('../reqResUtils');
require('dotenv').config();
const logger = require('../logger');

const reviewKeys = ['review', 'reviewer', 'reviewer_id'];

async function reviewExists(id) {
  let review = await GuestReview.findOne({ where: { id } });
  return review != null;
}

function getInvalidReviewError(review) {
  let error = null;
  if ((typeof review !== 'string') || (review.length > 256))
    error = 'review should be a string shorter than 256 characters';

  return error;
}

function getInvalidReviewerError(reviewer) {
  let error = null;
  if ((typeof reviewer !== 'string') || (reviewer.length > 70))
    error = 'reviewer should be a string shorter than 70 characters';

  return error;
}

function getInvalidReviewerIdError(id) {
  let error = null;
  if ((typeof id !== 'number') || (id < 0) || (id % 1 !== 0))
    error = 'reviewer id should be a positive integer';

  return error;
}

function creationPayloadIsInvalid(payload, res) {
  let error = utils.getAttributeMissingError(payload, reviewKeys);
  
  if (!error) {
    error = getInvalidReviewError(payload["review"]);
    error = getInvalidReviewerError(payload["reviewer"]);
    error = getInvalidReviewerIdError(payload["reviewer_id"]);
  }

  if (error) {
    logger.error('Guest review could not be created,', error);
    utils.respond(res, 400, { error: error });
    return true;
  }
  return false;
}

exports.createReview = async (req, res) => {

  logger.info(`POST request to endpoint "/users/${req.params.userId}/guest_reviews"` +
    `\tRequest body: ${JSON.stringify(req.body)}`
  );

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (creationPayloadIsInvalid(req.body, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  
  const toCreate = aux.filterObjectKeys(req.body, reviewKeys);
  review_params = {...req.params, ...toCreate};

  GuestReview.create(review_params).then((newReview) => {
    logger.info('Guest review created');
    utils.respond(res, 201, aux.filterObjectKeys(newReview.toJSON(), [...reviewKeys, "id"]));
  }).catch((error) => {
    logger.info('Guest review could not be created');
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getAllReviews = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/guest_reviews"` +
    `\tRequest query: ${JSON.stringify(req.query)}`
  );

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }

  let query = aux.filterObjectKeys(req.query, [...reviewKeys, "id"]);
  query["userId"] = req.params.userId;
  GuestReview.findAll({ where: query, attributes: [...reviewKeys, "id"] }).then((reviews) => {
    utils.respond(res, 200, { userId: req.params.userId, amount: reviews.length, reviews: reviews });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getReview = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/guest_reviews/${req.params.reviewId}"`);

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  if (!(await reviewExists(req.params.reviewId))) {
    utils.respond(res, 404, { error: "review not found" });
    return;
  }

  GuestReview.findOne({ where:{ id:[req.params.reviewId], userId: [req.params.userId] }, attributes: [...reviewKeys, "id"]}).then((review) => {
    if (review != null)
      utils.respond(res, 200, review);
    else
      utils.respond(res, 404, { error: "no relation between user and guest review" });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.updateReview = async (req, res) => {

  logger.info(`PATCH request to endpoint "/users/${req.params.userId}/guest_reviews/${req.params.reviewId}"` +
    `\tRequest body: ${JSON.stringify(req.body)}`
  );

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  if (!(await reviewExists(req.params.reviewId))) {
    utils.respond(res, 404, { error: "review not found" });
    return;
  }

  const toUpdate = aux.filterObjectKeys(req.body, reviewKeys);
  GuestReview.findOne({ where: { id: req.params.reviewId, userId: req.params.userId } }).then((review) => {
    if (review) {
      review.update(toUpdate).then((reviewUpdated) => {
        logger.info('Guest review updated');
        utils.respond(res, 200, aux.filterObjectKeys(reviewUpdated.toJSON(), [...reviewKeys, "id"]));
      }).catch((error) => {
        logger.info('Guest review could not be updated');
        utils.respond(res, 500, { error: error.message});
      });
    } else
      utils.respond(res, 404, { error: "no relation between user and guest review" });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  });
}

exports.deleteReview = async (req, res) => {

  logger.info(`DELETE request to endpoint "/users/${req.params.userId}/guest_reviews/${req.params.reviewId}"`);

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  if (!(await reviewExists(req.params.reviewId))) {
    utils.respond(res, 404, { error: "review not found" });
    return;
  }

  GuestReview.destroy({ where: { id: req.params.reviewId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        utils.respond(res, 200, result);
      else
        utils.respond(res, 404, { error: "no relation between user and guest review" });
    }).catch((error) => {
      utils.respond(res, 500, { error: error.message });
    })
}
