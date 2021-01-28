const User = require('../../model/user');
const aux = require('../filterObjectKeys');
const utils = require('../reqResUtils');
require('dotenv').config();
const logger = require('../logger');

const userCreationKeys = ['firstname', 'lastname', 'email', 'country', 'phonenumber', 'birthdate']

const userKeys = [...userCreationKeys, 'photo'];

function getInvalidIdError(id) {
  let error = null;
  if ((typeof id !== 'number') || (id < 0) || (id % 1 !== 0))
    error = 'Id should be a positive integer';

  return error;
}

function getInvalidFirstnameError(firstname) {
  let error = null;
  if ((typeof firstname !== 'string') || (firstname.length > 30))
    error = 'firstname should be a string shorter than 30 characters';

  return error;
}

function getInvalidLastnameError(lastname) {
  let error = null;
  if ((typeof lastname !== 'string') || (lastname.length > 30))
    error = 'lastname should be a string shorter than 30 characters';

  return error;
}

function getInvalidEmailError(email) {
  let error = null;
  if ((typeof email !== 'string') || (email.length > 50) || !(email.includes('@')))
    error = 'email should be an email-like string shorter than 50 characters';

  return error;
}

function getInvalidCountryError(country) {
  let error = null;
  if ((typeof country !== 'string') || (country.length > 20))
    error = 'country should be a string shorter than 20 characters';

  return error;
}

function getInvalidPhonenumberError(phonenumber) {
  let error = null;
  if ((typeof phonenumber !== 'string') || (phonenumber.length > 20))
    error = 'phonenumber should be a string shorter than 20 characters';

  return error;
}

function getInvalidBirthdateError(birthdate) {
  let error = null;
  date = new Date(birthdate)
  if ((typeof birthdate !== 'string') || isNaN(date))
    error = 'birthdate should be a date-like string with the format YYYY-MM-DD';

  return error;
}

function getInvalidPhotoError(photo) {
  let error = null;
  if ((typeof photo !== 'string') || (photo.length > 256))
    error = 'photo should be a string shorter than 256 characters';

  return error;
}

function getAnyCreationAttributeIsInvalidError(payload) {
  let error = getInvalidIdError(payload["id"]);
  if (!error)
    error = getInvalidFirstnameError(payload["firstname"]);

  if (!error)
    error = getInvalidLastnameError(payload["lastname"]);

  if (!error)
    error = getInvalidEmailError(payload["email"]);
  
  if (!error)
    error = getInvalidCountryError(payload["country"]);
  
  if (!error)
    error = getInvalidPhonenumberError(payload["phonenumber"]);
  
  if (!error)
    error = getInvalidBirthdateError(payload["birthdate"]);

  return error;
}

function creationPayloadIsInvalid(payload, res) {
  let error = utils.getAttributeMissingError(payload, [...userCreationKeys, "id"]);
  
  if (!error) {
    error = getAnyCreationAttributeIsInvalidError(payload);
  }

  if (error) {
    logger.error('User could not be created,', error);
    utils.respond(res, 400, { error: error });
    return true;
  }
  return false;
}

function updatePayloadIsNotValid(payload, res) {
  let error = null;
  console.log("updating")
  console.log(payload)

  if (!error && payload["firstname"])
    error = getInvalidFirstnameError(payload["firstname"]);

  if (!error && payload["lastname"])
    error = getInvalidLastnameError(payload["lastname"]);
  
  if (!error && payload["email"])
    error = getInvalidEmailError(payload["email"]);
  
  if (!error && payload["country"])
    error = getInvalidCountryError(payload["country"]);

  if (!error && payload["phonenumber"])
    error = getInvalidPhonenumberError(payload["phonenumber"]);
  
  if (!error && payload["birthdate"])
    error = getInvalidBirthdateError(payload["birthdate"]);
  
  if (!error && payload["photo"])
    error = getInvalidPhotoError(payload["photo"]);

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