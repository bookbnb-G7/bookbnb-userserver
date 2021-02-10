const UserController = require('./user.controller');
const FavoriteRoom = require('../../model/favoriteRoom')
const aux = require('../filterObjectKeys');
const utils = require('../reqResUtils');
require('dotenv').config();
const logger = require('../logger');

const favoriteKeys = ['room_id'];

async function favoriteExists(id) {
  let favorite = await FavoriteRoom.findOne({ where: { id } });
  return favorite != null;
}

function creationPayloadIsInvalid(payload, res) {
  let error = utils.getErrorInPayload(payload, { "room_id": { "type": "number", "min": 0, "isInteger": true } });

  if (error) {
    logger.error('Favorite room could not be created,', error);
    utils.respond(res, 400, { error: error });
    return true;
  }
  return false;
}

exports.createFavorite = async (req, res) => {

  logger.info(`POST request to endpoint "/users/${req.params.userId}/favorite_rooms"` +
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
  
  const toCreate = aux.filterObjectKeys(req.body, favoriteKeys);
  favorite_params = {...req.params, ...toCreate};

  FavoriteRoom.create(favorite_params).then((newFavorite) => {
    logger.info('Favorite room created');
    utils.respond(res, 201, newFavorite.toJSON());
  }).catch((error) => {
    logger.info('Favorite room could not be created');
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getAllFavorites = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/favorite_rooms"` +
    `\tRequest query: ${JSON.stringify(req.query)}`
  );

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }

  let query = aux.filterObjectKeys(req.query, [...favoriteKeys, "id"]);
  query["userId"] = req.params.userId;
  FavoriteRoom.findAll({ where: query }).then((favorites) => {
    utils.respond(res, 200, { userId: req.params.userId, amount: favorites.length, favorites: favorites });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getFavorite = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/favorite_rooms/${req.params.favoriteId}"`);

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  if (!(await favoriteExists(req.params.favoriteId))) {
    utils.respond(res, 404, { error: "favorite room not found" });
    return;
  }

  FavoriteRoom.findOne({ where:{ id:[req.params.favoriteId], userId: [req.params.userId] } }).then((favorite) => {
    if (favorite != null)
      utils.respond(res, 200, favorite);
    else
      utils.respond(res, 404, { error: "no relation between user and favorite room" });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.deleteFavorite = async (req, res) => {

  logger.info(`DELETE request to endpoint "/users/${req.params.userId}/favorite_rooms/${req.params.favoriteId}"`);

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  if (!(await favoriteExists(req.params.favoriteId))) {
    utils.respond(res, 404, { error: "favorite not found" });
    return;
  }

  FavoriteRoom.destroy({ where: { id: req.params.favoriteId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        utils.respond(res, 200, result);
      else
        utils.respond(res, 404, { error: "no relation between user and favorite room" });
    }).catch((error) => {
      utils.respond(res, 500, { error: error.message });
    })
}
