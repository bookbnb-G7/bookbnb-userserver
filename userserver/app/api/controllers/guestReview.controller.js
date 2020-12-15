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

exports.createReview = async (req, res) => {

  logger.info(`POST request to endpoint "/users/${req.params.userId}/guest_reviews"` +
    `\tRequest body: ${req.body}`
  );

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  
  const toCreate = aux.filterObjectKeys(req.body, reviewKeys);
  review_params = {...req.params, ...toCreate};

  GuestReview.create(review_params).then((newReview) => {
    logger.info('Guest review created');
    res.status(201).json(aux.filterObjectKeys(newReview.toJSON(), [...reviewKeys, "id"]));
  }).catch((error) => {
    logger.info('Guest review could not be created');
    res.status(500).json({ error: error.message });
  })
}

exports.getAllReviews = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/guest_reviews"` +
    `\tRequest query: ${req.query}`
  );

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }

  let query = aux.filterObjectKeys(req.query, [...reviewKeys, "id"]);
  query["userId"] = req.params.userId;
  GuestReview.findAll({ where: query, attributes: [...reviewKeys, "id"] }).then((reviews) => {
    res.status(200).json({ userId: req.params.userId, amount: reviews.length, reviews: reviews });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.getReview = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/guest_reviews/${req.params.reviewId}"`);

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await reviewExists(req.params.reviewId))) {
    res.status(404).json({ error: "review not found" });
    return;
  }

  GuestReview.findOne({ where:{ id:[req.params.reviewId], userId: [req.params.userId] }, attributes: [...reviewKeys, "id"]}).then((review) => {
    if (review != null)
      res.status(200).json(review);
    else
      res.status(404).json({ error: "no relation between user and guest review" });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.updateReview = async (req, res) => {

  logger.info(`PATCH request to endpoint "/users/${req.params.userId}/guest_reviews/${req.params.reviewId}"` +
    `\tRequest body: ${req.body}`
  );

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await reviewExists(req.params.reviewId))) {
    res.status(404).json({ error: "review not found" });
    return;
  }

  const toUpdate = aux.filterObjectKeys(req.body, reviewKeys);
  GuestReview.findOne({ where: { id: req.params.reviewId, userId: req.params.userId } }).then((review) => {
    if (review) {
      review.update(toUpdate).then((reviewUpdated) => {
        logger.info('Guest review updated');
        res.status(200).json(aux.filterObjectKeys(reviewUpdated.toJSON(), [...reviewKeys, "id"]));
      }).catch((error) => {
        logger.info('Guest review could not be updated');
        res.status(500).json( { error: error.message});
      });
    } else
      res.status(404).json({ error: "no relation between user and guest review" })
  }).catch((error) => {
    res.status(500).json( { error: error.message });
  });
}

exports.deleteReview = async (req, res) => {

  logger.info(`DELETE request to endpoint "/users/${req.params.userId}/guest_reviews/${req.params.reviewId}"`);

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await reviewExists(req.params.reviewId))) {
    res.status(404).json({ error: "review not found" });
    return;
  }

  GuestReview.destroy({ where: { id: req.params.reviewId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        res.status(200).json(result);
      else
        res.status(404).json({ error: "no relation between user and guest review" })
    }).catch((error) => {
      res.status(500).json({ error: error.message });
    })
}
