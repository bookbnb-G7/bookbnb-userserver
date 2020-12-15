const User = require('../../model/user');
const aux = require('../filterObjectKeys');
const utils = require('../reqResUtils');
require('dotenv').config();
const logger = require('../logger');

const userKeys = ['firstname', 'lastname', 'email', 'country', 'phonenumber', 'birthdate', 'photo'];

exports.createUser = (req, res) => {

  logger.info('POST request to endpoint "/users"\n' +
    `\tRequest body: ${JSON.stringify(req.body)}`
  );

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  const toCreate = aux.filterObjectKeys(req.body, [...userKeys, "id"]);
  User.create(toCreate).then((newUser) => {
    //newUser contains all the attributes of the table, we want to send the client
    //only the ones in the userKeys list and the 'id'.
    //also newUser needs to be converted to JSON to be able to be filtered.
    logger.info('User created');
    utils.respond(res, 201, aux.filterObjectKeys(newUser.toJSON(), [...userKeys, "id"]));
  }).catch((error) => {
    logger.error('User could not be created')
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getUser = (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}"`);

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  User.findOne({ where: { id: req.params.userId }, attributes: [...userKeys, "id"]}).then((user) => {
    if (user)
      utils.respond(res, 200, user);
    else
      utils.respond(res, 404, { error: "not found" });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getAllUsers = (req, res) => {

  logger.info('GET request to endpoint "/users"\n' +
    `\tRequest query: ${JSON.stringify(req.query)}`
  );

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  let query = aux.filterObjectKeys(req.query, [...userKeys, "id"]);
  User.findAll({ where: query, attributes: [...userKeys, "id"] }).then((users) => {
    utils.respond(res, 200, { amount: users.length, users: users });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.updateUser = (req, res) => {

  logger.info(`PATCH request to endpoint "/users/${req.params.userId}"` +
    `\tRequest body: ${JSON.stringify(req.body)}`
  );

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  const toUpdate = aux.filterObjectKeys(req.body, userKeys);
  User.findOne({ where: {id: req.params.userId } }).then((user) => {
    if (user) {
      user.update(toUpdate).then((userUpdated) => {
        logger.info('User updated');
        utils.respond(res, 200, aux.filterObjectKeys(userUpdated.toJSON(), [...userKeys, "id"]));
      }).catch((error) => {
        utils.respond(res, 500, { error: error.message });
      });
    } else
      utils.respond(res, 404, { error: "not found" });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  });
}

exports.deleteUser = (req, res) => {

  logger.info(`DELETE request to endpoint "/users/${req.params.userId}"`);

  if (utils.apiKeyIsNotValid(req.headers.api_key, res))
    return;

  User.destroy({ where: { id: req.params.userId } })
    .then((result) => {
      if (result) {
        logger.info('User deleted');
        utils.respond(res, 200, result);
      } else
        utils.respond(res, 404, { error: "not found" });
    }).catch((error) => {
      utils.respond(res, 500, { error: error.message });
    })
}

exports.userExists = async (id) => {
  let user = await User.findOne({ where: {id} });
  return user != null;
}