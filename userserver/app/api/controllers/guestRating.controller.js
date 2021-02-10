const UserController = require('./user.controller');
const GuestRating = require('../../model/guestRating')
const aux = require('../filterObjectKeys');
const utils = require('../reqResUtils');
require('dotenv').config();
const logger = require('../logger');

const ratingKeys = ['rating', 'reviewer', 'reviewer_id'];

async function ratingExists(id) {
  let review = await GuestRating.findOne({ where: { id } });
  return review != null;
}

function creationPayloadIsInvalid(payload, res) {
  let error = utils.getErrorInPayload(payload, { "rating": { "type": "number", "min": 1, "max": 5, "isInteger": true },
                                                 "reviewer": { "type": "string", "length": 70 },
                                                 "reviewer_id": { "type": "number", "min": 0, "isInteger": true }, });

  if (error) {
    logger.error('Guest rating could not be created,', error);
    utils.respond(res, 400, { error: error });
    return true;
  }
  return false;
}

exports.createRating = async (req, res) => {

  logger.info(`POST request to endpoint "/users/${req.params.userId}/guest_ratings"` +
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
  
  const toCreate = aux.filterObjectKeys(req.body, ratingKeys);
  rating_params = {...req.params, ...toCreate};

  GuestRating.create(rating_params).then((newRating) => {
    logger.info('Guest rating created');
    utils.respond(res, 201, newRating.toJSON());
  }).catch((error) => {
    logger.info('Guest rating could not be created');
    utils.respond(res, 500, { error: error.message, params: req.params });
  })
}

exports.getAllRatings = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/guest_ratings"` +
    `\tRequest query: ${JSON.stringify(req.query)}`
  );

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }

  let query = aux.filterObjectKeys(req.query, [...ratingKeys, "id"]);
  query["userId"] = req.params.userId;
  GuestRating.findAll({ where: query }).then((ratings) => {
    utils.respond(res, 200, { userId: req.params.userId, amount: ratings.length, ratings: ratings });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getRating = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/guest_ratings/${req.params.ratingId}"`);

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  if (!(await ratingExists(req.params.ratingId))) {
    utils.respond(res, 404, { error: "rating not found" });
    return;
  }

  GuestRating.findOne({ where:{ id:[req.params.ratingId], userId: [req.params.userId] } }).then((rating) => {
    if (rating != null)
      utils.respond(res, 200, rating);
    else
      utils.respond(res, 404, { error: "no relation between user and guest rating" });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.deleteRating = async (req, res) => {

  logger.info(`DELETE request to endpoint "/users/${req.params.userId}/guest_ratings/${req.params.ratingId}"`);

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  if (!(await ratingExists(req.params.ratingId))) {
    utils.respond(res, 404, { error: "rating not found" });
    return;
  }

  GuestRating.destroy({ where: { id: req.params.ratingId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        utils.respond(res, 200, result);
      else
        utils.respond(res, 404, { error: "no relation between user and guest rating" });
    }).catch((error) => {
      utils.respond(res, 500, { error: error.message });
    })
}
