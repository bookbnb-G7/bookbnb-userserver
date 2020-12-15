const aux = require('./filterObjectKeys');
require('dotenv').config();
const logger = require('./logger');

function apiKeyIsNotValid(api_key, res) {
  if (!api_key || api_key != process.env.API_KEY) {
    respond(res, 401, { error: "unauthorized" });
    return true;
  }

  return false;
}

function respond(res, status, res_body) {
  logger.info(`Response status: ${status}\n` +
    `\tResponse body: ${JSON.stringify(res_body)}`
  );
  res.status(status).json(res_body);
}

exports.apiKeyIsNotValid = apiKeyIsNotValid;
exports.respond = respond;