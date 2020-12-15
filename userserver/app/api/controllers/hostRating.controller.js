const UserController = require('./user.controller');
const HostRating = require('../../model/hostRating');
const aux = require('../filterObjectKeys');
const utils = require('../reqResUtils');
require('dotenv').config();
const logger = require('../logger');

const ratingKeys = ['rating', 'reviewer', 'reviewer_id'];

async function ratingExists(id) {
  let review = await HostRating.findOne({ where: { id } });
  return review != null;
}

exports.createRating = async (req, res) => {

  logger.info(`POST request to endpoint "/users/${req.params.userId}/host_ratings"` +
    `\tRequest body: ${req.body}`
  );

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  
  const toCreate = aux.filterObjectKeys(req.body, ratingKeys);
  rating_params = {...req.params, ...toCreate};

  HostRating.create(rating_params).then((newRating) => {
    res.status(201).json(aux.filterObjectKeys(newRating.toJSON(), [...ratingKeys, "id"]));
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.getAllRatings = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/host_ratings"` +
    `\tRequest query: ${req.query}`
  );

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }

  let query = aux.filterObjectKeys(req.query, [...ratingKeys, "id"]);
  query["userId"] = req.params.userId;
  HostRating.findAll({ where: query, attributes: [...ratingKeys, "id"] }).then((ratings) => {
    res.status(200).json({ userId: req.params.userId, amount: ratings.length, ratings: ratings });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.getRating = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/host_ratings/${req.params.ratingId}"`);

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await ratingExists(req.params.ratingId))) {
    res.status(404).json({ error: "rating not found" });
    return;
  }

  HostRating.findOne({ where:{ id:[req.params.ratingId], userId: [req.params.userId] }, attributes: [...ratingKeys, "id"]}).then((rating) => {
    if (rating != null)
      res.status(200).json(rating)
    else
      res.status(404).json({ error: "no relation between user and host rating" });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.updateRating = async (req, res) => {

  logger.info(`PATCH request to endpoint "/users/${req.params.userId}/host_ratings/${req.params.ratingId}"` +
    `\tRequest body: ${req.body}`
  );

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await ratingExists(req.params.ratingId))) {
    res.status(404).json({ error: "rating not found" });
    return;
  }

  const toUpdate = aux.filterObjectKeys(req.body, ratingKeys);
  HostRating.findOne({ where: { id: req.params.ratingId, userId: req.params.userId } }).then((rating) => {
    if (rating) {
      rating.update(toUpdate).then((ratingUpdated) => {
        res.status(200).json(aux.filterObjectKeys(ratingUpdated.toJSON(), [...ratingKeys, "id"]));
      }).catch((error) => {
        res.status(500).json( { success: "false", error: error.message});
      });
    } else
      res.status(404).json({ error: "no relation between user and host rating" })
  }).catch((error) => {
    res.status(500).json( { error: error.message });
  });
}

exports.deleteRating = async (req, res) => {

  logger.info(`DELETE request to endpoint "/users/${req.params.userId}/host_ratings/${req.params.ratingId}"`);

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await ratingExists(req.params.ratingId))) {
    res.status(404).json({ error: "rating not found" });
    return;
  }

  HostRating.destroy({ where: { id: req.params.ratingId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        res.status(200).json(result);
      else
        res.status(404).json({ error: "no relation between user and host rating" })
    }).catch((error) => {
      res.status(500).json({ error: error.message });
    })
}
