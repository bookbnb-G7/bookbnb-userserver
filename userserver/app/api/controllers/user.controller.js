const User = require('../../model/user');
const aux = require('../filterObjectKeys');
const utils = require('../reqResUtils');
require('dotenv').config();
const logger = require('../logger');

const userCreationKeys = ['firstname', 'lastname', 'email', 'country', 'phonenumber', 'birthdate']

const userKeys = [...userCreationKeys, 'photo'];

function creationPayloadIsInvalid(payload, res) {
  let error = utils.getErrorInPayload(payload, { "id": { "type": "number", "min": 0, "isInteger": true },
                                                 "firstname": { "type": "string", "length": 30 },
                                                 "lastname": { "type": "string", "length": 30 },
                                                 "email": { "type": "string", "length": 50, "isEmail": true },
                                                 "country": { "type": "string", "length": 20 },
                                                 "phonenumber": { "type": "string", "length": 20 },
                                                 "birthdate": { "type": "string", "isDate": true }, });

  if (error) {
    logger.error('User could not be created,', error);
    utils.respond(res, 400, { error: error });
    return true;
  }
  return false;
}

function updatePayloadIsNotValid(payload, res) {
  let error = null;
  console.log("updating");
  console.log(payload);

  let attributesToCheck = {};
  let userAttributesChecking = { "id": { "type": "number", "min": 0, "isInteger": true },
                                 "firstname": { "type": "string", "length": 30 },
                                 "lastname": { "type": "string", "length": 30 },
                                 "email": { "type": "string", "length": 50, "isEmail": true },
                                 "country": { "type": "string", "length": 20 },
                                 "phonenumber": { "type": "string", "length": 20 },
                                 "birthdate": { "type": "string", "isDate": true },
                                 "photo": { "type": "string", "length": 256 }, };

  let attrKeys = Object.keys(payload);

  for (let key = 0; key < attrKeys.length; ++key) {
    attributesToCheck[attrKeys[key]] = userAttributesChecking[attrKeys[key]]
  }

  error = utils.getErrorInPayload(payload, attributesToCheck);

  console.log(error)

  if (error) {
    logger.error('User could not be updated,', error);
    utils.respond(res, 400, { error: error });
  }

  return error;
}

exports.createUser = (req, res) => {

  logger.info('POST request to endpoint "/users"\n' +
    `\tRequest body: ${JSON.stringify(req.body)}`
  );

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (creationPayloadIsInvalid(req.body, res))
    return;

  const toCreate = aux.filterObjectKeys(req.body, [...userKeys, "id"]);

  User.findOne({ where: { id: req.body["id"] } }).then((user) => {
    if (user){
      utils.respond(res, 400, { error: "User with that id already exists" });
      return;
    }
      
    User.findOne({ where: { email: req.body["email"] } }).then((user) => {
      if (user) {
        utils.respond(res, 400, { error: "User with that email already exists" });
        return;
      }
      
      User.create(toCreate).then((newUser) => {
          //newUser contains all the attributes of the table, we want to send the client
          //only the ones in the userKeys list and the 'id'.
          //also newUser needs to be converted to JSON to be able to be filtered.
          logger.info('User created');
          utils.respond(res, 201, newUser.toJSON());
      })
    })
  }).catch((error) => {
    logger.error('User could not be created');
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getUser = (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}"`);

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  User.findOne({ where: { id: req.params.userId } }).then((user) => {
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

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  let query = aux.filterObjectKeys(req.query, [...userKeys, "id"]);
  User.findAll({ where: query }).then((users) => {
    utils.respond(res, 200, { amount: users.length, users: users });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.updateUser = (req, res) => {

  logger.info(`PATCH request to endpoint "/users/${req.params.userId}"` +
    `\tRequest body: ${JSON.stringify(req.body)}`
  );

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  const toUpdate = aux.filterObjectKeys(req.body, userKeys);

  if (updatePayloadIsNotValid(toUpdate, res))
    return;

  User.findOne({ where: {id: req.params.userId } }).then((user) => {
    if (user) {
      user.update(toUpdate).then((userUpdated) => {
        logger.info('User updated');
        utils.respond(res, 200, userUpdated.toJSON());
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

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
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